import React from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'

import AppBackground from "./components/AppBackground"
import ProfileLayout from './layouts/ProfileLayout'
import CustomButton from './components/CustomButton'



export default function Component(props) {
    return (
        <ProfileLayout capsuleStyle={[{
            // paddingBottom: 0,
        }]}>

            <CustomButton
                title="My Classes"
                onPress={() => {
                    props.navigation.navigate(
                        "ScheduleViewer", { data: cache.classes })
                }}
            />
            <CustomButton
                title="Manage Memberships"
                onPress={() => props.navigation.navigate(
                    "UserMemberships")}
            />
            <CustomButton
                title="Profile Settings"
                onPress={() => props.navigation.navigate(
                    "ProfileSettings")}
            />
            <CustomButton
                title="Payment Settings"
                onPress={() => props.navigation.navigate(
                    "PaymentSettings")}
            />

        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {},
})