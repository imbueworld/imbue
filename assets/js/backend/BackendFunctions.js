import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import functions from "@react-native-firebase/functions"
import storage from '@react-native-firebase/storage'
import { retrieveUserData, publicStorage } from "./CacheFunctions"
import ImagePicker from "react-native-image-picker"
import { PermissionsAndroid, Platform } from "react-native"

import config from '../../../App.config'
import cache from './storage/cache'



const BusyError = new Error()
BusyError.code = "busy"



/**
 * Does:
 *      [Write]  users > (uid) > USER_DOC
 *      [Write]  partners > (uid) > USER_DOC
 * 
 * Initializes the user account with necessary data
 */
export async function initializeAccount(cache, { first, last, email, password, type }, options = {}) {
  let account_type
  let uid
  let icon_uri_foreign = null

  if (!options.user) {
    // Manual sign up
    account_type = type
    const user = await auth().createUserWithEmailAndPassword(email, password)
    uid = user.user.uid
  } else {
    // Sign up through socials
    account_type = options.accountType
    const user = options.user
    uid = user.uid
    let names = user.displayName.split(" ")
    first = names[0]
    last = names.filter((name, idx) => idx !== 0).join(' ')
    email = user.email
    icon_uri_foreign = user.photoURL
  }

  let collection
  if (account_type === "user") collection = "users"
  if (account_type === "partner") collection = "partners"

  let authPromise = auth().currentUser.updateProfile({
    displayName: `${account_type}_${first} ${last}`
  })

  let form
  if (account_type === "partner") {
    form = {
      id: uid,
      account_type,
      first,
      last,
      email,
      icon_uri: "default-icon.png",
      icon_uri_foreign,

      associated_classes: [],
      associated_gyms: [],
      revenue: 0,
      revenue_total: 0,
    }
  } else {
    form = {
      id: uid,
      account_type,
      first,
      last,
      email,
      icon_uri: "default-icon.png",
      icon_uri_foreign,

      active_memberships: [],
      active_classes: [],
      scheduled_classes: [],
    }
  }

  let firestorePromise = firestore()
    .collection(collection)
    .doc(uid)
    .set(form)
  await Promise.all([authPromise, firestorePromise])

  // Update cache
  form.icon_uri_full =
    form.icon_uri_foreign
    || await publicStorage("default-icon.png")

  cache.user = form
}

/**
 * [Essentially does not require to be an external function from component]
 * 
 * Logs user in, sets their data in cache
 * Returns user data.
 */
export async function signIn(cache, { email, password }) {
  await auth().signInWithEmailAndPassword(email, password)
}

/**
 * Does:
 *      [Call]  addPaymentMethod
 * 
 * Takes:
 *  form -- must include { cardNumber, expMonth, expYear, cvc, name, address_zip }
 */
export async function addPaymentMethod(cache, { cardNumber, expMonth, expYear, cvc, cardHolderName, zip }) {
  const user = await retrieveUserData(cache)
  if (!user.payment_methods) user.payment_methods = []

  try {
    // Add payment method
    const addPaymentMethod = functions().httpsCallable("addPaymentMethod")
    let paymentMethod = (await addPaymentMethod(
      { cardNumber, expMonth, expYear, cvc, cardHolderName, zip })).data

    // Update cache
    user.payment_methods.push(paymentMethod)
  } catch (err) {
    console.error(`[CACHE]  [${err.code}]  ${err.message}`)
    throw new Error("Something prevented the action.")
  }
}

/**
 * Does:
 *      [Read]   users > (uid)
 *      [Call]   chargeCustomer
 *      [Call]   documentClassPurchase
 *      [Write]  users > (uid) > { active_classes, scheduled_classes }
 * 
 * 1.   Checks whether the user already has purchased the class
 * 2.   Charges the user
 * 3.   Updates cache with the new purchase
 * 4.   Automatically adds the new class to user's schedule
 */
export async function purchaseClasses(cache, { classId, timeIds, creditCardId, price, description, partnerId, gymId, purchaseType }) {
  if (timeIds.length !== 1) throw new Error("operates on the premise that purchase is being done on only one timeId; violated")

  if (cache.working.purchaseClasses) {
    BusyError.message = "A purchase is in process already. Hang tight. (You won't be charged twice)"
    throw BusyError
  }
  cache.working.purchaseClasses = true

  try {
    const user = await retrieveUserData(cache)
    const docRef = firestore()
      .collection("users")
      .doc(user.id)

    // Get some up-to-date data
    const userDoc = (await docRef.get()).data()
    let activeClasses = userDoc.active_classes || []
    let scheduledClasses = userDoc.scheduled_classes || []

    // Throw error, if user already owns this class
    const err = new Error("You already own this class.")
    err.code = "class-already-bought"
    // timeIds.forEach(id => {
    //     if (activeClasses.includes(id)) throw err
    // })
    let activeTimeIds = activeClasses.map(active => active.time_id)
    timeIds.forEach(id => {
      if (activeTimeIds.includes(id)) throw err
    })

    // Charge customer
    const chargeCustomer = functions().httpsCallable("chargeCustomer")
    await chargeCustomer({ cardId: creditCardId, amount: price, description })

    // Document payment
    const document = functions().httpsCallable("documentClassPurchase")
        /*await*/ document({ classId, timeId: timeIds[0], partnerId, amount: price, user: userDoc }) // operates on the premise that purchase is being done on only one timeId

    // Register classes for user
    let newActiveClasses = timeIds.map(timeId => ({
      class_id: classId,
      time_id: timeId,
    }))
    let newScheduleEntries = timeIds.map(timeId => ({
      class_id: classId,
      time_id: timeId,
    }))
    await docRef.set({
      // active_classes: [...activeClasses, ...timeIds],
      // scheduled_classes: [...scheduledClasses, ...timeIds],
      active_classes: [...activeClasses, ...newActiveClasses],
      scheduled_classes: [...scheduledClasses, ...newScheduleEntries],
    }, { merge: true })

    // Update cache
    // cache.user.active_classes.push(...timeIds)
    // cache.user.scheduled_classes.push(...timeIds)
    cache.user.active_classes.push(...newActiveClasses)
    cache.user.scheduled_classes.push(...newScheduleEntries)
  } catch (err) {
    // console.error(`[CACHE]  [${err.code}]  ${err.message}`)
    // throw new Error("Something prevented the action.")
    throw err
  } finally {
    cache.working.purchaseClasses = false
  }
}

/**
 * Does:
 *      [Read]   users > (uid)
 *      [Write]  users > (uid) > { scheduled_classes }
 */
export async function scheduleClasses(cache, { classId, timeIds }) {
  const user = await retrieveUserData(cache)

  const docRef = firestore()
    .collection("users")
    .doc(user.id)

  // Retrieve up-to-date relevant data,
  const userDoc = (await docRef.get()).data()
  let scheduledClasses = userDoc.scheduled_classes || []

  // Throw error, if a class has been scheduled already
  const err = new Error("Class has already been added to your schedule.")
  err.code = "class-already-scheduled"
  scheduledClasses.forEach(time_id => {
    if (timeIds.includes(time_id)) throw err
  })

  // Add to schedule
  let newEntries = timeIds.map(timeId => ({
    class_id: classId,
    time_id: timeId,
  }))
  await docRef.set({
    // scheduled_classes: [...scheduledClasses, ...timeIds]
    scheduled_classes: [...scheduledClasses, ...newEntries]
  }, { merge: true })

  // For partner's sake, and a feature that let's them see
  // who has scheduled their class
  const document = functions().httpsCallable("documentScheduledClass")
  timeIds.forEach(timeId => document({ classId, timeId, user: userDoc }))

  // Update cache
  // user.scheduled_classes.push(...timeIds)
  user.scheduled_classes.push(...newEntries)
}

/**
 * Does:
 *      [Read]   users > (uid)
 *      [Call]   subscribeCustomer
 *      [Call]   documentMembershipPurchase
 *      [Write]  users > (uid) > { active_memberships }
 * 
 * 1.   If the request is valid (the user doesn't already own this membership),
 *      documents it in the database
 * 2.   Charges the user
 * 3.   Updates cache with the new purchase
 */
export async function purchaseMemberships(cache, { membershipIds, creditCardId, price, description, partnerId, gymId }) {
  if (cache.working.purchaseMemberships) {
    BusyError.message = "A purchase is in process already. Hang tight. (You won't be charged twice)"
    throw BusyError
  }
  cache.working.purchaseMemberships = true

  try {
    const user = await retrieveUserData(cache)
    const docRef = firestore()
      .collection("users")
      .doc(user.id)

    // Get some up-to-date data
    const userDoc = (await docRef.get()).data()
    let activeMemberships = userDoc.active_memberships || []

    // Throw error, if user already owns this membership
    const err = new Error("You already own this membership.")
    err.code = "membership-already-bought"
    membershipIds.forEach(id => {
      if (activeMemberships.includes(id)) throw err
    })

    // Charge customer, creating a subscription
    const subscribeCustomer = functions().httpsCallable("subscribeCustomer")
    await subscribeCustomer({ gymId, cardId: creditCardId, amount: price, description })

    // Document payment
    const document = functions().httpsCallable("documentMembershipPurchase")
        /*await*/ document({ partnerId, gymId, amount: price })

    // Register membership
    await docRef.set({
      active_memberships: [...activeMemberships, ...membershipIds],
    }, { merge: true })

    // Update cache
    cache.user.active_memberships.push(...membershipIds)
  } catch (err) {
    // console.error(`[CACHE]  [${err.code}]  ${err.message}`)
    // throw new Error("Something prevented the action.")
    throw err
  } finally {
    cache.working.purchaseMemberships = false
  }
}

/**
 * Does:
 *      [Read]   users > (uid)
 *      [Call]   deleteSubscription
 *      [Write]  users > (uid) > { active_memberships }
 * 
 * 1.   Removes subscription
 * 2.   If successfully removed the subscription, removes it from the database
 * 2.   Updates cache with the new purchase
 */
export async function deleteSubscription(cache, { gymIds }) {
  if (cache.working.deleteSubscription) {
    BusyError.message = "Cancelling a subscription is already in progress. Hang tight."
    throw BusyError
  }
  cache.working.deleteSubscription = true

  const user = await retrieveUserData(cache)
  const userDocRef = firestore()
    .collection("users")
    .doc(user.id)

  try {
    let promises = []

    // Get some up-to-date data
    const userDoc = (await userDocRef.get()).data()

    // Delete subscription
    const deleteSubscription = functions().httpsCallable("deleteSubscription")
    promises.push(deleteSubscription({ gymIds }))

    // Remove it from user doc
    let newActiveMemberships = userDoc.active_memberships
      .filter(id => {
        if (!gymIds.includes(id)) return true
      })
    promises.push(
      userDocRef.set({
        active_memberships: newActiveMemberships,
      }, { merge: true })
    )

    // execution
    await Promise.all(promises)

    // Update cache
    cache.user.active_memberships = newActiveMemberships
  } catch (err) {
    throw err
  } finally {
    cache.working.deleteSubscription = false
  }
}

/**
 * Does:
 *      [Write]  users > (uid) > USER_DOC
 * 
 * Merges provided data with the data about the user that lives on the database.
 */
export async function updateUser(cache, doc) {
  const user = await retrieveUserData(cache)
  let collection
  if (user.account_type === "user") collection = "users"
  else if (user.account_type === "partner") collection = "partners"

  // Update database
  await firestore()
    .collection(collection)
    .doc(user.id)
    .set(doc, { merge: true })

  // Update cache
  Object.entries(doc).forEach(([key, value]) => {
    cache.user[key] = value
  })

  // Update the field shortcuts, that are obligatory,
  // and are seen instantiated in retrieveUserDate() as well.
  // [THIS "SHORTCUT" NOTION SHOULD BE DISCONTINUED -- ; TOO INCONVENIENT]
  user.name = `${user.first} ${user.last}`
}

/**
 * Does:
 *      [Write]  gyms > (gym_id) > GYM_DOC
 * 
 * Merges data with a gym of the provided gymId
 */
// export async function updateGym(cache, { gymId, doc }) {
//   if (!gymId) throw new Error("gymId must be provided in updateGym()")

//   if (!cache.gyms) cache.gyms = []

//   try {
//     // Update gym
//     await firestore()
//       .collection("gyms")
//       .doc(gymId)
//       .set(doc, { merge: true })

//     // Update cache
//     Object.entries(doc).forEach(([key, value]) => {
//       cache.gyms.forEach(gym => {
//         if (gym.id === gymId) {
//           Object.entries(gym).forEach(([key2, value2]) => {
//             gym[key] = value
//           })
//         }
//       })
//     })
//   } catch (err) {
//     console.error(err.message)
//     throw new Error("Something prevented the action.")
//   }
// }

/**
 * Does:
 *      [Write]  classes > (+) > CLASS_ENTITY_DOC
 *      [Read]   partners > (uid)
 *      [Write]  partners > (uid) > { associated_classes }
 * 
 * Compiles the form data of <NewClassForm />,
 * pushes it to database and updates cache.
 */
export async function createClass(cache, { instructor, name, description, genres, type, price, gym_id }) {
  const partner_id = auth().currentUser.uid
  let form = { instructor, name, description, genres, type, price, gym_id, partner_id }
  form.active_times = []

  try {
    // Add class to database
    let newClassRef = await firestore()
      .collection("classes")
      .add(form)

    // Update partner's associated classes
    let existingAssociatedClasses = (await firestore()
      .collection("partners")
      .doc(partner_id)
      .get()
    ).data().associated_classes

    await updateUser(cache, {
      associated_classes: [...existingAssociatedClasses, newClassRef.id],
    })

    // Update cache
    cache.classes.push(form)
  } catch (err) {
    console.error(`[CACHE]  [${err.code}]  ${err.message}`)
    throw new Error("Something prevented the action.")
  }
}

/**
 * Does:
 *      [Read]   classes > (class_id)
 *      [Write]  classes > (class_id) > { active_times }
 * 
 * TEMPLATE
 */
export async function populateClass(cache, { class_id, active_times }) {
  const classDocRef = firestore().collection("classes").doc(class_id)

  try {
    // Retrieve already added active_times
    let existingTimes = (await classDocRef.get()).data().active_times || []

    // Make sure that the times don't overlap; it's not allowed
    existingTimes.forEach(({ begin_time, end_time }) => {
      active_times.forEach(doc => {
        let begin_time_NEW = doc.begin_time
        let end_time_NEW = doc.end_time

        const err = new Error("Some class times overlap with already existing class times.")

        if (begin_time_NEW > begin_time
          && begin_time_NEW < end_time) {
          throw err
        }
        if (end_time_NEW > begin_time
          && end_time_NEW < end_time) {
          throw err
        }
        if (end_time_NEW === end_time
          && begin_time_NEW === begin_time) {
          throw err
        }
      })
    })

    // Populate class with data
    await classDocRef
      .set({
        active_times: [...existingTimes, ...active_times]
      }, { merge: true })

    // Update cache
    cache.classes.forEach((doc, idx) => {
      if (doc.id === class_id) cache.classes[idx].active_times.push(...active_times)
    })
  } catch (err) {
    console.error(`[CACHE populateClass]  [${err.code}]  ${err.message}`)
    // throw new Error("Something prevented the action.")
    throw err
  }

}

/**
 * Does:
 *      [Write]  to Firebase Storage
 */
export async function pickAndUploadFile(cache, setErrorMsg) {
  const user = await retrieveUserData(cache)

  if (Platform.OS = "android") {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ])
    Object.values(granted).forEach(status => {
      if (status !== "granted") {
        // const err = new Error("Not all permissions fulfilled.")
        // err.code = "permissions"
        // throw err
        setErrorMsg("Not all permissions fulfilled.")
      }
    })
  }

  ImagePicker.showImagePicker({}, async res => {
    if (res.didCancel) {
      // const err = new Error("Upload cancelled.")
      // err.code = "canceled"
      // throw err
    }
    else if (res.error) {
      console.error(res.error)
      // const err = new Error("Upload failed.")
      // err.code = "failed"
      // throw err
      setErrorMsg("Something prevented the action.")
    } else {
      const filePath = res.path
      const fileExt = res.type.split("/")[1]

      const fileSize = res.fileSize
      if (fileSize > 8 * 1024 * 1024) {
        // const err = new Error("File size must be less than 8MB.")
        // err.code = "file-size"
        // throw err
        setErrorMsg("File size must be less than 8MB.")
      }

      try {
        const fileRef = storage().ref(user.id)
        await fileRef.putFile(filePath)

        await updateUser(cache, {
          icon_uri: user.id,
        })
        setErrorMsg(null)
      } catch (err) {
        setErrorMsg("Something prevented the action.")
      }
    }
  })
}



/**
 * TEMPLATE
 */
export async function TEMPLATE(cache) {
  try { } catch (err) {
    throw new Error("Something prevented the action.")
  }
}

/**
 * [CURRENTLY NOT UTILIZNG MANY SETTINGS,
 * WHEREFORE CREATING A NEW COLLECTION "settings" DOESN'T SEEM NECESSARY]
 */
// export async function updateUserSetting(cache, doc) {

//     const user = retrieveUserData(cache)

//     try {
//         await firestore()
//             .collection("settings")
//             .doc(user.uid)
//             .set(doc, { merge: true })
//     } catch(err) {
//         throw new Error("Something prevented the action.")
//     }

// }






/**
 * allowed_return_type in options can be set to null to avoid using this filter.
 */
export function geocodeAddress(address, callback=(() => {}), options=defaultOptions.geocodeAddress) {
  let xhr = new XMLHttpRequest()
  xhr.onload = async () => {
    const res = JSON.parse(xhr.responseText)

    switch (res.status) {
      case 'OK':
        const geometry = res.results[ 0 ].geometry
        const location = geometry.location
        const { formatted_address } = res.results[ 0 ]
        let [latitude, longitude] = Object.values(location)

        let newRes = {
          location: {
            latitude,
            longitude,
          },
          formatted_address,
        }

        // If does not include an allowed return type, return null
        if (options.allowed_return_type
            && geometry.location_type != options.allowed_return_type) {
          callback(null)
          break
        }

        callback(newRes)
        break
      case 'ZERO_RESULTS':
        callback(null)
        break
      default:
        callback(null)
        break
    }
  }

  xhr.open(
    'GET',
    `https://maps.googleapis.com/maps/api/geocode/json`
    + `?address=${address}`
    + `&key=${config.GOOGLE_API_KEY}`
    + `&language=en`)

  xhr.send()
}



const defaultOptions = {
  geocodeAddress: {
    allowed_return_type: 'ROOFTOP',
  },
}



// export function updateGymAddress(address, callback) {
//   geocodeAddress(address, async res => {
//     if (!res) {
//       callback(null)
//       return
//     }

//     const { location, formatted_address } = res
//     const gymId = cache('user').get('throw').associated_gyms[0]

//     await firestore()
//       .collection('gyms')
//       .doc(gymId)
//       .set({
//         coordinate: location,
//         address: formatted_address,
//       }, { merge: true })
    
//     callback('OK')
//   })
// }
