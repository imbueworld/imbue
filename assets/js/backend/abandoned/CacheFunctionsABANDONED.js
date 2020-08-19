import firebase from "firebase/app"
import "firebase/functions"
import { storage } from "../contexts/Links"



/**
 * Retrieves credit card from cache, or
 * calls cloud for it and stores it in cache
 */
// export async function retrievePaymentMethods(cache) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     if (!cache.creditCards) cache.creditCards = []
    
//     if (!cache.creditCards.length) {
//         console.log("No credit cards were found in cache, retrieving from cloud.")
//         const getCustomerData = firebase.functions().httpsCallable("getCustomerData")
//         cache.creditCards = ( await getCustomerData() ).data
//     } else {
//         console.log("Found credit cards in cache, using those.")
//     }

//     cache.working -= 1
//     return cache.creditCards
// }

// /**
//  * Retrieves memberships from cache,
//  * or calls cloud for it and stores it in cache
//  */
// export async function retrieveMemberships(cache) {
//     if (!cache.activeMemberships) {
//         console.log("activeMemberships was NOT found in cache, calling cloud function.")
//         cache.activeMemberships = ( await firebase.functions().httpsCallable("")() ).data
//         return cache.activeMemberships
//     } else {
//         console.log("activeMemberships was found in cache, returning that.")
//         return cache.activeMemberships
//     }
// }

/**
 * Retrieves user data,
 * first from cache, if not there,
 * then from cloud, and saves into cache.
 */
// export async function retrieveUserData(cache) {
//     if (!cache.user) {
//         console.log("user was NOT found in cache, calling cloud function.")
//         let user = ( await firebase.functions().httpsCallable("getUserData")() ).data
//         // add shortcuts / necessary data adjustments for ease of access
//         user.icon_uri = `${storage.public}${user.icon_uri}`
//         user.name = `${user.first} ${user.last}`
//         cache.user = user
//     } else {
//         console.log("user was found in cache, returning that.")
//     }

//     if (!cache.user.active_classes) cache.user.active_classes = []
//     if (!cache.user.active_memberships) cache.user.active_memberships = []

//     return cache.user
// }

/**
 * memebershipIds -- optional,
 *  if passed in, retrieves only those,
 *  if not, gets all user's memebrships (cache.user.active_memberships)
 */
// export async function retrieveMemberships(cache, { membershipIds }) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     if (!cache.memberships) cache.memberships = []

//     let queue = []
//     let existingIds = cache.memberships.map(doc => doc.id)
    
//     cache.user.active_memberships.forEach(membershipId => {
//         if (!existingIds.includes(membershipId)) queue.push(membershipId)
//     })
//     membershipIds.forEach(membershipId => {
//         if (!existingIds.includes(membershipId)) queue.push(membershipId)
//     })
    
//     console.log("queue", queue) //
//     console.log("existingIds", existingIds) //
//     console.log("cache.user.active_memberships", cache.user.active_memberships) //
//     console.log("membershipIds", membershipIds) //

//     if (queue.length) {
//         console.log("[CACHE]  Memberships needed to be updated in cache.")
//         const getMemberships = firebase.functions().httpsCallable("getMemberships")
//         cache.memberships.push( ...( await getMemberships({ membershipIds }) ).data )

//         // If failed to find in "memberships" collection, try again in "gyms" collection,
//         // because that is where, currently, we are going to find normal memberships (tied to gyms)
//         let queue2 = []
//         let existingIds2 = cache.memberships.map(doc => doc.id)

//         cache.user.active_memberships.forEach(membershipId => {
//             if (!existingIds2.includes(membershipId)) queue2.push(membershipId)
//         })

//         if (queue2.length) {
//             let gyms = await retrieveGyms(cache, { gymIds: queue2 })
//             cache.memberships.push(...gyms)
//         }
//     } else {
//         console.log("[CACHE]  All memberships were found to be up to date in cache, returning those.")
//     }

//     console.log("cache.memberships", cache.memberships)

//     cache.working -= 1
//     if (!membershipIds) return cache.memberships
//     return cache.memberships
//         .filter(membership => membershipIds.includes(membership.id))
// }

/**
 * TEMPLATE
 */
// export async function retrievePastTransactions(cache) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     if (!cache.user) cache.user = {}

//     if (!cache.user.pastTransactions) {
//         console.log("pastTransactions was NOT found in cache, calling cloud function.")
//         cache.user.pastTransactions = ( await firebase.functions().httpsCallable("getUserTransactions")() ).data
//     } else {
//         console.log("pastTransactions was found in cache, returning that.")
//     }
//     cache.working -= 1
//     return cache.user.pastTransactions
// }

/**
 * Checks whether all of the classes in users.active_classes have data about them
 * added in cache.classes, if something is missing it is added.
 */
// export async function retrieveUserClasses(cache) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     if (!cache.classes) cache.classes = []

//     let queue = []
//     let existingIds = cache.classes.map(doc => doc.id)
    
//     cache.user.active_classes.forEach(classId => {
//         if (!existingIds.includes(classId)) queue.push(classId)
//     })

//     if (queue.length) {
//         console.log("classes was NOT fully updated in cache, calling cloud function.")
//         const getUserClasses = firebase.functions().httpsCallable("getUserClasses")
//         cache.classes.push( ...( await getUserClasses({ classIds: queue }) ).data )
//         console.log(420, cache.classes)
//     } else {
//         console.log("all classes were found to be up to date in cache, returning that.")
//     }

//     cache.working -= 1
//     return cache.classes
// }

/**
 * Retrieves data about each class that is tied to the partner (partner id)
 */
// export async function retrievePartnerClasses(cache) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     if (!cache.user) cache.user = {} //

//     // if (!cache.classes) {
//     if (!cache.user.class_entities) {
//         console.log("classes was NOT found in cache, calling cloud function.")
//         const getPartnerClasses = firebase.functions().httpsCallable("getPartnerClasses")
//         // cache.classes = ( await getPartnerClasses() ).data
//         cache.user.class_entities = ( await getPartnerClasses() ).data
//     } else {
//         console.log("classes was found in cache, returning that.")
//     }

//     cache.working -= 1
//     return cache.user.class_entities
//     // return cache.classes
// }

/**
 * Retrieves data about each class that is tied to a gym (gmy id)
 */
// export async function retrieveGymClasses(cache, gymId) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     if (!cache.gymClasses) cache.gymClasses = {}

//     if (!cache.gymClasses[gymId]) {
//         console.log(`gymClasses[${gymId}] was NOT found in cache, calling cloud function.`)
//         const getGymClasses = firebase.functions().httpsCallable("getGymClasses")
//         cache.gymClasses[gymId] = ( await getGymClasses(gymId) ).data
//     } else {
//         console.log(`gymClasses[${gymId}] was found in cache, returning that.`)
//     }
//     cache.working -= 1
//     return cache.gymClasses[gymId]
// }

/**
 * TEMPLATE
 */
// export async function retrieveAllGyms(cache) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     if (!cache.gyms) {
//         console.log("gyms was NOT found in cache, calling cloud function.")
//         let gyms = ( await firebase.functions().httpsCallable("getGyms")({}) ).data
//         // add shortcuts / necessary data adjustments for ease of access
//         gyms.forEach(gym => gym.image_uris.forEach((image_uri, idx) => {
//             gym.image_uris[idx] = `${storage.public}${gym.image_uris[idx]}`
//         }))
//         cache.gyms = gyms
//     } else {
//         console.log("gyms was found in cache, returning that.")
//     }
//     cache.working -= 1
//     return cache.gyms
// }

/**
 * TEMPLATE
 */
// export async function retrieveGyms(cache, { gymIds }) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     // let gyms = ( await retrieveAllGyms(cache) )
//     //     .filter(gym => gymIds.includes(gym.id))

//     if (!cache.gyms) cache.gyms = []

//     let queue = []
//     let existingIds = cache.gyms.map(doc => doc.id)
//     gymIds.forEach(gymId => {
//         if (!existingIds.includes(gymId)) queue.push(gymId)
//     })
    
//     if (queue.length) {
//         const getGyms = firebase.functions().httpsCallable("getGyms")
//         let gyms = ( await getGyms({ gymIds: queue }) ).data

//         // add shortcuts or necessary data adjustments for ease of access or actual necessity
//         gyms.forEach(gym => gym.image_uris.forEach((image_uri, idx) => {
//             gym.image_uris[idx] = `${storage.public}${gym.image_uris[idx]}`
//         }))

//         cache.gyms.push(...gyms)
//     }

//     cache.working -= 1
//     return cache.gyms
// }

/**
 * TEMPLATE
 */
// export async function retrievePlaybackId(cache, { gymId }) {
//     if (!cache.working) cache.working = 0
//     cache.working += 1

//     if (!cache.mux) cache.mux = {}
//     if (!cache.mux.streams) cache.mux.streams = {}

//     if (!cache.mux.streams[ gymId ]) {
//         console.log("mux.streams was NOT found in cache, calling cloud function.")
//         const getPlaybackId = firebase.functions().httpsCallable("getPlaybackId")
//         cache.mux.streams[ gymId ] = ( await getPlaybackId({ gymId }) ).data
//     } else {
//         console.log("mux.streams was found in cache, returning that.")
//     }
//     cache.working -= 1
//     return cache.mux.streams
// }



/**
 * TEMPLATE
 */
export async function TEMPLATE(cache) {
    if (!cache.working) cache.working = 0
    cache.working += 1

    if (!cache.TEMPLATE) {
        console.log("TEMPLATE was NOT found in cache, calling cloud function.")
        const templateFunc = firebase.functions().httpsCallable("templateFunc")
        cache.TEMPLATE = ( await templateFunc ).data
    } else {
        console.log("TEMPLATE was found in cache, returning that.")
    }
    cache.working -= 1
    return cache.TEMPLATE
}