import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "./CustomButton"



export default function UserMenu(props) {
    function classes() {
        props.navigation.navigate("UserClasses")
    }
    function memberships() {
        props.navigation.navigate("UserMemberships")
    }
    function profileSettings() {
        props.navigation.navigate("ProfileSettings")
    }
    function paymentSettings() {
        props.navigation.navigate("PaymentSettings")
    }

    return (
        <ProfileLayout capsuleStyle={{
            paddingBottom: 0,
        }}>

            <CustomButton
                title="My Classes"
                onPress={classes}
                />
            <CustomButton
                title="Manage Memberships"
                onPress={memberships}
            />
            <CustomButton
                title="Profile Settings"
                onPress={profileSettings}
            />
            <CustomButton
                title="Payment Settings"
                onPress={paymentSettings}
            />

        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
})