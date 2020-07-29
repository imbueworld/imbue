import React from 'react'
import { StyleSheet, Image } from 'react-native'



export default function UserIcon(props) {
    return (
        <Image
            style={[
                styles.icon,
                props.style,
            ]}
            source={require("./img/user-icon-example.png")}
        />
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 200,
        height: 200,
        borderRadius: 999,
    },
})