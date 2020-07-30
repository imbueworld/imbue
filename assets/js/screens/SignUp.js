import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"
import AltSignUpService from "../components/AltSignUpService"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"

import { signUp } from "../backend/main"



export default function SignUp(props) {
    function signUpAction() {
        console.log("SIGN UP ACTION")

        console.log(emailField)
        console.log(pwField)
        if (!emailField[0]) emailField[0] = "imthebestyasuo@gmail.com"
        if (!pwField[0]) pwField[0] = "123123"
        signUp(emailField[0], pwField[0])
            .then(() => {
                console.log("All good!")
            })
            .catch((err) => {
                console.log("Error in login()!")
                console.log(err.code)
                console.log(err.message)
            })
    }

    const emailField = []
    const pwField = []

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
                    info={emailField}
                />
                <CustomTextInput
                    placeholder="Password"
                    info={pwField}
                />
                <CustomTextInput
                    placeholder="Verify Password"
                />
                <CustomButton
                    title="Sign Up"
                    onPress={signUpAction}
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