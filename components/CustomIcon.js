import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'



export default function CustomIcon(props) {
    if (props.width) styles.image.width = props.width
    if (props.height) styles.image.height = props.height

    return (
        <Image
            style={styles.image}
            source={props.source}
            // source={require("../../google-logo.png")}
        />
    )
}

const styles = StyleSheet.create({
    container: {},
    image: {
        width: 64, // "64px",
        height: 64, // "64px",
    },
})