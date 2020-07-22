import React from 'react'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native'



export default function CustomTextInput(props) {
    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, props.style]}
                value={props.value !== undefined ? props.value : undefined}
                placeholder={props.placeholder}
                onChangeText={text => props.onChangeText(text)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    input: {
        borderRadius: 999,
        backgroundColor: "lightgray",
        paddingVertical: 15,
        marginVertical: 8,
        textAlign: "center",
        fontSize: 20,
    },
})