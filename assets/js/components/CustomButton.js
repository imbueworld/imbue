import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'



export default function CustomButton(props) {
    return (
        <View style={[
            styles.container,
            props.style
        ]}>
            <TouchableOpacity
                onPress={props.onPress}
            >
                <Text
                    style={styles.button}
                >
                    {props.title}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
    },
    button: {
        color: "#1b1b19", // gray // #C4C4C4 //// Material Gray #1b1b19 //// Less Black #4b4b43
        borderRadius: 999,
        backgroundColor: "#fff",
        textAlign: "center",
        paddingTop: 20,
        paddingBottom: 20,
        fontSize: 20,
    },
})