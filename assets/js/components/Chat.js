import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text, Image, TouchableOpacity, TextInput } from 'react-native'

import { simpleShadow, colors } from "../contexts/Colors"

import CustomCapsule from "./CustomCapsule"



/**
 * props.data -- CHAT DATA
 * props.profileData -- FROM WHICH PROFILE'S PERSPECTIVE TO RENDER
 */
export default function Chat(props) {
    // const Message = (props) =>
    //     <View style={{ flexDirection: props.stickToRight ? "row-reverse" : "row" }}>
    //         <View style={props.containerStyle}>
    //             <Text style={props.labelStyle}>{props.name}</Text>
    //             <Text style={props.style}>{props.msg}</Text>
    //         </View>
    //     </View>
    
    // const chatContents = props.data.map(({ name, message, msgId, profileId }) =>
    //     <Message
    //         // Message text style
    //         containerStyle={
    //             profileId === props.profileData.profileId
    //             ?   styles.selfMsg
    //             :   styles.msg
    //         }
    //         labelStyle={styles.label}
    //         style={
    //             profileId === props.profileData.profileId
    //             ?   styles.selfMsgText
    //             :   styles.msgText
    //         }
    //         stickToRight={
    //             profileId === props.profileData.profileId
    //             ?   true
    //             :   false
    //         }
    //         name={name}
    //         msg={message}
    //         key={msgId}
    //     />
    // )

    const SendMessage = (props) => {
        const [msg, setMsg] = useState("")

        return (
            <View style={{
                // margin: 10,
                flexDirection: "row",
                backgroundColor: "#00000058",
                borderWidth: 1,
                borderColor: colors.gray,
                borderRadius: 40,
                ...props.containerStyle,
            }}>
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    borderTopLeftRadius: 40,
                    borderBottomLeftRadius: 40,
                    borderWidth: 3,
                    borderColor: "#ffffff00"
                    // borderColor: textFocus ? "#e9e9e980" : "#00000058",
                }}>
                    <TextInput
                        style={{
                            paddingHorizontal: 10,
                            ...props.style,
                        }}
                        multiline
                        placeholder="Enter Message..."
                        placeholderTextColor="white"
                        blurOnSubmit={false}
                        value={msg}
                        onChangeText={setMsg}
                        onFocus={() => {if (props.onFocus) props.onFocus()}}
                        onBlur={() => {if (props.onBlur) props.onBlur()}}
                        onSubmitEditing={() => {
                            console.log("Yo!")
                            // props.onPress(msg)
                            // props.onBlur()
                        }}
                    />
                </View>
                <TouchableOpacity
                    style={[
                        {
                            width: 50,
                            height: 50,
                            padding: 10,
                            backgroundColor: "white",
                            borderRadius: 999,
                        },
                        simpleShadow,
                    ]}
                    onPress={() => {
                        if (!props.onPress) return
                        props.onPress(msg)
                        setMsg("")
                    }}
                >
                    <Image
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        source={require("./img/png/send.png")}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    const inpRef = useRef(null)

    function setTextFocus(textFocus) {
        if (!inpRef.current) return

        let style = {
            ...styles.container,
            ...props.containerStyle,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
        }
        let modifiedStyle = {}
        if (textFocus) {
            modifiedStyle = {
                width: "100%",
                marginLeft: 0,
                marginRight: 0,
                marginTop: 0,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                height: "95%",
            }
        }
        style = {...style, ...modifiedStyle}

        inpRef.current.setNativeProps({ style })
    }

    return (
        <CustomCapsule
            containerStyle={{
                ...styles.container,
                ...props.containerStyle,
            }}
            innerContainerStyle={{
                height: "100%",
            }}
            containerRef={inpRef}
        >
            {/* <View style={{ flex: 1 }}> */}
            <ScrollView
                keyboardShouldPersistTaps="handled"
            >
                <View style={{
                    paddingTop: 10,
                    paddingBottom: 10,
                }}>
                    {/* {chatContents} */}
                    {props.children}
                </View>
            </ScrollView>
            {/* </View> */}

            <SendMessage
                containerStyle={styles.msgInputContainer}
                style={styles.msgInput}
                onPress={props.onPress}
                onFocus={() => setTextFocus(true)}
                onBlur={() => setTextFocus(false)}
            />
        </CustomCapsule>
    )
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
    },

    msgInputContainer: {
        marginBottom: 11,
        position: "absolute",
        alignSelf: "center",
        bottom: 0,
    },
    msgInput: {
        fontSize: 17,
    },
    msgSendImg: {},
})