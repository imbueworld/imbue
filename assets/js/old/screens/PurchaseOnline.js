import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomSelectButton from "../components/CustomSelectButton"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"
import CustomBar from "../components/CustomBar"

import CreditCardInput from "../components/CreditCardInput"



export default function PurchaseOnline(props) {
    return (
        <ProfileLayout capsuleStyle={styles.container}>

            <CustomSelectButton
                options={{
                    single: "Single Class\n$9",
                    membership: "Membership\n$50"
                }}
            />

            <CustomBar />

            <CreditCardInput />
            <CustomButton
                title="Purchase"
            />

        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
})