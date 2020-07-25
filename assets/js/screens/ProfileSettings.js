import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"



export default function ProfileSettings(props) {
    const [firstNameText, setFirstNameText] = useState("")
    const [lastNameText, setLastNameText] = useState("")
    const [emailText, setEmailText] = useState("")
    const [passwordText, setPasswordText] = useState("")
    const [confPasswordText, setConfPasswordText] = useState("")

    function done() {
        console.log("DONE ACTION")
    }

    return (
        <ProfileLayout capsuleStyle={styles.container}>
            <CustomTextInput
                placeholder="First Name"
                value={firstNameText}
                onChangeText={(text) => setFirstNameText(text)}
            />
            <CustomTextInput
                placeholder="Last Name"
                value={lastNameText}
                onChangeText={(text) => setLastNameText(text)}
            />
            <CustomTextInput
                placeholder="Email"
                value={emailText}
                onChangeText={(text) => setEmailText(text)}
            />
            <CustomTextInput
                placeholder="Password"
                value={undefined} // Left out on purpose
                onChangeText={(text) => setPasswordText(text)}
            />
            <CustomTextInput
                placeholder="Confirm Password"
                value={undefined} // Left out on purpose
                onChangeText={(text) => setConfPasswordText(text)}
            />
            <CustomButton
                title="Save"
                onPress={done}
            />
        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
})