import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import { simpleShadow } from "../contexts/Colors"



export default function CustomButton(props) {
    return (
        <View style={[
            styles.container,
            props.style
        ]}>
            <TouchableOpacity
                style={[
                    styles.button,
                    simpleShadow,
                ]}
                onPress={props.onPress}
            >
                <Text style={styles.text}>
                    {props.title}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    button: {
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