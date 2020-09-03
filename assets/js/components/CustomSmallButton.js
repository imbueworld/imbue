import React from 'react'
import { StyleSheet } from 'react-native'
import { colors } from '../contexts/Colors'
import CustomButton from './CustomButton'



export default function CustomSmallButton(props) {
    return (
        <CustomButton
            style={[styles.buttonSmall, props.style]}
            textStyle={styles.buttonText}
            title={props.title}
            onPress={props.onPress}
        />
    )
}

const styles = StyleSheet.create({
    buttonSmall: {
        alignSelf: "center",
        // marginVertical: 30,
        // paddingVertical: 10, // ???
        paddingHorizontal: 20,
    },
    buttonText: {
        // color: colors.gray,
        color: colors.buttonFill,
        fontSize: 14,
    },
})