import firebase from "firebase/app"
import "firebase/functions"



// /**
//  * Takes:
//  *  form -- must include { cardNumber, expMonth, expYear, cvc, name, address_zip }
//  */
// export async function updateUserProfile(cache, data) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1
    
//     let user = retrieveUserData(cache)

//     try {
//         const addPaymentMethod = firebase.functions().httpsCallable("addPaymentMethod")
//         let paymentMethod = ( await addPaymentMethod(form) ).data
//         console.log("this is what is pushed", paymentMethod)
//         cache.creditCards.push(paymentMethod)
//     } catch(err) {
//         console.warn(err.message)
//         throw new Error("Something prevented the action.")
//     }

//     cache.working -= 1
// }

/**
 * Takes:
 *  form -- must include { cardNumber, expMonth, expYear, cvc, name, address_zip }
 */
// export async function addPaymentMethod(cache, form) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     if (!cache.creditCards) cache.creditCards = []

//     try {
//         const addPaymentMethod = firebase.functions().httpsCallable("addPaymentMethod")
//         let paymentMethod = ( await addPaymentMethod(form) ).data
//         console.log("this is what is pushed", paymentMethod)
//         cache.creditCards.push(paymentMethod)
//     } catch(err) {
//         console.warn(err.message)
//         throw new Error("Something prevented the action.")
//     }

//     cache.working -= 1
// }

/**
 * 1.   If the request is valid (the user doesn't already own this class),
 *      documents it in the database
 * 2.   Charges the user
 * 3.   Updates cache with the new purchase
 */
// export async function purchaseClasses(cache, { classIds, creditCardId, price, description }) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1
//     console.log("classIds", classIds) //
//     try {
//         await firebase.functions().httpsCallable("chargeCustomer")({ cardId: creditCardId, amount: price, description })
//         await firebase.functions().httpsCallable("registerClasses")({ classIds })
//         cache.user.active_classes.push(...classIds)
//     } catch(err) {
//         console.warn(err.message)
//         throw new Error("Something prevented the action.")
//     }
//     cache.working -= 1
// }

/**
 * 1.   If the request is valid (the user doesn't already own this membership),
 *      documents it in the database
 * 2.   Charges the user
 * 3.   Updates cache with the new purchase
 */
// export async function purchaseMemberships(cache, { membershipIds, creditCardId, price, description }) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1
//     console.log("membershipIds", membershipIds) //
//     try {
//         await firebase.functions().httpsCallable("chargeCustomer")({ cardId: creditCardId, amount: price, description })
//         await firebase.functions().httpsCallable("registerMemberships")({ membershipIds })
//         // update cache
//         cache.user.active_memberships.push(...membershipIds)
//     } catch(err) {
//         console.warn(err.message)
//         throw new Error("Something prevented the action.")
//     }
//     cache.working -= 1
// }

/**
 * 1.   Removes subscription
 * 2.   If successfully removed the subscription, removes it from the database
 * 2.   Updates cache with the new purchase
 */
// export async function cancelMemberships(cache, { membershipIds }) {
    // console.log("membershipIds", membershipIds)
    // try {
        // await firebase.functions().httpsCallable("cancelMemberships")({ membershipIds })
    // } catch(err) {
        // console.warn(err.message)
        // throw new Error("Something prevented the action.")
    // }
// }

/**
 * Merges provided data with the data about the user that lives on the database.
 */
// export async function addDataToUser(cache, { collection, data }) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     console.log(`Going to be updating in "${collection}"`)
//     Object.values(data).forEach(d => { console.log(d) })

//     switch(collection) {
//         case "users":
//         case "partners":
//             console.log("user before", cache.user)

//             Object.entries(data).forEach(([ key2, value2 ]) => {
//                 cache.user[key2] = value2
//             })
//             // Ease of access properties have to also be managed and updated
//             cache.user.name = `${cache.user.first} ${cache.user.last}`

//             console.log("user after", cache.user)
//             break
//     }

//     try {
//         const addDataToUser = firebase.functions().httpsCallable("addDataToUser")
//         await addDataToUser({ collection, data })
//     } catch(err) {
//         console.warn(err.message)
//         throw new Error("Something prevented the action.")
//     }

//     cache.working -= 1
// }

/**
 * Merges provided data with the data about the gym that lives on the database.
 */
// export async function addDataToGym(cache, { gymId, data }) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     console.log("gyms before", cache.gyms)

//     cache.gyms.forEach((doc, idx) => {
//         if (doc.id === gymId) {
//             // gyms.splice(idx, 1)
//             // return
//             Object.entries(data).forEach((key, value) => {
//                 doc[key] = value
//             })
//         }
//     })

//     console.log("gyms after", cache.gyms)

//     try {
//         await firebase.functions().httpsCallable("addDataToGym")({ gymId, data })
//     } catch(err) {
//         console.warn(err.message)
//         throw new Error("Something prevented the action.")
//     }
//     cache.working -= 1
// }

/**
 * Compiles the form data of <NewClassForm />,
 * pushes it to database and updates cache.
 */
// export async function createClass(cache, { instructor, name, description, genres, type, gym_id }) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     try {
        // const createClass = firebase.functions().httpsCallable("createClass")
        // await createClass({ instructor, name, description, genres, type, gym_id })
        // cache.temp.newClassForm = {}
//     } catch(err) {
//         console.warn(err.message)
//         throw new Error("Something prevented the action.")
//     }

//     cache.working -= 1
// }

/**
 * TEMPLATE
 */
// export async function populateClass(cache, { class_id, active_classes }) {
    // if (!cache.working) cache.working = 0
    // cache.working += 1

    // try {
        // const populateClass = firebase.functions().httpsCallable("populateClass")
        // await populateClass({ class_id, active_classes })
        // cache.classes.forEach((doc, idx) => {
        //     if (doc.id === class_id) cache.classes[idx].active_classes.push(active_classes)
        // })
        // [UNTESTED]
//     } catch(err) {
//         console.warn(err.message)
//         throw new Error("Something prevented the action.")
//     }

//     cache.working -= 1
// }



/**
 * TEMPLATE
 */
export async function TEMPLATE(cache) {
    if (!cache.working) cache.working = 0
    cache.working += 1

    try {
        const TEMPLATE = firebase.functions().httpsCallable("TEMPLATE")
    } catch(err) {
        console.warn(err.message)
        throw new Error("Something prevented the action.")
    }

    cache.working -= 1
}