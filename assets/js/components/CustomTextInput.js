import React from 'react'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native'



export default function CustomTextInput(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{props.label}</Text>
            <TextInput
                style={styles.input}
                value={props.value}
                placeholder={`${props.placeholder}`}
                onChangeText={text => props.onChangeText(text)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 999,
        backgroundColor: "lightgray",
        // paddingTop: 15,
        // paddingBottom: 15,
        // marginTop: 8,
        // marginBottom: 8,
        paddingVertical: 15,
        marginVertical: 8,
    },
    label: {
        textAlign: "center",
        fontSize: 12,
    },
    input: {
        textAlign: "center",
        fontSize: 20,
    },
})