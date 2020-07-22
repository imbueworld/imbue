import React from 'react'
import { StyleSheet, Image } from 'react-native'



export default function AppBackground(props) {
    return (
        <Image
            style={styles.image}
            source={require("./img/imbue-screen-bg.png")}
        />
    )
}

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: -100,
    },
})