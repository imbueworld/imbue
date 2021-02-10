import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { colors } from '../contexts/Colors'



export default function CustomBar(props) {
    return (
        <View style={[styles.bar, props.style]}/>
    )
}

const styles = StyleSheet.create({
    bar: {
        marginVertical: 15,
        // borderColor: colors.gray,
        borderColor: colors.buttonFill,
        borderTopWidth: 1,
    },
})