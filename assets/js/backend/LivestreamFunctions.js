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
