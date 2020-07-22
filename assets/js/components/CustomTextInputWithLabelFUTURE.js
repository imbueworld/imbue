import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-paper'



export default function CustomTextInput(props) {
    return (
        <View style={styles.container}>
            {/* <Text style={styles.label} on>{props.label}</Text> */}
            <TextInput
                style={styles.input}
                label={props.placeholder}
                // placeholder={props.placeholder}
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
    input: {
        borderRadius: 999,
        backgroundColor: "lightgray",
        paddingVertical: 15,
        marginVertical: 8,
        // textAlign: "center",
        fontSize: 20,
    },
})