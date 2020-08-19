import React from 'react'
import { StyleSheet, View, Text } from 'react-native'



export default function Notification(props) {
    return (
        <View style={{
            borderRadius: 30,
            backgroundColor: "green",
            ...props.containerStyle,
        }}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({})