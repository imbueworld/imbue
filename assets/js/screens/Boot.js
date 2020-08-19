import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text, Button } from 'react-native'

import AppBackground from "../components/AppBackground"

// import firebase from "firebase/app"
// import "firebase/auth"
import auth from "@react-native-firebase/auth"
import { retrieveUserData } from '../backend/CacheFunctions'



export default function Boot(props) {
    // auth().signOut()
    // props.route.params.cache.user = null
    // props.route.params.cache.creditCards = null
    // props.route.params.cache.classes = null
    // props.route.params.cache.gyms = null
    // props.route.params.cache.gymClasses = null
    // props.route.params.cache.memberships = null
    // props.route.params.cache.mux = null

    let cache = props.route.params.cache

    const [booting, setBooting] = useState(true)

    useEffect(() => {
        async function init() {
            await retrieveUserData(cache)
            setBooting(false)
        }
        setBooting(true)
        
        let bootWithoutUser = setTimeout(() => {
            console.log("After 6 seconds, no user was found to be logged in.")
            Object.keys(cache).forEach(key => {
                cache[ key ] = null
            })
            setBooting(false)
        }, 6100)

        console.log("Initializing within 6s.")
        let queue = []
        for (let i = 0; i <= 6000; i += 1000) {
            queue[i] = setTimeout(() => {
                console.log(`Attempt ${i / 1000}..`)
                if (auth().currentUser) {
                    clearTimeout(bootWithoutUser)
                    queue.forEach(timeout => clearTimeout(timeout))
                    init()
                }
            }, i)
        }
    }, [props.route.params.referrer])

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <View style={styles.container}>

                <Text style={{
                    fontSize: 18,
                    display: booting ? "flex" : "none",
                }}>Booting...</Text>

                <Text>{JSON.stringify(cache.user)}</Text>

                <Button
                    title="Normal Boot"
                    onPress={() => {
                        if (!booting) {
                            let accountType
                            if (cache.user) accountType = cache.user.account_type
                            else accountType = ""
                            switch(accountType) {
                                case "user":
                                    // props.navigation.navigate("UserDashboard", {referrer: "Boot"})
                                    props.navigation.reset({
                                        index: 0,
                                        routes: [{ name: "UserDashboard" }]
                                    })
                                    break
                                case "partner":
                                    // props.navigation.navigate("PartnerDashboard", {referrer: "Boot"})
                                    props.navigation.reset({
                                        index: 0,
                                        routes: [{ name: "PartnerDashboard" }]
                                    })
                                    break
                                default:
                                    props.navigation.navigate("Home", {referrer: "Boot"})
                                    break
                            }
                        }
                    }}
                />

                <View style={{ height: 50 }}/>

                <Button
                    title="Livestream"
                    onPress={() => {props.navigation.navigate("Livestream", { gymId: "D4iONGuVmdWwx4zGk4BI" })}}
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