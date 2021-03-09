import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { colors } from "../contexts/Colors"
import { FONTS } from '../contexts/Styles'



export default function CustomText(props) {
    return (
        <View style={[
            styles.container,
            props.containerStyle,
        ]}>

            <Text style={[
                styles.text,
                styles.font,
                props.style,
            ]}>
                {props.children}
            </Text>

            { props.label ?
                <Text style={{
                    ...styles.label,
                    ...styles.font,
                }}>
                    {props.label}
                </Text>
            : <View />}
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        // backgroundColor: "lightgray",
        // borderWidth: 1,
        // borderColor: colors.gray,
        // borderColor: colors.buttonFill,
        overflow: "hidden",
    },
    text: {
        marginVertical: 5,
        textAlign: "justify",
        fontSize: 12,
    },
    label: {
        paddingVertical: 3,
        // borderTopWidth: 1,
        // borderColor: `${colors.grayInactive}80`,
        // color: colors.grayInactive,
        // borderColor: colors.buttonFill,
        color: colors.buttonFill,
        textAlign: "center",
        fontSize: 8,
        marginStart: 20,
        marginEnd: 20,
        marginBottom: 5
    },
    font: {
        ...FONTS.body,
    },
})