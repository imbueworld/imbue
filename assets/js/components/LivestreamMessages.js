import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { colors } from '../contexts/Colors'
import { fonts } from '../contexts/Styles'

import database from "@react-native-firebase/database"
import { clockFromTimestamp, publicStorage } from '../backend/HelperFunctions'
import Icon from './Icon'

import { cache } from "../backend/CacheFunctions"



export default function LivestreamMessages(props) {
    const gymId = props.gymId
    const user = props.user

    const ptcsNodeRef = database().ref(`livestreams/participants/${gymId}`)
    const chatNodeRef = database().ref(`livestreams/messages/${gymId}`)

    const [ptcs, setPtcs] = useState([])
    const [chat, setChat] = useState([])

    /**
     * Forward set functions to cache,
     * so that they can be called from <LivestreamLayout />
     * rerendering only and only this very component, not the whole tree,
     * which would cause problems, like keyboard going down when typing
     */
    useEffect(() => {
        cache("livestream/functions/setParticipants").set(setPtcs)
        cache("livestream/functions/setChat").set(setChat)
    }, [])

    useEffect(() => {
        const read = async () => {
            let ptcs = cache("livestream/participants").get() || []
            setPtcs(ptcs)
            let chat = cache("livestream/chat").get() || []
            setChat(chat)
        }
        read()
    }, [])

    useEffect(() => {
        const init = async () => {
            // await ptcsNodeRef.once('value', async snap => {
            //     let data = snap.val()
            //     if (data) {
            //         let ptcs = Object.entries(data).map(([uid, userData]) => {
            //             userData.uid = uid
            //             return userData
            //         })
            //         // setPtcs(ptcs)
            //         // cache.livestream.participants = ptcs
            //         await AsyncStorage.setItem(
            //             "livestream/participants",
            //             JSON.stringify(ptcs)
            //         )
            //     }
            // })
            // ptcsNodeRef.limitToLast(1).on('child_added', snap => {
            //     // setPtcs(ptcs => {
            //     //     // Do not add, if uid is already in ptcs
            //     //     let existingUids = ptcs.map(ptc => ptc.uid)
            //     //     if (existingUids.includes(snap.val().uid)) return ptcs
            //     //     // Append
            //     //     return [...ptcs, snap.val()]
            //     // })
            // })
        }
        init()
    }, [])

    let newChat = chat.sort((a, b) => {
        let ts1 = a.timestamp
        let ts2 = b.timestamp
        return ts1 - ts2
    })
    newChat.forEach(message => {
        ptcs.forEach(ptc => {
            if (message.uid === ptc.uid) {
                 message.icon_uri = ptc.icon_uri
                 message.name = ptc.name
            }
        })
    })
    const sortedChat = newChat

    const Message = props => {
        const [iconUri, setIconUri] = useState(null)
        useEffect(() => {
            const init = async () => {
                let iconUri = await publicStorage(props.icon_uri)
                setIconUri = iconUri
            }
            init()
        }, [])

        const stickToRight = props.stickToRight
        const Time =
            <Text style={{
                marginRight: stickToRight ? 6 : 0,
                marginLeft: stickToRight ? 0 : 6,
                color: colors.grayInactive,
                textAlignVertical: "top",
                paddingTop: 3,
                fontSize: 12,
                fontFamily: fonts.default,
            }}>{clockFromTimestamp(props.timestamp)}</Text>
        const UserIcon =
            <Icon
                containerStyle={{
                    width: 47,
                    height: 47,
                    borderRadius: 999,
                    overflow: "hidden",
                }}
                source={{ uri: iconUri }}
            />
        
        return (
            <View style={{ flexDirection: stickToRight ? "row-reverse" : "row" }}>
                <View style={{
                    maxWidth: "88%",
                    marginVertical: 5,
                    paddingVertical: 7,
                    paddingRight: stickToRight ? 7 : 15,
                    paddingLeft: stickToRight ? 15 : 7,
                    borderWidth: 1,
                    borderColor: colors.gray,
                    borderRadius: 30,
                    flexDirection: "row",
                    ...props.containerStyle,
                }}>
                    {stickToRight
                    ?   null
                    :   UserIcon}

                    <View style={{
                        marginRight: stickToRight ? 10 : 0,
                        marginLeft: stickToRight ? 0 : 10,
                        alignItems: stickToRight ? "flex-end" : undefined,
                        flexShrink: 1,
                    }}>
                        <View style={{
                            flexDirection: "row",
                        }}>
                            {stickToRight
                            ?   Time
                            :   null}
                            <Text style={{
                                fontFamily: fonts.default,
                                flexShrink: 1,
                                ...props.labelStyle,
                            }}>{props.name}</Text>
                            {stickToRight
                            ?   null
                            :   Time}
                        </View>

                        <Text style={{
                            fontFamily: fonts.default,
                            ...props.style,
                        }}>{props.message}</Text>
                    </View>
                    
                    {stickToRight
                    ?   UserIcon
                    :   null}
                </View>
            </View>
        )
    }

    useEffect(() => {
        if (props.onMessage) props.onMessage(sortedChat[sortedChat.length - 1])
    })

    return sortedChat.map(({ name="Anonymous", message, uid, timestamp, icon_uri="default-icon.png" }, idx) =>
        <Message
            containerStyle={
                uid === user.id
                    ? styles.selfMsg
                    : styles.msg
            }
            labelStyle={styles.label}
            style={
                uid === user.id
                    ? styles.selfMsgText
                    : styles.msgText
            }
            stickToRight={
                uid === user.id
                    ? true
                    : false
            }
            {...{
                name,
                message,
                timestamp,
                icon_uri,
            }}
            key={idx}
        />
    )
}

const styles = StyleSheet.create({
    label: {
        fontSize: 15,
    },
    msg: {
        // maxWidth: "88%",
        // marginVertical: 5,
        // paddingVertical: 7,
        // paddingHorizontal: 20,
        // borderWidth: 1,
        // borderColor: colors.gray,
        // borderRadius: 30,
        backgroundColor: "#00000008",
    },
    msgText: {
        fontSize: 17,
    },
    selfMsg: {
        // maxWidth: "88%",
        // marginVertical: 5,
        // paddingVertical: 7,
        // paddingHorizontal: 20,
        // borderWidth: 1,
        // borderColor: colors.gray,
        // borderRadius: 30,
        backgroundColor: "#ffffff80",
    },
    selfMsgText: {
        fontSize: 17,
    },
})