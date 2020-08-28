import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text, Button } from 'react-native'

import AppBackground from "../components/AppBackground"

import auth from "@react-native-firebase/auth"
import { retrieveUserData } from '../backend/CacheFunctions'
import { GoogleSignin } from '@react-native-community/google-signin'



export default function Boot(props) {
    // auth().signOut()
    // GoogleSignin.signOut()
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
            cache.working = {}
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
                                    props.navigation.reset({
                                        index: 0,
                                        routes: [{ name: "UserDashboard" }]
                                    })
                                    break
                                case "partner":
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

                <View style={{ height: 10 }}/>
                <Button
                    title="GoLive"
                    onPress={() => {props.navigation.navigate("GoLive")}}
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