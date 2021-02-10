import database from "@react-native-firebase/database"

export async function sendMessage({ gymId, uid, message }) {
    const ref = database().ref(`livestreams/messages/${gymId}`)
    const node = ref.push()
    node.set({ uid, message, timestamp: Date.now() })
    return node
}

export async function registerParticipant({ gymId, uid, name, icon_uri }) {
    const ref = database().ref(`livestreams/participants/${gymId}`)
    
    let doc = {}
    doc[ uid ] = {
        name,
        icon_uri,
        here: true,
    }
    ref.update(doc)
}



/**
 * Does:
 *      [Read]   partners > (partner_id)
 *      [Call]   createLivestream
 */
// export async function initializeLivestream(cache) {
//     const user = await retrieveUserData(cache)
//     if (user.stream_key) return user.stream_key

//     let streamKey
//     try {
//         // 15 Attempts to retrieve stream key after stream has been created
//         // for the first time, or insta return the key
//         for (let i = 0; i < 15; i++) {
//             streamKey = (await firestore()
//                 .collection("partners")
//                 .doc(user.id)
//                 .get()
//             ).data().stream_key

//             if (!streamKey && i === 0) {
//                 // console.log("Creating a brand new stream.")
//                 const createLivestream = functions().httpsCallable("createLivestream")
//                 await createLivestream()
//                 // console.log("Awaiting of createLivestream() done")
//             } else if (!streamKey) {
//                 // console.log("Waiting for 4.5s.")
//                 await new Promise(r => setTimeout(r, 4500))
//             } else {
//                 break
//             }
//         }

//         // Update cache
//         cache.user.stream_key = streamKey

//         // console.log("Got some sort of streamKey, returning:", streamKey)

//         return streamKey
//     } catch (err) {
//         console.error(err)
//         throw new Error("Something prevented the action.")
//     }
// } 