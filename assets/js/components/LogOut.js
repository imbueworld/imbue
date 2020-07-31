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
                source={require("./img/png/sign-out-2.png")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 64,
        height: 64,
    },
    img: {
        width: "100%",
        height: "100%",
    },
})