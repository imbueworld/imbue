import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"
import AltSignUpService from "../components/AltSignUpService"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"



export default function SignUp(props) {
    function signUp() {
        console.log("SIGN UP ACTION")
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>

            <AppBackground />
            <CompanyLogo />

            <CustomCapsule style={styles.container}>

                <AltSignUpService />
                <CustomTextInput
                    placeholder="First Name"
                />
                <CustomTextInput
                    placeholder="Last Name"
                />
                <CustomTextInput
                    placeholder="Email"
                />
                <CustomTextInput
                    placeholder="Password"
                />
                <CustomTextInput
                    placeholder="Verify Password"
                />
                <CustomButton
                    title="Sign Up"
                    onPress={signUp}
                />

            </CustomCapsule>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {
        width: "85%",
        marginBottom: 50,
        paddingBottom: 0,
        alignSelf: "center",
    },
})