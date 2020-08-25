import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import functions from "@react-native-firebase/functions"
import { DEFAULT_ICONS } from "../contexts/Constants"
import { retrieveUserData } from "./CacheFunctions"
import { storage } from "../contexts/Links"



const BusyError = new Error()
BusyError.code = "busy"



/**
 * Initializes the user account with necessary data
 */
export async function initializeAccount(cache, { first, last, email, password, type }) {
    let collection
    if (type === "user") collection = "users"
    if (type === "partner") collection = "partners"

    try {
        let user = await auth().createUserWithEmailAndPassword(email, password)
        const uid = user.user.uid
        let authPromise = auth().currentUser.updateProfile({
            displayName: `${type}_${first} ${last}`
        })
        let form = {
            account_type: type,
            first,
            last,
            email,
            icon_uri: DEFAULT_ICONS[0],
            active_memberships: [],
            active_classes: [],
            scheduled_classes: [],
        }
        let firestorePromise = firestore()
            .collection(collection)
            .doc(uid)
            .set(form)
        await Promise.all([ authPromise, firestorePromise ])
    } catch(err) {
        // For now, need to forward the error to the caller...
        throw err
        // throw new Error("Something prevented the action.")
    }
}

/**
 * Logs user in, sets their data in cache
 * Returns user data.
 */
export async function signIn(cache, { email, password }) {
    await auth().signInWithEmailAndPassword(email, password)
}

/**
 * Takes:
 *  form -- must include { cardNumber, expMonth, expYear, cvc, name, address_zip }
 */
export async function addPaymentMethod(cache, { cardNumber, expMonth, expYear, cvc, cardHolderName, zip }) {
    const user = await retrieveUserData(cache)
    if (!user.payment_methods) user.payment_methods = []

    try {
        // Add payment method
        const addPaymentMethod = functions().httpsCallable("addPaymentMethod")
        let paymentMethod = ( await addPaymentMethod(
            { cardNumber, expMonth, expYear, cvc, cardHolderName, zip }) ).data

        // Update cache
        user.payment_methods.push(paymentMethod)
    } catch(err) {
        console.error(`[CACHE]  [${err.code}]  ${err.message}`)
        throw new Error("Something prevented the action.")
    }
}

/**
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
        const userDoc = ( await docRef.get() ).data()
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
    } catch(err) {
        // console.error(`[CACHE]  [${err.code}]  ${err.message}`)
        // throw new Error("Something prevented the action.")
        throw err
    } finally {
        cache.working.purchaseClasses = false
    }
}

export async function scheduleClasses(cache, { classId, timeIds }) {
    const user = await retrieveUserData(cache)

    const docRef = firestore()
        .collection("users")
        .doc(user.id)
    
    // Retrieve up-to-date relevant data,
    const userDoc = ( await docRef.get() ).data()
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
        const userDoc = ( await docRef.get() ).data()
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
    } catch(err) {
        // console.error(`[CACHE]  [${err.code}]  ${err.message}`)
        // throw new Error("Something prevented the action.")
        throw err
    } finally {
        cache.working.purchaseMemberships = false
    }
}

/**
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
        const userDoc = ( await userDocRef.get() ).data()

        // Delete subscription
        const deleteSubscription = functions().httpsCallable("deleteSubscription")
        promises.push( deleteSubscription({ gymIds }) )

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
    } catch(err) {
        throw err
    } finally {
        cache.working.deleteSubscription = false
    }
}

/**
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
    Object.entries(doc).forEach(([ key, value ]) => {
        cache.user[key] = value
    })

    // Update the field shortcuts, that are obligatory,
    // and are seen instantiated in retrieveUserDate() as well.
    // [THIS "SHORTCUT" NOTION SHOULD BE DISCONTINUED -- ; TOO INCONVENIENT]
    if (doc.icon_uri) user.icon_uri = `${storage.public}${user.icon_uri}` // This already has a publicStorage() func from HelperFunctions.js
    user.name = `${user.first} ${user.last}`
}

/**
 * Merges data with a gym of the provided gymId
 */
export async function updateGym(cache, { gymId, doc }) {
    if (!gymId) throw new Error("gymId must be provided in updateGym()")

    if (!cache.gyms) cache.gyms = []

    try {
        // Update gym
        await firestore()
            .collection("gyms")
            .doc(gymId)
            .set(doc, { merge: true })

        // Update cache
        Object.entries(doc).forEach(([ key, value ]) => {
            cache.gyms.forEach(gym => {
                if (gym.id === gymId) {
                    Object.entries(gym).forEach(([ key2, value2 ]) => {
                        gym[ key ] = value
                    })
                }
            })
        })
    } catch(err) {
        console.error(err.message)
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
 * Merges provided data with the data about the gym that lives on the database.
 */
// export async function addDataToGym(cache, { gymId, data }) {
//     throw new Error("Not Implemented")
// }

/**
 * Compiles the form data of <NewClassForm />,
 * pushes it to database and updates cache.
 */
export async function createClass(cache, { instructor, name, description, genres, type, price, gym_id }) {
    const partner_id = auth().currentUser.uid
    let form = { instructor, name, description, genres, type, price, gym_id, partner_id }
    // form.active_times = []

    try {
        // Add class to database
        await firestore()
            .collection("classes")
            .add(form)
        
        // Update cache
        cache.classes.push(form)
    } catch(err) {
        console.error(`[CACHE]  [${err.code}]  ${err.message}`)
        throw new Error("Something prevented the action.")
    }
}

/**
 * TEMPLATE
 */
export async function populateClass(cache, { class_id, active_times }) {
    const classDocRef = firestore().collection("classes").doc(class_id)

    try {
        // Retrieve already added active_times
        let existingTimes = ( await classDocRef.get() ).data().active_times || []

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
        // cache.classes.forEach((doc, idx) => {
        //     if (doc.id === class_id) cache.classes[idx].active_classes.push(active_classes)
        // })
        // [UNTESTED]
    } catch(err) {
        console.error(`[CACHE populateClass]  [${err.code}]  ${err.message}`)
        // throw new Error("Something prevented the action.")
        throw err
    }

}

/**
 * TEMPLATE
 */
export async function initializeLivestream(cache) {
    const user = retrieveUserData(cache)
    if (cache.user.stream_key) return cache.user.stream_key

    let streamKey
    try {
        // async function getStreamKey() {
        //     return (await firestore()
        //         .collection("partners")
        //         .doc(user.uid)
        //         .get()
        //     ).data().stream_key
        // }

        // 15 Attempts to retrieve stream key after stream has been created
        // for the first time, or insta return they key
        for (let i = 0; i < 15; i++) {
            streamKey = (await firestore()
                .collection("partners")
                .doc(user.id)
                .get()
            ).data().stream_key

            if (!streamKey && i === 0) {
                const createLivestream = functions().httpsCallable("createLivestream")
                await createLivestream()
            } else if (!streamKey) {
                await new Promise(r => setTimeout(r, 4500))
            } else {
                break
            }
        }

        // Update cache
        cache.user.stream_key = streamKey
    } catch(err) {
        throw new Error("Something prevented the action.")
    }
}



/**
 * TEMPLATE
 */
export async function TEMPLATE(cache) {
    try {} catch(err) {
        throw new Error("Something prevented the action.")
    }
}