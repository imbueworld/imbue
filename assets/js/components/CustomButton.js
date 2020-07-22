import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'



export default function CustomButton(props) {
    return (
        <TouchableOpacity
            onPress={props.onPress}
        >
            <Text
                style={styles.button}
            >
                {props.title}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 999, // "999px",
        backgroundColor: "#fff",
        textAlign: "center",
        paddingTop: 15, // "1em",
        paddingBottom: 15, // "1em",
        marginTop: 15, // "1em",
        marginBottom: 15, // "1em",
        fontSize: 20, // "20px",
    },
})