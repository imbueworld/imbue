import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'



export default function CustomTextInput(props) {
    return (
        <View style={[
            styles.container,
            props.containerStyle
        ]}>
            <TextInput
                style={[
                    styles.input,
                    props.style
                ]}
                value={props.value !== undefined ? props.value : undefined}
                placeholder={props.placeholder}
                placeholderTextColor="white"
                onChangeText={text => props.onChangeText(text)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    input: {
        borderRadius: 999,
        backgroundColor: "lightgray",
        paddingVertical: 20,
        fontSize: 20,
        textAlign: "center",
    },
})