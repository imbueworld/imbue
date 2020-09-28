import React from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'

import AppBackground from "../components/AppBackground"



export default function Component(props) {
    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <View style={styles.container}></View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {},
})