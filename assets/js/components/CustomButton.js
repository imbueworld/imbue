import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import { simpleShadow, colors } from "../contexts/Colors"
import { fonts } from "../contexts/Styles"



export default function CustomButton(props) {
    return (
        // <View style={[
        //     styles.container,
        //     props.style,
        // ]}>
            <TouchableOpacity
                style={[
                    styles.button,
                    simpleShadow,
                    props.style,
                    {
                        paddingLeft: props.icon ? 24 : undefined,
                        justifyContent: props.icon ? "flex-start" : "center",
                    },
                ]}
                underlayColor="#eee"
                disabled={props.disabled}
                onPress={props.onPress || undefined}
                onLongPress={props.onLongPress || undefined}
            >

                {props.icon}

                <Text style={[
                    styles.text,
                    props.textStyle,
                    {
                        paddingLeft: props.icon ? 10 : undefined,
                    },
                ]}>
                    {props.title}
                </Text>

            </TouchableOpacity>
        // </View>
    )
}

const styles = StyleSheet.create({
    // container: {
    //     marginVertical: 20,
    // },
    button: {
        // flex: 1,
        marginVertical: 10,
        paddingVertical: 20,
        // paddingLeft: 24, // moved
        flexDirection: "row",
        borderRadius: 999,
        backgroundColor: "white",
    },
    text: {
        // paddingLeft: 10, // moved
        color: "#1b1b19",
        alignSelf: "center",
        fontSize: 18,
        fontFamily: fonts.default,
    },
})