import React from 'react'
import { StyleSheet, Text, View } from 'react-native'



export default function CustomBar(props) {
    return (
        <View style={[styles.bar, props.style]}/>
    )
}

const styles = StyleSheet.create({
    bar: {
        marginVertical: 15,
        borderColor: "gray",
        borderTopWidth: 1,
    },
})