import database from "@react-native-firebase/database"



export async function sendMessage({ gymId, uid, message }) {
    const ref = database().ref(`livestreams/messages/${gymId}`)
    const node = ref.push()
    node.set({ uid, message, timestamp: Date.now() })
    return node
}

export async function registerParticipant({ gymId, uid, name, icon_uri }) {
    const ref = database().ref(`livestreams/participants/${gymId}`)
    // const node = ref.push()
    // await node.set({ uid, name, icon_uri })
    // return node
    let doc = {}
    doc[ uid ] = {
        name,
        icon_uri,
        here: true,
    }
    ref.update(doc)
}

// export async function addParticipantListener(cache, gymId, participantHandler) {
//     if (!cache.livestream) cache.livestream = {}
//     if (cache.livestream.initialized) return
//     const ptcsNodeRef = database().ref(`livestreams/participants/${gymId}`)

//     await ptcsNodeRef.once('value', snap => {
//         cache.livestream.participants = Object.values(snap.val() || [])

//     })

//     ptcsNodeRef.limitToLast(1).on('child_added', snap => {
//         const ptc = snap.val()
//         console.log("ptcs", cache.livestream.participants)

//         // Do not add, if uid is already in ptcs
//         let existingUids = cache.livestream.participants.map(ptc => ptc.uid)
//         if (existingUids.includes(ptc.uid)) {
//             participantHandler(cache.livestream.participants)
//             return
//         }
//         // Append
//         cache.livestream.participants = [...cache.livestream.participants, ptc]
//         participantHandler(cache.livestream.participants)
//     })

//     cache.livestream.initialized = true

//     // function participantListener() {
//     //     let length = 0
//     //     let i = 0
//     //         if (i < 100) {console.log(i); i++}
//     //         if (cache.livestream.participants.length !== length) {
//     //             length = cache.livestream.participants.length
//     //             participantHandler(cache.livestream.participants)
//     //         }
//     // }
//     // participantListener()
// }