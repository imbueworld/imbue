import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'



export default function CustomSelectButton(props) {
    /**
     * props
     * .options -- {label: repr_string, ..}
     * .info -- transfers information over to parent component
     * .containerStyle -- style of <View /> container
     * .textStyle -- style of text
     */

    const [slctdOpt, setSlctdOpt] = useState(Object.keys(props.options)[0])
    if (props.info) props.info[0] = slctdOpt
    const gap = 100 / Object.keys(props.options).length

    let slctdIdx = null
    const options = Object.entries(props.options).map((arr, idx) => {
        if (arr[0] === slctdOpt) slctdIdx = idx
        // arr[1] is the formatted label
        return (
            <TouchableOpacity
                style={[
                    styles.option,
                    // arr[0] === slctdOpt ? styles.selected : {},
                    {
                        width: `${gap}%`,
                        left: `${gap * idx}%`,
                    }
                ]}
                key={arr[0]}
                onPress={() => {
                    setSlctdOpt(arr[0])
                    if (props.onPress) props.onPress
                }}
            >
                <Text
                    style={[
                        styles.optionText,
                        arr[0] !== slctdOpt ? styles.unselectedColor : {},
                        props.textStyle,
                    ]}
                >
                    {arr[1]}
                </Text>
            </TouchableOpacity>
        )
    })

    const highlight =
        <View
            style={[
                styles.highlight,
                {
                    width: `${gap}%`,
                    left: `${gap * slctdIdx}%`,
                }
            ]}
        />

    return (
        <View
            style={[
                styles.container,
                props.containerStyle,
            ]}
        >
            {options}
            {highlight}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        marginVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "lightgray",
        borderRadius: 999,
    },
    option: {
        alignItems: "center",
        position: "absolute",
    },
    optionText: {
        color: "#1b1b19", // edited
        textAlign: "center",
        fontSize: 20,
    },
    unselectedColor: {
        color: "#696461",
    },
    highlight: {
        height: "100%",
        position: "absolute",
        backgroundColor: "white",
        borderRadius: 999,
        zIndex: -100,
    },
})