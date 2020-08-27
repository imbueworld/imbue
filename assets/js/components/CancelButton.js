import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { fonts } from '../contexts/Styles';



export default function CancelButton(props) {
    let i = 0

    return (
        <TouchableOpacity
            style={[
                styles.container,
                props.containerStyle,
            ]}
            onPress={() => {i++; if (i >= 3) console.log("Hold to Exit")}}
            onLongPress={props.onLongPress}
        >
            <Text
                style={[
                    {
                        fontFamily: fonts.default,
                        fontSize: 18,
                        paddingHorizontal: 10,
                    },
                    props.style,
                ]}
            >{props.title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        padding: 10,
        justifyContent: "center",
        backgroundColor: "red",
        borderRadius: 999,
    },
})