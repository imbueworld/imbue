import React, { useState } from 'react'
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity, TextInput } from 'react-native'

import { simpleShadow } from "../contexts/Colors"

import CustomCapsule from "./CustomCapsule"



export default function Chat(props) {
    // props.data -- CHAT DATA
    // props.profileData -- FROM WHICH PROFILE'S PERSPECTIVE TO RENDER

    const Message = (props) =>
        <View style={{ flexDirection: props.stickToRight ? "row-reverse" : "row" }}>
            <View style={props.containerStyle}>
                <Text style={props.labelStyle}>{props.name}</Text>
                <Text style={props.style}>{props.msg}</Text>
            </View>
        </View>
    
    const chatContents = props.data.map(({name, msg, msgId, profileId}) =>
        <Message
            // Message text style
            style={
                profileId === props.profileData.profileId
                ?   styles.selfMsgText
                :   styles.msgText
            }
            labelStyle={styles.label}
            containerStyle={
                profileId === props.profileData.profileId
                ?   styles.selfMsg
                :   styles.msg
            }
            stickToRight={
                profileId === props.profileData.profileId
                ?   true
                :   false
            }
            name={name}
            msg={msg}
            key={msgId}
        />
    )

    const SendMessage = (props) => {
        const [msg, setMsg] = useState("")

        return (
            <View style={{
                margin: 10,
                flexDirection: "row",
                backgroundColor: "lightgray",
                borderRadius: 40,
            }}>
                <TextInput
                    style={[
                        {
                            flex: 1,
                            paddingHorizontal: 10,
                            // borderTopLeftRadius: 40,
                            // borderBottomLeftRadius: 40,
                        },
                        props.style,
                    ]}
                    multiline
                    placeholder="Enter Message..."
                    onChangeText={setMsg}
                    value={msg}
                />
                <TouchableOpacity
                    style={[
                        {
                            width: 50,
                            height: 50,
                            backgroundColor: "white",
                            borderRadius: 999,
                        },
                        simpleShadow,
                    ]}
                    onPress={() => {console.log(`Send: [${msg}]`)}}
                >
                    <Image
                        style={{
                            flex: 1,
                            margin: 10,
                        }}
                        source={require("./img/send-msg.svg")}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <CustomCapsule style={[
            styles.container,
            props.containerStyle,
        ]}>
            <ScrollView>
                <View /* First child, last child padding */ style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                }}>
                    {chatContents}
                    <SendMessage
                        style={styles.msgInput}
                    />
                </View>
            </ScrollView>
        </CustomCapsule>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 0,
        overflow: "hidden",
    },

    label: {
        fontSize: 15,
    },
    msg: {
        maxWidth: "85%",
        marginVertical: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "lightgray",
        borderRadius: 30,
    },
    msgText: {
        textAlign: "justify",
        fontSize: 17,
    },
    selfMsg: {
        maxWidth: "85%",
        marginVertical: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "flex-end",
        backgroundColor: "white",
        borderRadius: 30,
    },
    selfMsgText: {
        textAlign: "justify",
        fontSize: 17,
    },

    msgInput: {
        fontSize: 17,
    },
    msgSendImg: {},
})