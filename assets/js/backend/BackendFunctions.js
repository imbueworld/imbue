import firebase from "firebase/app"
import "firebase/functions"



/**
 * 1.   If the request is valid (the user doesn't already own this class),
 *      documents it in the database
 * 2.   Charges the user
 * 3.   Updates cache with the new purchase
 */
export async function purchaseClasses(cache, { classIds, creditCardId, price, description }) {
    if (!cache.working) cache.working = 0
    cache.working += 1
    console.log("classIds", classIds) //
    try {
        await firebase.functions().httpsCallable("chargeCustomer")({ cardId: creditCardId, amount: price, description })
        await firebase.functions().httpsCallable("registerClasses")({ classIds })
        cache.user.active_classes.push(...classIds)
    } catch(err) {
        console.warn(err.message)
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
    console.log("membershipIds", membershipIds) //
    try {
        await firebase.functions().httpsCallable("chargeCustomer")({ cardId: creditCardId, amount: price, description })
        await firebase.functions().httpsCallable("registerMemberships")({ membershipIds })
        // update cache
        cache.user.active_memberships.push(...membershipIds)
    } catch(err) {
        console.warn(err.message)
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
    console.log("membershipIds", membershipIds)
    try {
        await firebase.functions().httpsCallable("cancelMemberships")({ membershipIds })
    } catch(err) {
        console.warn(err.message)
        throw new Error("Something prevented the action.")
    }
}

/**
 * Merges provided data with the data about the user that lives on the database.
 */
export async function addDataToUser(cache, { collection, data }) {
    cache.working += 1

    switch(collection) {
        case "users":
        case "partners":
            console.log("user before", cache.user)

            Object.entries(cache.user).forEach((key, value) => {
                Object.entries(data).forEach((key2, value2) => {
                    cache.user[key2] = value2
                })
            })

            console.log("user after", cache.user)
            break
    }

    try {
        await firebase.functions().httpsCallable("addDataToUser")({ collection, data })
    } catch(err) {
        console.warn(err.message)
        throw new Error("Something prevented the action.")
    }

    cache.working -= 1
}

/**
 * Merges provided data with the data about the gym that lives on the database.
 */
export async function addDataToGym(cache, { gymId, data }) {
    cache.working += 1

    console.log("gyms before", cache.gyms)

    cache.gyms.forEach((doc, idx) => {
        if (doc.id === gymId) {
            // gyms.splice(idx, 1)
            // return
            Object.entries(data).forEach((key, value) => {
                doc[key] = value
            })
        }
    })

    console.log("gyms after", cache.gyms)

    try {
        await firebase.functions().httpsCallable("addDataToGym")({ gymId, data })
    } catch(err) {
        console.warn(err.message)
        throw new Error("Something prevented the action.")
    }
    cache.working -= 1
}