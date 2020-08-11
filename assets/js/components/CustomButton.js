import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight } from 'react-native'

import { simpleShadow, colors } from "../contexts/Colors"



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
                ]}
                underlayColor="#eee"
                onPress={props.onPress || undefined}
                onLongPress={props.onLongPress || undefined}
            >
                <Text style={[
                    styles.text,
                    props.textStyle
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
        marginVertical: 10,
        paddingVertical: 20,
        borderRadius: 999,
        backgroundColor: "#fff",
    },
    text: {
        color: "#1b1b19",
        textAlign: "center",
        fontSize: 20,
    },
})