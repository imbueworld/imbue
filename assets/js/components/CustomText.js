import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { colors } from "../contexts/Colors"



export default function CustomText(props) {
    return (
        <View style={[
            styles.container,
            props.containerStyle,
        ]}>

            <Text style={[
                styles.text,
                props.style,
            ]}>
                {props.children}
            </Text>

            { props.label ?
                <Text style={styles.label}>
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
        borderWidth: 1,
        borderColor: colors.gray,
        padding: 5,
        overflow: "hidden",
    },
    text: {
        textAlign: "justify",
        fontSize: 18,
        fontFamily: 'sans-serif-light',
    },
    label: {
        borderTopWidth: 1,
        borderColor: `${colors.grayInactive}80`,
        color: colors.grayInactive,
        textAlign: "center",
        fontSize: 14,
        fontFamily: 'sans-serif-light',
    },
})