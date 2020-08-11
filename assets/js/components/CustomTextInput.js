import React, { useState } from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import { colors } from '../contexts/Colors'



export default function CustomTextInput(props) {
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
                style={[
                    styles.input,
                    props.style
                ]}
                multiline={props.value > 15 ? false : true}
                numberOfLines={1}
                keyboardType={props.keyboardType || "default"}
                value={props.value !== undefined ? props.value : undefined}
                placeholder={props.placeholder}
                placeholderTextColor={colors.grayInactive}//"white"
                value={props.value || undefined}
                onChangeText={text => {
                    if (props.info) props.info[0] = text
                    if (props.onChangeText) props.onChangeText(text)
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
        borderRadius: 30,
        // backgroundColor: "lightgray",
        borderWidth: 1,
        borderColor: colors.gray,
    },
})