import React from 'react'
import { StyleSheet, Text, View } from 'react-native'



export default function Component(props) {
    return (
        // <View style={[styles.label, props.style]}>
        <Text style={[styles.label, props.style]}>{props.children}</Text>
        // </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    label: {
        borderRadius: 999,
        backgroundColor: "lightgray",
        // padding: 15,
        // marginVertical: 8,
    },
})