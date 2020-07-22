import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'



export default function TEMPLATE(props) {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {},
})