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

    let paymentMethods
    try {
        paymentMethods = (await firestore()
            .collection("stripe_customers")
            .doc(user.id)
            .collection("payment_methods")
            .get()
        ).docs.map(doc => doc.data())
    } catch(err) {
        paymentMethods = []
    }

    user.payment_methods = paymentMethods

    return paymentMethods
}

/**
 * Retrieves user data,
 * first from cache, if not there,
 * then from cloud, and saves into cache.
 */
export async function retrieveUserData(cache) {
    if (cache.user) return cache.user

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
            .doc(user.id)
            .get()
        // add shortcuts / necessary data adjustments for ease of access
        // SIGNIFICANT PARTS OF CODE OF THE APP DEPEND ON THIS
        let userData = doc.data()
        // userData.uid = doc.id // removed
        // userData.icon_uri = `${storage.public}${userData.icon_uri}` // moved to doing publicStorage() from "HelperFunctions.js" instead
        userData.name = `${userData.first} ${userData.last}`
        // These 3 should be there at all times, since account creation, however -- another layer of making sure
        if (!userData.active_classes) userData.active_classes = []
        if (!userData.active_memberships) userData.active_memberships = []
        if (!userData.scheduled_classes) userData.scheduled_classes = []
        cache.user = userData
    } catch(err) {
        cache.working -= 1
        console.error(err.message)
        throw new Error("Something prevented the action.")
    }

    return cache.user
}

/**
 * Retrieves past transactinos from "stripe_users" collection
 */
export async function retrievePastTransactions(cache) {
    const user = await retrieveUserData(cache)
    if (user.pastTransactions) return user.pastTransactions

    user.pastTransactions = []
    
    let transactions = (await firestore()
        .collection("stripe_customers")
        .doc(user.id)
        .collection("payments")
        .get()
    ).docs.map(doc => doc.data())

    user.pastTransactions = transactions

    return transactions
}

/**
 * Checks whether all of the classes in users.active_classes have data about them
 * added in cache.classes, if something is missing it is added.
 * by Class Ids.
 */
export async function retrieveClassesByIds(cache, { classIds }) {
    throw new Error("Is this function really needed here? if yes, have to make it work properly")
    if (!classIds) throw new Error("classIds must be provided.")
    if (!cache.classes) cache.classes = []

    console.log("classIds", classIds)

    let queue = classIds.filter(classId => {
        cache.classes.forEach(({ id }) => {
            console.log("id", id)
            console.log("classId", classId)
            if (classId === id) return false
        })
        return true
    })
    console.log("cache.classes", cache.classes)
    console.log("queue", queue)

    let classes = []
    if (queue.length) {
        classes = (await firestore()
            .collection("classes")
            .where("id", "in", queue)
            .get()
        ).docs.map(doc => doc.data())
    }

    // Update cache
    cache.classes = [...cache.classes, ...classes]

    return cache.classes.filter(({ id }) => classIds.includes(id))
}

/**
 * Checks whether all of the classes in users.active_classes have data about them
 * added in cache.classes, if something is missing it is added.
 * by Gym Ids.
 */
export async function retrieveClassesByGymIds(cache, { gymIds }) {
    if (!cache.classes) cache.classes = []

    // Construct a queue
    let cachedClassGymIds = cache.classes.map(doc => doc.gym_id)
    let queue = gymIds.filter(gymId => !cachedClassGymIds.includes(gymId))

    // Get any missing-from-cache ids
    let classes = []
    if (queue.length) {
        classes = (await firestore()
            .collection("classes")
            .where("gym_id", "in", queue)
            .get()
        ).docs.map(doc => doc.data())
    }

    // Update cache
    cache.classes = [...cache.classes, ...classes]

    return cache.classes.filter(({ gym_id }) => gymIds.includes(gym_id))
}

/**
 * Retrieves class entities ("classes" collection),
 * based on user's active_classes (user.active_classses),
 * which stores time_ids (class_entity.active_times).
 */
export async function retrieveClassesByUser(cache) {
    const user = await retrieveUserData(cache)
    if (!cache.classes) cache.classes = []

    function appropriate() {
        switch (user.account_type) {
            case "user":
                // return cache.classes
                //     .filter(doc => user.active_classes.includes(doc.id))
                
                // Here, we basically take Class Entity and filter out the
                // unneeded time_ids from active_times propery.
                // All that by basically reconstructing a new doc of class entity.
                let filteredClasses = []
                cache.classes.forEach(doc => {
                    doc = {...doc}
                    doc.active_times = doc.active_times.filter(time => {
                        // if (user.active_classes.includes(time.time_id)) {
                        if (user.scheduled_classes.includes(time.time_id)) {
                            return true
                        }
                    })
                    filteredClasses.push(doc)
                })
                return filteredClasses
            case "partner":
                return cache.classes
                    .filter(doc => doc.partner_id === user.id)
        }
    }

    // Construct a queue of absent ids in cache.classes
    let cached_ids = cache.classes.map(doc => doc.id)

    // Account for each time_id,
    // if one is not accounted for, it belongs in queue.
    let queue
    switch (user.account_type) {
        case "user":
            // queue = user.active_classes
            //     .filter(id => !cached_ids.includes(id))
            queue = user.active_classes
                .filter(time_id => {
                    let c = 0
                    cache.classes.forEach(({ active_times }) => {
                        active_times.forEach(time => {
                            let time_id2 = time.time_id
                            if (time_id2 === time_id) c++
                        })
                    })
                    if (c) return false
                    else return true
                })
            break
        case "partner":
            queue = user.associated_classes
                .filter(id => !cached_ids.includes(id))
            break
    }

    if (queue && !queue.length) return appropriate()

    // Request data for absent ids
    let classes = (await firestore()
        .collection("classes")
        .where("id", "in", queue)
        .get()
    ).docs.map(doc => doc.data())

    // Update cache
    cache.classes.push(...classes)

    return appropriate()
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
 * Retrieves data about each class that is tied to a gym (gmy id)
 */
// export async function retrieveGymClasses(cache, gymId) {
//     throw new Error("Not Implemented") // Same same; up above
// }

/**
 * Retrieve gyms by their ids
 */
export async function retrieveGymsByIds(cache, { gymIds }) {
    if (!cache.gyms) cache.gyms = []

    // Construct a queue
    let cachedGymIds = cache.gyms.map(doc => doc.id)
    let queue = gymIds.filter(gymId => !cachedGymIds.includes(gymId))

    let gyms = []
    if (queue.length) {
        gyms = (await firestore()
            .collection("gyms")
            .where("id", "in", queue)
            .get()
        ).docs.map(doc => doc.data())
    }
    
    // Update cache
    cache.gyms = [...cache.gyms, ...gyms]

    return cache.gyms.filter(gym => gymIds.includes(gym.id))
}

/**
 * Retrieve gyms by their geolocation
 * [NOT YET IMPLEMENTED]
 * [DEFAULTING TO:  GET ALL]
 */
export async function retrieveGymsByLocation(cache, /*{ coordinate }*/) {
    // temporary
    if (cache.gyms) return cache.gyms

    if (!cache.gyms) cache.gyms = []

    // Construct a queue
    let cachedGymIds = cache.gyms.map(doc => doc.id)
    // ...
    
    let gyms = []
    // if (queue.length) {
        gyms = (await firestore()
            .collection("gyms")
            // ... queue utilization
            .get()
        ).docs.map(doc => doc.data())
    // }
    
    // Update cache
    let newComers = gyms.filter(gym => !cachedGymIds.includes(gym.id))
    cache.gyms = [...cache.gyms, ...newComers]

    return cache.gyms
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