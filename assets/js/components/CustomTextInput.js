import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'



export default function CustomTextInput(props) {
    const [msg, setMsg] = useState(props.value || "")

    return (
        <View style={[
            styles.container,
            props.containerStyle
        ]}>

            {/* <View style={styles.placeholderContainer}>
                <Text style={[
                    styles.placeholder,
                    {
                        display: msg ? "none" : "flex",
                    },
                ]}>
                    {props.placeholder}
                </Text>
            </View> */}

            <TextInput
                multiline={msg.length > 15 ? false : true}
                numberOfLines={1}
                style={[
                    styles.input,
                    props.style
                ]}
                value={props.value !== undefined ? props.value : undefined}
                placeholder={props.placeholder}
                placeholderTextColor="white"
                value={msg}
                onChangeText={text => {
                    setMsg(text)
                    // props.onChangeText(text)
                }}
            />

            <View style={styles.inputBg} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 70,
        marginVertical: 10,
        justifyContent: "center",
    },
    input: {
        paddingVertical: 20,
        textAlign: "center",
        fontSize: 20,
        zIndex: 100,
    },
    // placeholderContainer: {
    //     width: "100%",
    //     height: "100%",
    //     position: "absolute",
    //     zIndex: 50,
    // },
    // placeholder: {
    //     flex: 1,
    //     color: "white",
    //     textAlign: "center",
    //     textAlignVertical: "center",
    //     fontSize: 20,
    // },
    inputBg: {
        width: "100%",
        height: "100%",
        position: "absolute",
        borderRadius: 999,
        backgroundColor: "lightgray",
    },
})