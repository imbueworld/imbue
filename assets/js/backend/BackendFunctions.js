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
 * 1.   If the request is valid (the user doesn't already own this class),
 *      documents it in the database
 * 2.   Charges the user
 * 3.   Updates cache with the new purchase
 */
export async function purchaseClasses(cache, { classIds, creditCardId, price, description, partnerId, gymId, purchaseType }) {
    // temporary guard clauses, to get purchaseClasses in code straight
    if (!partnerId) throw new Error("partnerId must be provided in purchaseClasses()")
    if (!purchaseType) throw new Error("purchaseType must be provided in purchaseClasses()")
    if (!gymId) throw new Error("gymId must be provided in purchaseClasses()")

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
        
        // Document payment
        const documentPayment = functions().httpsCallable("documentPayment")
        await documentPayment({ partnerId, gymId, purchaseType })
        
        // Register classes for user
        let activeClasses = ( await docRef.get() ).data().active_classes
        if (!activeClasses) activeClasses = []
        await docRef.set(
            { active_classes: [...activeClasses, ...classIds] },
            { merge: true }
        )

        // Update cache
        cache.user.active_classes.push(...classIds)
    } catch(err) {
        console.error(`[CACHE]  [${err.code}]  ${err.message}`)
        throw new Error("Something prevented the action.")
    }

    cache.working -= 1
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
        let activeMemberships = ( await docRef.get() ).data().active_memberships
        if (!activeMemberships) activeMemberships = []
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
    if (!cache.working) cache.working = 0
    cache.working += 1

    const user = await retrieveUserData(cache)
    let collection
    if (user.account_type === "user") collection = "users"
    else if (user.account_type === "partner") collection = "partners"

    // Update database
    await firestore()
        .collection(collection)
        .doc(user.uid)
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

    cache.working -= 1
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

    if (!cache.working) cache.working = 0
    cache.working += 1

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
                .doc(user.uid)
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

    cache.working -= 1
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