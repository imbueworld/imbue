import React, { useState } from 'react'
import { StyleSheet, ScrollView, View, Text, Button } from 'react-native'

import AppBackground from "../components/AppBackground"

import Firebase from "firebase/app"



export default function Boot(props) {
    // setTimeout(() => {
    //     Firebase.auth().onAuthStateChanged((user) => {
    //         if (user)
    //             props.navigation.navigate("UserDashboard", {referrer: "Boot"})
    //         else
    //             props.navigation.navigate("Home", {referrer: "Boot"})
    //     })
    // }, 500)

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <View style={styles.container}>

                <Text>Boot Screen</Text>

                <Button
                    title="Normal Boot"
                    onPress={() => {
                        if (Firebase.auth().currentUser) {
                            props.navigation.navigate("UserDashboard", {referrer: "Boot"})
                        } else {
                            props.navigation.navigate("Home", {referrer: "Boot"})
                        }
                    }}
                />

                <View style={{height: 50}}/>

                <Button
                    title="TESTING GROUNDS"
                    onPress={() => {props.navigation.navigate("PaymentSettings", {referrer: "Boot"})}}
                />
                <Button
                    title="TESTING GROUNDS"
                    onPress={() => {props.navigation.navigate("Livestream", {referrer: "Boot"})}}
                />
                <Button
                    title="Go Live"
                    onPress={() => {props.navigation.navigate("PartnerLivestreamDashboard", {referrer: "Boot"})}}
                />

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