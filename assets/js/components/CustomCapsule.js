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
        // top: 50,
        padding: 20,
        borderRadius: 40,
        backgroundColor: "#FFFFFF88", // "#e6e6e6",
    },
})