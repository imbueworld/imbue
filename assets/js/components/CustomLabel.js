import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'



export default function Component(props) {
    return (
        <View style={styles.container}>
            <ScrollView style={[styles.content, props.style]}>
                <Text>{props.children}</Text>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
    content: {
        borderRadius: 999,
        backgroundColor: "lightgray",
        padding: 15,
        marginVertical: 8,
    },
})