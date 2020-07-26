import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'



export default function CancelButton(props) {
    let i = 0

    return (
        <TouchableOpacity
            style={[
                styles.container,
                props.containerStyle,
            ]}
            onPress={()=>{i++; if (i >= 3) console.log("Hold to Exit")}}
            onLongPress={props.onLongPress}
        >
            <Text
                style={[
                    styles.text,
                    props.style,
                ]}
            >{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 75,
        padding: 10,
        justifyContent: "center",
        backgroundColor: "red",
        borderRadius: 999,
    },
    text: {
        fontSize: 20,
    },
})