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
        borderRadius: 40,
        backgroundColor: "lightgray",
        overflow: "hidden",
    },
    text: {
        textAlign: "center",
        fontSize: 20,
    },
    label: {
        borderTopWidth: 1,
        borderColor: `${colors.grayInactive}80`,
        color: colors.grayInactive,
        textAlign: "center",
        fontSize: 14,
    },
})