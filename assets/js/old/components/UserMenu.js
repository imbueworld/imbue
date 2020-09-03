import React from 'react'
import { StyleSheet } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "./CustomButton"



export default function UserMenu(props) {
    return (
        <ProfileLayout capsuleStyle={{
            paddingBottom: 0,
        }}>

            <CustomButton
                title="My Classes"
                onPress={() => props.navigation.navigate("UserClasses")}
                />
            <CustomButton
                title="Manage Memberships"
                onPress={() => props.navigation.navigate("UserMemberships")}
            />
            <CustomButton
                title="Profile Settings"
                onPress={() => props.navigation.navigate("ProfileSettings")}
            />
            <CustomButton
                title="Payment Settings"
                onPress={() => props.navigation.navigate("PaymentSettings")}
            />

        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
})