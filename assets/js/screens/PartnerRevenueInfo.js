import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomText from "../components/CustomText"
import CustomButton from "../components/CustomButton"



export default function PartnerRevenueInfo(props) {
    return (
        <ProfileLayout capsuleStyle={styles.container}>

                <CustomText
                    style={styles.text}
                    containerStyle={styles.textContainer}
                    label="Revenue"
                >
                    $999
                </CustomText>
                <CustomText
                    style={styles.text}
                    containerStyle={styles.textContainer}
                    label="Member Count"
                >
                    23
                </CustomText>

                <Text style={{
                    paddingTop: 15,
                    paddingBottom: 10,
                    textAlign: "center",
                    fontSize: 20,
                }}>Payouts</Text>
                <CustomButton
                    title="Bank Account"
                />
                <CustomButton
                    title="Plaid"
                />

        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    container: {},
    text: {
        paddingVertical: 10,
    },
    textContainer: {
        marginVertical: 10,
    },
})