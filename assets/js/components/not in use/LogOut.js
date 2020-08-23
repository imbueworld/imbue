import React from 'react'
import { StyleSheet, View, Image } from 'react-native'



export default function LogOut(props) {
    return (
        <View style={[
            styles.container,
            props.containerStyle,
        ]}>
            <Image
                style={[
                    styles.img,
                    props.style,
                ]}
                source={require("./img/png/sign-out-6.png")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 64,
        height: 64,
        // left: 1.35, // Make-up for the icon's flaw regarding centering
        left: 3,
        padding: 14,
    },
    img: {
        width: "100%",
        height: "100%",
    },
})