import database from "@react-native-firebase/database"



export async function sendMessage({ gymId, uid, message }) {
    const ref = database().ref(`livestreams/messages/${gymId}`)
    const node = ref.push()
    node.set({ uid, message, timestamp: Date.now() })
    return node
}

export async function registerParticipant({ gymId, uid, name, icon_uri }) {
    const ref = database().ref(`livestreams/active_participants/${gymId}`)
    const node = ref.push()
    await node.set({ uid, name, icon_uri })
    return node
}