import React from 'react'
import { StyleSheet, TouchableOpacity, Image } from 'react-native'



export default function ChatButton(props) {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                props.containerStyle,
            ]}
            onPress={props.onPress}
        >
            <Image
                style={[
                    styles.image,
                    props.style,
                ]}
                source={require("./img/png/chat-bubble-icon-2.png")}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        padding: 8,
        backgroundColor: "white",
        borderRadius: 999,
    },
    image: {
        width: "100%",
        height: "100%",
    },
})