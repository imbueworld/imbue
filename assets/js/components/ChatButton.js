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
                source={require("./img/chat-bubble-icon-2.png")}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 75,
        height: 75,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 999,
    },
    image: {
        flex: 1,
    },
})