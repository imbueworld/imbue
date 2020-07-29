import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"
import CustomBar from "../components/CustomBar"
import ActiveMembershipBadge from "../components/ActiveMembershipsBadge"



export default function UserMemberships(props) {

    return (
        <ProfileLayout>

            <ActiveMembershipBadge
                name="Membership One"
            />
            <ActiveMembershipBadge
                name="Membership Two"
            />
            <ActiveMembershipBadge
                name="Membership Three"
            />

            <CustomBar />

            <CustomButton
                title="View Past Transactions"
            />

        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    container: {},
})