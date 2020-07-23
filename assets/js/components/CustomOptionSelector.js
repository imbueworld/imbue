import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'



export default function CustomOptionSelector(props) {
    const gap = 100 / Object.keys(props.options).length
    const buttonStates = []

    Object.entries(props.options).forEach((arr, idx) => {
        const [buttonToggled, setButtonToggled] = useState(false)
        buttonStates.push([buttonToggled, setButtonToggled])
    })

    function toggleButton(idx) {
        if (buttonStates[idx][0]) buttonStates[idx][1](false)
        else buttonStates[idx][1](true)
    }

    const options = Object.entries(props.options).map((arr, idx) => {
        return (
            <TouchableOpacity
                // style={buttonStates[idx][0] ? styles.selected : styles.unselected}
                style={[
                    styles.button,
                    {
                    width: 30, // `${gap}%`,
                    left: `${gap * idx}%`,
                    }
                ]}
                key={arr[0]}
                onPress={() => toggleButton(idx)}
            >
                <Text>{arr[1]}</Text>
            </TouchableOpacity>
        )
    })

    const buttonBackgrounds = Object.entries(props.options).map((arr, idx) => {
        return (
            <View
                style={[
                    styles.buttonBg,
                    buttonStates[idx][0] ? styles.selected : styles.unselected,
                    {
                        width: 30, // `${gap}%`,
                        left: `${gap * idx}%`,
                    }
                ]}
                key={arr[0]}
            />
        )
    })

    return (
        <View style={styles.container}>
            {options}
            {buttonBackgrounds}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 30,
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        alignItems: "center",
        position: "absolute",
    },
    buttonBg: {
        height: "100%",
        position: "absolute",
        zIndex: -100,
    },
    selected: {
        backgroundColor: "white",
        borderRadius: 999,
    },
    unselected: {
        backgroundColor: "lightgray",
        borderRadius: 999,
    },
})