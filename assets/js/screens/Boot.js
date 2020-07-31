import React, { useState } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'

import AppBackground from "../components/AppBackground"

import Firebase from "firebase/app"



export default function Boot(props) {
    setTimeout(() => {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user)
                props.navigation.navigate("UserDashboard", {referrer: "Boot"})
            else
                props.navigation.navigate("Home", {referrer: "Boot"})
        })
    }, 500)

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <View style={styles.container}>
                <Text>Boot Screen</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {},
})