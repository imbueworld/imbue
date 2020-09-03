import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'



export default function Component(props) {
    return (
        <View style={styles.container}>
            <Text>{props.time}</Text>
            <Text>{props.title}</Text>
            <Text>{props.trainer}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 999,
        backgroundColor: "white",
        alignItems: "center",
    },
})