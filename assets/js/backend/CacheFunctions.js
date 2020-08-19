// import firebase from "firebase/app"
// import "firebase/functions"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import { storage } from "../contexts/Links"



/**
 * Retrieves credit card from cache, or
 * calls cloud for it and stores it in cache
 */
export async function retrievePaymentMethods(cache) {
    const user = await retrieveUserData(cache)
    if (!user.payment_methods) user.payment_methods = []
    if (user.payment_methods.length) return user.payment_methods
    
    if (!cache.working) cache.working = 0
    cache.working += 1

    let paymentMethods
    try {
        paymentMethods = (await firestore()
            .collection("stripe_customers")
            .doc(user.uid)
            .collection("payment_methods")
            .get()
        ).docs.map(doc => doc.data())
    } catch(err) {
        paymentMethods = []
    }

    user.payment_methods = paymentMethods

    cache.working -= 1
    return paymentMethods
}

/**
 * Retrieves user data,
 * first from cache, if not there,
 * then from cloud, and saves into cache.
 */
export async function retrieveUserData(cache) {
    if (cache.user) return cache.user

    if (!cache.working) cache.working = 0
    cache.working += 1

    const user = auth().currentUser
    let idx = user.displayName.search("_")
    let account_type = user.displayName.slice(0, idx)
    let collection
    switch(account_type) {
        case "user":
            collection = "users"
            break
        case "partner":
            collection = "partners"
            break
        default:
            cache.working -= 1
            throw new Error("Badly initialized user account. (Lacks 'partner_' or 'user_' handle in displayName)")
    }
    
    try {
        let doc = await firestore()
            .collection(collection)
            .doc(user.uid)
            .get()
        // add shortcuts / necessary data adjustments for ease of access
        // SIGNIFICANT PARTS OF CODE OF THE APP DEPEND ON THIS
        let userData = doc.data()
        userData.uid = doc.id
        // userData.icon_uri = `${storage.public}${userData.icon_uri}` // moved to doing publicStorage() from "HelperFunctions.js" instead
        userData.name = `${userData.first} ${userData.last}`
        // These 2 should be there at all times, since account creation, however -- another layer of making sure
        if (!userData.active_classes) userData.active_classes = []
        if (!userData.active_memberships) userData.active_memberships = []
        cache.user = userData
    } catch(err) {
        cache.working -= 1
        console.error(err.message)
        throw new Error("Something prevented the action.")
    }

    cache.working -= 1
    return cache.user
}

/**
 * Retrieves past transactinos from "stripe_users" collection
 */
export async function retrievePastTransactions(cache) {
    const user = await retrieveUserData(cache)
    if (user.pastTransactions) return user.pastTransactions

    if (!cache.working) cache.working = 0
    cache.working += 1

    user.pastTransactions = []
    
    let transactions = (await firestore()
        .collection("stripe_customers")
        .doc(user.uid)
        .collection("payments")
        .get()
    ).docs.map(doc => doc.data())

    user.pastTransactions = transactions

    cache.working -= 1
    return transactions
}

/**
 * Checks whether all of the classes in users.active_classes have data about them
 * added in cache.classes, if something is missing it is added.
 * by Class Ids.
 */
export async function retrieveClassesByIds(cache, { classIds }) {
    if (!classIds.length) return []
    // if (cache.classes) return cache.classes

    if (!cache.working) cache.working = 0
    cache.working += 1

    if (!cache.classes) cache.classes = []
    // cache.classes = []

    // let queue = classIds.map(id => {
    //     cache.classes.forEach(classDoc => {
    //         return classDoc.id !== id
    //     })
    // })

    let classes = (await firestore()
        .collection("classes")
        .where("id", "in", classIds)
        .get()
    ).docs.map(doc => doc.data())

    cache.classes = [...cache.classes, ...classes]

    cache.working -= 1
    return classes
}

/**
 * Checks whether all of the classes in users.active_classes have data about them
 * added in cache.classes, if something is missing it is added.
 * by Gym Ids.
 */
export async function retrieveClassesByGymIds(cache, { gymIds }) {
    if (!cache.working) cache.working = 0
    cache.working += 1

    if (!cache.classes) cache.classes = []

    let classes = (await firestore()
        .collection("classes")
        .where("gym_id", "in", gymIds)
        .get()
    ).docs.map(doc => doc.data())

    cache.classes = [...cache.classes, ...classes]

    cache.working -= 1
    return classes
}

/**
 * memebershipIds -- optional,
 *  if passed in, retrieves only those,
 *  if not, gets all user's memebrships (cache.user.active_memberships)
 */
// export async function retrieveMemberships(cache, { membershipIds }) {
//     throw new Error("Not Implemented")
// }

/**
 * Retrieves data about each class that is tied to the partner (partner id)
 */
// export async function retrievePartnerClasses(cache) {
//     throw new Error("Not Implemented") // Probably can tie it into one fucntion up above
// }

/**
 * Retrieves data about each class that is tied to a gym (gmy id)
 */
// export async function retrieveGymClasses(cache, gymId) {
//     throw new Error("Not Implemented") // Same same; up above
// }

/**
 * Retrieve gyms by their ids
 */
export async function retrieveGymsByIds(cache, { gymIds }) {
    if (!cache.working) cache.working = 0
    cache.working += 1

    if (!cache.gyms) cache.gyms = []

    // let queue = gymIds.map(id => {
    //     cache.gyms.forEach(gymDoc => {
    //         return gymDoc.id !== id
    //     })
    // })

    let gyms = (await firestore()
        .collection("gyms")
        .where("id", "in", gymIds)
        .get()
    ).docs.map(doc => doc.data())
    
    cache.gyms = [...cache.gyms, ...gyms]

    cache.working -= 1
    return gyms
}

/**
 * Retrieve gyms by their geolocation
 * [NOT YET IMPLEMENTED]
 * [DEFAULTING TO:  GET ALL]
 */
export async function retrieveGymsByLocation(cache, /*{ coordinate }*/) {
    if (!cache.working) cache.working = 0
    cache.working += 1

    if (!cache.gyms) cache.gyms = []

    let gyms = (await firestore()
        .collection("gyms")
        .get()
    ).docs.map(doc => doc.data())
    // ).docs.filter(doc => {
    //     cache.gyms.forEach(gym => {
    //         if (gym.id !== doc.id) return doc.data()
    //     })
    // })
    
    cache.gyms = [...cache.gyms, ...gyms]

    cache.working -= 1
    return gyms
}

/**
 * TEMPLATE
 */
// export async function retrieveGyms(cache, { gymIds }) {
//     throw new Error("Not Implemented")
// }

/**
 * TEMPLATE
 */
export async function retrievePlaybackId(cache, { gymId }) {
    if (!cache.livestreams) cache.livestreams = {}
    if (!cache.livestreams[ gymId ]) cache.livestreams[ gymId ] = {}
    if (cache.livestreams[ gymId ].playback_id)
        return cache.livestreams[ gymId ].playback_id

    if (!cache.working) cache.working = 0
    cache.working += 1

    let playback_id
    try {
        let partnerId = (await firestore()
            .collection("gyms")
            .doc(gymId)
            .get()
        ).data().partner_id

        playback_id = (await firestore()
            .collection("partners")
            .doc(partnerId)
            .collection("public")
            .doc("livestream")
            .get()
        ).data().playback_id
    } catch(err) {
        console.error(err.message)
        cache.working -= 1
        throw new Error("Something prevented the action.")
    }

    cache.livestreams[ gymId ].playback_id = playback_id

    cache.working -= 1
    return playback_id
}



/**
 * TEMPLATE
 */
export async function TEMPLATE(cache) {
    if (!cache.working) cache.working = 0
    cache.working += 1

    if (!cache.TEMPLATE) {
        try {
            let data
            cache.TEMPLATE = data
        } catch(err) {
            console.error(err.message)
            cache.working -= 1
            throw new Error("Something prevented the action.")
        }
    }

    cache.working -= 1
    return cache.TEMPLATE
}