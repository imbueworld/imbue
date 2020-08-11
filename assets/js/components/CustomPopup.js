import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'

import { colors } from "../contexts/Colors"

import CustomCapsule from "../components/CustomCapsule"
import CustomButton from './CustomButton'



/**
 * props
 * .onX
 * .children
 * .containerStyle
 */
export default function CustomPopup(props) {
    return (
        <View style={[
            styles.container,
            // props.containerStyle,
        ]}>
            <TouchableWithoutFeedback
                onPress={props.onX}
            ><View style={styles.exit}/></TouchableWithoutFeedback>
            
            <CustomCapsule style={[
                styles.capsule,
                props.containerStyle
            ]}>
                {props.children}
            </CustomCapsule>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "none",
        width: "100%",
        height: "100%",
        position: "absolute",
        justifyContent: "center",
        zIndex: 1000,
    },
    exit: {
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: `#00000045`,//`${colors.gray}40`,
        zIndex: -1000,
    },
    capsule: {
        width: "85%",
        alignSelf: "center",
        backgroundColor: "lightgray",
    },
})