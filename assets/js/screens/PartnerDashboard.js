import React, { useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "../components/CustomButton"
import LogOut from "../components/LogOut"

import firebase from "firebase/app"
import "firebase/auth"
import { retrievePartnerClasses } from '../backend/CacheFunctions'



export default function PartnerDashboard(props) {
    let cache = props.route.params.cache
    console.log("[PARTNER DASHBOARD]")

    useEffect(() => {
        async function init() {
            await retrievePartnerClasses(cache)
        }
        init()
    }, [])

    return (
        <ProfileLayout capsuleStyle={styles.container}>

            <TouchableOpacity
                style={styles.logOutButtonContainer}
                onPress={() => console.log("To-Do: Intuitively shows what the button does")}
                onLongPress={() => {
                    firebase.auth().signOut()
                    props.navigation.navigate("Boot", { referrer: "PartnerDashboard" })
                }}
            >
                <LogOut
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                    containerStyle={{
                        left: 1.35, // Make-up for the icon's flaw regarding centering
                        padding: 10,
                    }}
                />
            </TouchableOpacity>

            <CustomButton
                title="Go Live"
                onPress={() => {props.navigation.navigate(
                    "GoLive")}}
            />
            <CustomButton
                title="Livestream Settings"
                onPress={() => {props.navigation.navigate(
                    "PartnerLivestreamDashboard")}}
            />
            <CustomButton
                title="Schedule"
                onPress={() => {props.navigation.navigate(
                    "ClassesSchedule")}}
            />
            <CustomButton
                title="Manage Gym"
                onPress={() => {props.navigation.navigate(
                    "PartnerGymSettings")}}
            />

        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
    logOutButtonContainer: {
        width: 64,
        height: 64,
        marginTop: 10,
        marginRight: 10,
        position: "absolute",
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 999,
        zIndex: 110,
    },
})