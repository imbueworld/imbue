import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'



export default function UserMemberships(props) {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}></ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {},
})