import React from 'react'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native'



export default function CustomTextInput(props) {
    return (
        <TextInput
            style={styles.textInput}
            defaultValue=""
            placeholder={props.placeholder}
        />
    )
}

const styles = StyleSheet.create({
    textInput: {
        borderRadius: 999, // "999px",
        backgroundColor: "lightgray",
        textAlign: "center",
        paddingTop: 15, // "1em",
        paddingBottom: 15, // "1em",
        marginTop: 8, // "0.5em",
        marginBottom: 8, // "0.5em",
        fontSize: 20, // "20px",
    }
})