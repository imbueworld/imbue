import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'



export default function CustomSelectButton(props) {
    const [slctdOpt, setSlctdOpt] = useState(Object.keys(props.options)[0])
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
                onPress={() => setSlctdOpt(arr[0])}
            >
                <Text
                    style={[
                        styles.optionText,
                        arr[0] !== slctdOpt ? styles.unselectedColor : {}
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
                props.style
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