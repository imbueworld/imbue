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
        ]}>
            <TouchableWithoutFeedback
                onPress={props.onX}
            >
                <View style={styles.exit}/>
            </TouchableWithoutFeedback>
            
            <CustomCapsule
                containerStyle={[
                    styles.capsule,
                    props.containerStyle,
                ]}
                innerContainerStyle={props.innerContainerStyle}
            >
                {props.children}
            </CustomCapsule>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
        width: "88%",
        height: "88%",
        alignSelf: "center",
        backgroundColor: "lightgray",
    },
})