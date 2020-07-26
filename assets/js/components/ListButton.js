import React from 'react'
import { StyleSheet, TouchableOpacity, Image } from 'react-native'



export default function ListButton(props) {
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
                source={require("./img/list-icon-2.svg")}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 75,
        height: 75,
        padding: 15,
        backgroundColor: "white",
        borderRadius: 999,
    },
    image: {
        flex: 1,
    },
})