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
            <View
                style={[
                    styles.buttonContainer,
                    {
                        width: `${gap}%`,
                        height: 40 + 10, // +10 for user accommodation
                        left: `${gap * idx}%`,
                    }
                ]}
                key={arr[0]}
            >
                <TouchableOpacity
                    style={[
                        styles.button,
                        {
                            width: 40 + 10, // +10 for user accommodation
                        }
                    ]}
                    key={arr[0]}
                    onPress={() => toggleButton(idx)}
                >
                    <Text>{arr[1]}</Text>
                </TouchableOpacity>
            </View>
        )
    })

    const buttonBackgrounds = Object.entries(props.options).map((arr, idx) => {
        return (
            <View
                style={[
                    styles.buttonBgContainer,
                    {
                        width: `${gap}%`,
                        height: 40,
                        left: `${gap * idx}%`,
                    }
                ]}
                key={arr[0]}
            >
                <View
                    style={[
                        buttonStates[idx][0] ? styles.selected : styles.unselected,
                        {
                            width: 40,
                            height: "100%",
                        }
                    ]}
                    key={arr[0]}
                />
            </View>
        )
    })

    return (
        <View style={[
            styles.container,
            props.style
        ]}>
            {options}
            {buttonBackgrounds}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
    },
    buttonContainer: {
        // height: "100%",
        position: "absolute",
        alignItems: "center",
    },
    button: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonBgContainer: {
        // height: "100%",
        position: "absolute",
        alignItems: "center",
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