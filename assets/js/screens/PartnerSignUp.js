import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"
import CompanyLogo from "../components/CompanyLogo"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"



export default function PartnerSignUp(props) {
    const [firstNameText, setFirstNameText] = useState("")
    const [lastNameText, setLastNameText] = useState("")
    const [gymNameText, setGymNameText] = useState("")
    const [emailText, setEmailText] = useState("")
    const [passwordText, setPasswordText] = useState("")
    const [verifyPasswordText, setVerifyPasswordText] = useState("")

    function signUp() {
        props.navigation.navigate("PartnerDashboard")
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <AppBackground />
            <CompanyLogo />
            <Text style={{alignSelf: "center", fontSize: 30}}>Partner Sign Up</Text>
            <View style={styles.container}>
                <CustomTextInput
                    placeholder="First Name"
                    value={firstNameText}
                    onChangeText={text => setFirstNameText(text)}
                />
                <CustomTextInput
                    placeholder="Last Name"
                    value={lastNameText}
                    onChangeText={text => setLastNameText(text)}
                />
                <CustomTextInput
                    placeholder="Gym Name"
                    value={gymNameText}
                    onChangeText={text => setGymNameText(text)}
                />
                <CustomTextInput
                    placeholder="Email"
                    value={emailText}
                    onChangeText={text => setEmailText(text)}
                />
                <CustomTextInput
                    placeholder="Password"
                    value={passwordText}
                    onChangeText={text => setPasswordText(text)}
                />
                <CustomTextInput
                    placeholder="Confirm Password"
                    value={verifyPasswordText}
                    onChangeText={text => setVerifyPasswordText(text)}
                />
                <CustomButton
                    title="Sign Up"
                    onPress={signUp}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        // height: "100%",
    },
    container: {
        width: "85%",
        alignSelf: "center",
    },
})