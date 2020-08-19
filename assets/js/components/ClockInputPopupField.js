import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'



export default function ClockInputPopupField(props) {
    return (
        <View
            style={{
                // width: props.width,
                height: props.height,
                ...props.style,
            }}
        >
            <TouchableHighlight
                style={{
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                }}
                underlayColor="#00000008"
                onPress={() => props.onPress()}
            >
                <Text style={{
                    fontSize: 24,
                    // paddingBottom: 3,
                }}>{props.children}</Text>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({})