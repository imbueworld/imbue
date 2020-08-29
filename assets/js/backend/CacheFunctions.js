// import firebase from "firebase/app"
// import "firebase/functions"
import auth from "@react-native-firebase/auth"
import firestore from "@react-native-firebase/firestore"
import storage from "@react-native-firebase/storage"
import LINKS from "../contexts/Links"



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
            .doc(user.uid)
            .get()
        // add shortcuts / necessary data adjustments for ease of access
        // SIGNIFICANT PARTS OF CODE OF THE APP DEPEND ON THIS
        let userData = doc.data()
        userData.name = `${userData.first} ${userData.last}`
        try {
            userData.icon_uri = await storage().ref(userData.id).getDownloadURL()
        } catch(err) {
            userData.icon_uri = LINKS.defaultIcons[0]
        }
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


    console.log("[retrieveUserData] cache.user", cache.user)

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
                // let filteredClasses = []
                // cache.classes.forEach(doc => {
                //     doc = {...doc}
                //     doc.active_times = doc.active_times.filter(time => {
                //         // if (user.active_classes.includes(time.time_id)) {
                //         if (user.scheduled_classes.includes(time.time_id)) {
                //             return true
                //         }
                //     })
                //     filteredClasses.push(doc)
                // })
                // return filteredClasses

                let activeClassIds = user.active_classes.map(active => active.class_id)
                return cache.classes
                    .filter(doc => activeClassIds.includes(doc.id))
            case "partner":
                return cache.classes
                    .filter(doc => doc.partner_id === user.id)
        }
    }

    // Construct a queue of absent ids in cache.classes
    //
    // Account for each time_id,
    // if one is not accounted for, it belongs in queue.
    let cached_ids = cache.classes.map(doc => doc.id)
    let queue = []
    switch (user.account_type) {
        case "user":
            // queue = user.active_classes
            //     .filter(id => !cached_ids.includes(id))

            // Queue up the absent active_classes ids
            user.active_classes.forEach(active => {
                if (!cached_ids.includes(active.class_id)) {
                    queue.push(active.class_id)
                }
            })

            // Queue up the absent scheduled_classes ids
            user.scheduled_classes.forEach(active => {
                if (!cached_ids.includes(active.class_id)) {
                    queue.push(active.class_id)
                }
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
 * Filters out the time_ids from class doc,
 * that the user hasn't signed up for.
 */
export async function filterUserClasses(cache) {
    const user = await retrieveUserData(cache)

    let newClasses = []
    cache.classes.forEach(classDoc => {
        classDoc = {...classDoc} // Must not mess up the cache
        // helper variable
        // let activeTimeIds = user.active_classes.map(active => active.time_id)
        // helper variable
        let activeTimeIds = user.scheduled_classes.map(active => active.time_id)
        classDoc.active_times = classDoc.active_times
            .filter(active => activeTimeIds.includes(active.time_id))
        newClasses.push(classDoc)
    })
    return newClasses
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
export async function retrieveAttendees(cache, { classId, timeId }) {
    if (cache.working.retrieveAttendees) {
        BusyError.message("TEMPLATE")
        throw BusyError
    }
    cache.working.retrieveAttendees = true

    const activeTimeDocRef = firestore()
        .collection("classes")
        .doc(classId)
        .collection("active_times")
        .doc(timeId)

    try {
        // Return data if already in cache
        if (cache.temp) {
            if (cache.temp.attendees) {
                if (cache.temp.attendees[ classId ]) {
                    if (cache.temp.attendees[ classId ][ timeId ]) {
                        if (cache.temp.attendees[ classId ][ timeId ].clients) {
                            return Object.values(
                                cache.temp.attendees[ classId ][ timeId ].clients
                            )
                        }
                    }
                }
            }
        }

        // Get data
        const clients = (await activeTimeDocRef
            .collection("clients")
            .get()
        ).docs.map(doc => {
            let data = doc.data()
            data.id = doc.id
            return data
        })

        // Update cache
        // cache.classes.forEach(classDoc => {
        //     if (classDoc.id === classId) {
        //         classDoc.active_times.forEach(activeTimeDoc => {
        //             if (activeTimeDoc.time_id === timeId) {
        //                 activeTimeDoc.clients = clients
        //             }
        //         })
        //     }
        // })
        if (!cache.temp) cache.temp = {}
        if (!cache.temp.attendees) cache.temp.attendees = {}

        let attendees = cache.temp.attendees
        if (!attendees[ classId ]) attendees[ classId ] = {}

        let classDoc = attendees[ classId ]
        if (!classDoc[ timeId ]) classDoc[ timeId ] = {}

        let timeDoc = classDoc[ timeId ]
        if (!timeDoc.clients) timeDoc.clients = {}

        clients.forEach(userDoc => {
            if (!timeDoc.clients[ userDoc.id ]) {
                timeDoc.clients[ userDoc.id ] = userDoc
            }
        })

        return clients
    } catch(err) {
        console.error(err.message)
        throw new Error("Something prevented the action.")
    } finally {
        cache.working.retrieveAttendees = false
    }
}

/**
 * Converts a just file name string into a fully functioning uri
 * to retrieve a file from Google Cloud Storage.
 */
export async function publicStorage(fileName) {
    // return `${LINKS.storage.public}${fileName}`

    let file = cache(`files/${fileName}`).get()
    if (!file) {
        file = await storage().ref(fileName).getDownloadURL()
        cache(`files/${fileName}`).set(file)
    }
    return file
}



const BusyError = new Error()
BusyError.code = "busy"



/**
 * TEMPLATE
 */
export async function TEMPLATE(cache) {
    if (cache.working.TEMPLATE) {
        BusyError.message("TEMPLATE")
        throw BusyError
    }
    cache.working.TEMPLATE = true

    try {} catch(err) {
        console.error(err.message)
        throw new Error("Something prevented the action.")
    } finally {
        cache.working.TEMPLATE = false
    }
}



const Cache = {}
export function cache(query) {
    const fields = query.split("/")
    let nextBase
    let previousBase
    fields.forEach(field => {
        if (nextBase) {
            previousBase = nextBase
            if (!nextBase[ field ]) nextBase[ field ] = {}
            nextBase = nextBase[ field ]
            return
        }
        previousBase = Cache
        if (!Cache[ field ]) Cache[ field ] = {}
        nextBase = Cache[ field ]
    })
    return {
        get: () => {
            return nextBase.data
        },
        set: (value) => {
            previousBase[ fields[fields.length - 1] ].data = value
        },
    }
}