import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"



export default function PartnerGymSettings(props) {
    // const [gymName, setGymName] = useState("")
    // const [gymDesc, setGymDesc] = useState("")
    // const [gymAddress, setGymAddress] = useState("")

    return (
        <ProfileLayout capsuleStyle={styles.container}>
            {/* <CustomTextInput
                placeholder="Gym Name"
                value={gymName}
                onTextChange={setGymName}
            />
            <CustomTextInput
                placeholder="Gym Description"
                value={gymDesc}
                onTextChange={setGymDesc}
            />
            <CustomTextInput
                placeholder="Gym Address"
                value={gymAddress}
                onTextChange={setGymAddress}
            /> */}
            <CustomButton
                title="Update Memberships"
                onPress={() => props.navigation.navigate(
                    "PartnerUpdateMemberships")}
            />
            <CustomButton
                title="More Information"
                onPress={() => props.navigation.navigate(
                    "PartnerRevenueInfo")}
            />
            {/* <CustomButton
                title="Done"
                onPress={done}
            /> */}
        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
})