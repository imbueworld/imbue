import React from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'



export default function CustomTextInput(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{props.label}</Text>
            <TextInput
                style={styles.input}
                placeholder={props.placeholder}
                value={props.value !== undefined ? props.value : undefined}
                onChangeText={text => props.onChangeText(text)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    label: {
        width: "100%",
        position: "absolute",
        top: 8,
        textAlign: "center",
        fontSize: 12,
    },
    input: {
        borderRadius: 999,
        backgroundColor: "lightgray",
        paddingVertical: 15,
        paddingTop: 15+12,
        paddingBottom: 15,
        marginVertical: 8,
        textAlign: "center",
        fontSize: 20,
    },
})