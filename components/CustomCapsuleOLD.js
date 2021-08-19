import React from 'react'
import { StyleSheet, View } from 'react-native'



export default function CustomCapsule(props) {
    return (
        <View style={[
            styles.container,
            props.style
        ]}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        borderRadius: 25,
        backgroundColor: "#FFFFFF80", // "#e6e6e6",
    },
})