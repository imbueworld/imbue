import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"
import GymIcon from "../components/GymIcon"

import CustomButton from "../components/CustomButton"



export default function PartnerDashboard(props) {
    function schedule() {
        props.navigation.navigate("")
    }
    
    function live() {
        props.navigation.navigate("")
    }

    function gym() {
        props.navigation.navigate("PartnerGymSettings")
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <AppBackground />
            <View style={styles.container}>
                <View style={styles.gymReprContainer}>
                    <GymIcon />
                    <Text>Corepower Yoga</Text>
                </View>
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
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        height: "100%"
    },
    container: {
        width: "85%",
        alignSelf: "center",
    },
    gymReprContainer: {
        alignItems: "center",
    },
})