import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"
import ProfileRepr from "../components/ProfileRepr"

import CustomText from "../components/CustomText"
import CustomButton from "../components/CustomButton"



export default function PartnerRevenueInfo(props) {
    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <AppBackground />
            <View style={styles.container}>
                <ProfileRepr />

                <CustomText
                    style={styles.customTextContainer}
                    label="Revenue"
                >
                    $999
                </CustomText>
                <CustomText
                    style={styles.customTextContainer}
                    label="Member Count"
                >
                    23
                </CustomText>

                <Text style={styles.sectionHeader}>Payouts</Text>
                <CustomButton
                    title="Bank Account"
                />
                <CustomButton
                    title="Plaid"
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
    customTextContainer: {
        marginVertical: 10,
    },
    sectionHeader: {
        fontSize: 20,
        alignSelf: "center",
    },
})