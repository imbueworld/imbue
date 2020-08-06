import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import AppBackground from "../components/AppBackground"
import GymIcon from "../components/GymIcon"

import CustomButton from "../components/CustomButton"



export default function PartnerDashboard(props) {
    function live() {
        props.navigation.navigate("PartnerLivestreamDashboard")
    }

    function schedule() {
        props.navigation.navigate("ClassesSchedule")
    }
    
    function gym() {
        props.navigation.navigate("PartnerGymSettings")
    }

    return (
        <ProfileLayout capsuleStyle={styles.container}>

            <CustomButton
                title="Go Live"
                onPress={live}
            />
            <CustomButton
                title="Schedule"
                onPress={schedule}
            />
            <CustomButton
                title="Manage Gym"
                onPress={gym}
            />

        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    container: {},
})