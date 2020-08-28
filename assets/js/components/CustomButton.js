import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import { simpleShadow, colors } from "../contexts/Colors"
import { fonts } from "../contexts/Styles"
import { TouchableHighlight } from 'react-native-gesture-handler'



export default function CustomButton(props) {
    const Icon = props.icon || props.Icon

    return (
        <TouchableHighlight
            style={{
                ...styles.button,
                ...simpleShadow,
                ...props.style,
                paddingLeft: Icon ? 24 : undefined,
                paddingRight: Icon ? 24 : undefined,
                justifyContent: Icon ? "flex-start" : "center",
                alignItems: "center",
            }}
            underlayColor="#efefef"
            disabled={props.disabled}
            onPress={props.onPress || undefined}
            onLongPress={props.onLongPress || undefined}
        >
            <>
            { Icon }

            <Text style={[
                styles.text,
                props.textStyle,
                {
                    paddingLeft: Icon ? 10 : undefined,
                    flexShrink: 1,
                },
            ]}>
                {props.title}
            </Text>
            </>
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    button: {
        marginVertical: 10,
        paddingVertical: 20,
        flexDirection: "row",
        borderRadius: 999,
        backgroundColor: "white",
    },
    text: {
        color: colors.gray,
        alignSelf: "center",
        fontSize: 18,
        fontFamily: fonts.default,
    },
})