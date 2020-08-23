import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import functions from "@react-native-firebase/functions"
import { DEFAULT_ICONS } from "../contexts/Constants"
import { retrieveUserData } from "./CacheFunctions"
import { storage } from "../contexts/Links"



// /**
//  * Takes:
//  *  form -- must include { cardNumber, expMonth, expYear, cvc, name, address_zip }
//  */
// export async function updateUserProfile(cache, data) {
//     throw new Error("Not Implemented")
// }



/**
 * Initializes the user account with necessary data
 */
export async function initializeAccount(cache, { first, last, email, password, type }) {
    if (!cache.working) cache.working = 0
    cache.working += 1

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

    cache.working -= 1
}

/**
 * Logs user in, sets their data in cache
 * Returns user data.
 */
export async function signIn(cache, { email, password }) {
    if (!cache.working) cache.working = 0
    cache.working += 1

    await auth().signInWithEmailAndPassword(email, password)

    cache.working -= 1
}

/**
 * Takes:
 *  form -- must include { cardNumber, expMonth, expYear, cvc, name, address_zip }
 */
export async function addPaymentMethod(cache, { cardNumber, expMonth, expYear, cvc, cardHolderName, zip }) {
    if (!cache.working) cache.working = 0
    cache.working += 1

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

    cache.working -= 1
}

/**
 * 1.   Checks whether the user already has purchased the class
 * 2.   Charges the user
 * 3.   Updates cache with the new purchase
 * 4.   Automatically adds the new class to user's schedule
 */
export async function purchaseClasses(cache, { timeIds, creditCardId, price, description, partnerId, gymId, purchaseType }) {
    // temporary guard clauses, to get purchaseClasses in code straight
    if (!partnerId) throw new Error("partnerId must be provided in purchaseClasses()")
    if (!purchaseType) throw new Error("purchaseType must be provided in purchaseClasses()")
    if (!gymId) throw new Error("gymId must be provided in purchaseClasses()")

    const user = retrieveUserData(cache)

    const docRef = firestore()
        .collection("users")
        .doc(user.id)

    try {
        // Get some up-to-date data
        const userDoc = ( await docRef.get() ).data()
        let activeClasses = userDoc.active_classes || []
        let scheduledClasses = userDoc.scheduled_classes || []

        // Throw error, if user already owns this class
        const err = new Error("You already own this class.")
        err.code = "class-already-bought"
        timeIds.forEach(id => {
            if (activeClasses.includes(id)) throw err
        })
        
        // Charge customer
        const chargeCustomer = functions().httpsCallable("chargeCustomer")
        await chargeCustomer({ cardId: creditCardId, amount: price, description })
        
        // Document payment
        const documentPayment = functions().httpsCallable("documentPayment")
        await documentPayment({ partnerId, gymId, purchaseType, amount: price })
        
        // Register classes for user
        await docRef.set({
            active_classes: [...activeClasses, ...timeIds],
            scheduled_classes: [...scheduledClasses, ...timeIds]
        }, { merge: true })

        // Update cache
        cache.user.active_classes.push(...timeIds)
        cache.user.scheduled_classes.push(...timeIds)
    } catch(err) {
        // console.error(`[CACHE]  [${err.code}]  ${err.message}`)
        // throw new Error("Something prevented the action.")
        throw err
    }
}

export async function scheduleClasses(cache, { time_ids }) {
    const user = await retrieveUserData(cache)

    const docRef = firestore()
        .collection("users")
        .doc(user.id)
    
    // Retrieve up-to-date relevant data,
    let scheduledClasses = ( await docRef.get() ).data().scheduled_classes || []

    // Throw error, if a class has been scheduled already
    const err = new Error("Class has already been added to your schedule.")
    err.code = "class-already-scheduled"
    scheduledClasses.forEach(time_id => {
        if (time_ids.includes(time_id)) throw err
    })

    // Add to schedule
    await docRef.set({
        scheduled_classes: [...scheduledClasses, ...time_ids]
    }, { merge: true })

    // Update cache
    user.scheduled_classes.push(...time_ids)
}

/**
 * 1.   If the request is valid (the user doesn't already own this membership),
 *      documents it in the database
 * 2.   Charges the user
 * 3.   Updates cache with the new purchase
 */
export async function purchaseMemberships(cache, { membershipIds, creditCardId, price, description }) {
    if (!cache.working) cache.working = 0
    cache.working += 1

    const uid = auth().currentUser.uid

    const docRef = firestore()
        .collection("users")
        .doc(uid)

    try {
        // Charge customer
        const chargeCustomer = functions().httpsCallable("chargeCustomer")
        await chargeCustomer({ cardId: creditCardId, amount: price, description })

        // Register membership
        let activeMemberships = ( await docRef.get() ).data().active_memberships || []
        await docRef.set(
            { active_memberships: [...activeMemberships, ...membershipIds] },
            { merge: true }
        )

        // Update cache
        cache.user.active_memberships.push(...membershipIds)
    } catch(err) {
        console.error(`[CACHE]  [${err.code}]  ${err.message}`)
        throw new Error("Something prevented the action.")
    }

    cache.working -= 1
}

/**
 * 1.   Removes subscription
 * 2.   If successfully removed the subscription, removes it from the database
 * 2.   Updates cache with the new purchase
 */
export async function cancelMemberships(cache, { membershipIds }) {
    if (!cache.working) cache.working = 0
    cache.working += 1

    // cancelMemberships

    // cache work

    cache.working -= 1
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

    if (!cache.working) cache.working = 0
    cache.working += 1

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

    cache.working -= 1
}

/**
 * [CURRENTLY NOT UTILIZNG MANY SETTINGS,
 * WHEREFORE CREATING A NEW COLLECTION "settings" DOESN'T SEEM NECESSARY]
 */
// export async function updateUserSetting(cache, doc) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     const user = retrieveUserData(cache)

//     try {
//         await firestore()
//             .collection("settings")
//             .doc(user.uid)
//             .set(doc, { merge: true })
//     } catch(err) {
//         throw new Error("Something prevented the action.")
//     }

//     cache.working -= 1
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
    if (!cache.working) cache.working = 0
    cache.working += 1

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

    cache.working -= 1
}

/**
 * TEMPLATE
 */
export async function populateClass(cache, { class_id, active_times }) {
    if (!cache.working) cache.working = 0
    cache.working += 1

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
    } catch(err) {
        console.error(`[CACHE populateClass]  [${err.code}]  ${err.message}`)
        // throw new Error("Something prevented the action.")
        throw err
    }

    // cache work
        // cache.classes.forEach((doc, idx) => {
        //     if (doc.id === class_id) cache.classes[idx].active_classes.push(active_classes)
        // })
        // [UNTESTED]

    cache.working -= 1
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
    if (!cache.working) cache.working = 0
    cache.working += 1

    try {} catch(err) {
        throw new Error("Something prevented the action.")
    }

    cache.working -= 1
}