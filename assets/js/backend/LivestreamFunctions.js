import firestore from "@react-native-firebase/firestore"
import functions from "@react-native-firebase/functions"
import database from "@react-native-firebase/database"
import { retrieveUserData } from "./CacheFunctions"



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
 * TEMPLATE
 */
export async function initializeLivestream(cache) {
    const user = await retrieveUserData(cache)
    if (cache.user.stream_key) return cache.user.stream_key

    let streamKey
    try {
        // 15 Attempts to retrieve stream key after stream has been created
        // for the first time, or insta return the key
        for (let i = 0; i < 15; i++) {
            streamKey = (await firestore()
                .collection("partners")
                .doc(user.id)
                .get()
            ).data().stream_key

            if (!streamKey && i === 0) {
                console.log("Creating a brand new stream.")
                const createLivestream = functions().httpsCallable("createLivestream")
                await createLivestream()
            } else if (!streamKey) {
                console.log("Waiting for 4.5s.")
                await new Promise(r => setTimeout(r, 4500))
            } else {
                break
            }
        }

        // Update cache
        cache.user.stream_key = streamKey

        return streamKey
    } catch (err) {
        console.error(err)
        throw new Error("Something prevented the action.")
    }
}