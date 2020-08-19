import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'



export default function ClockInputDismissOverlay(props) {
    return (
        <View
            style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                // backgroundColor: "blue",
                zIndex: 100,
            }}
        >
            <TouchableWithoutFeedback
                style={{
                    width: "100%",
                    height: "100%",
                }}
                // onPress={() => {
                //     props.onPress(true)
                //     props.onPress(false)
                // }}
                // onLongPress={() => {
                //     props.onPress(true)
                //     props.onPress(false)
                // }}
                onPress={() => props.onPress()}
                // only inside of onLongPress does setting state work
                // I have no clue why that could be
                // maybe is not an issue on deployed app?
                onLongPress={() => props.onPress()}
            />
        </View>
    )
}

const styles = StyleSheet.create({})