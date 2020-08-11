import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"
import AltSignUpService from "../components/AltSignUpService"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"

import { signUp/*, createAccount, updateAccount*/ } from "../backend/SignUp"

import firebase from "firebase/app"
import "firebase/auth"



export default function SignUp(props) {
    // const [formStatus, setFormStatus] = useState("ok")
    const [errorText, setErrorText] = useState("")

    const [firstNameField, setFirstNameField] = useState("")
    const [lastNameField, setLastNameField] = useState("")
    const [emailField, setEmailField] = useState("")
    const [pwField, setPwField] = useState("")
    const [verifyPwField, setVerifyPwField] = useState("")


    function signUpAction() {
        console.log("signUpAction() started.")
        
        if (
            !( emailField.length !== 0
            && pwField.length !== 0
            && verifyPwField.length !== 0
            && firstNameField.length !== 0
            && lastNameField.length !== 0)
        ) {
            // setFormStatus("fields/empty")
            setErrorText("All fields must be filled")
        }
        else if (pwField !== verifyPwField) {
            // setFormStatus("password/does-not-match")
            setErrorText("Passwords do not match")
        }
        else if (pwField.length < 8) {
            // setFormStatus("password/too-weak")
            setErrorText("Password must be at least 8 characters long")
        }
        else {
            // setFormStatus("proceed")
            proceed()
        }
    }

    async function proceed() {
        console.log("proceed() started.")
        const form = {
            email: emailField,
            password: pwField,
            first: firstNameField,
            last: lastNameField,
        }

        const code = await signUp(form)
        
        if (code === "auth/invalid-email") {
            setErrorText("Email must be valid.")
            return
        } else if (code == "auth/email-already-in-use") {
            setErrorText("Email already signed up.")
            return
        }

        const initUserAcc = firebase.functions().httpsCallable("initializeUserAccount")
        await initUserAcc()
        
        setErrorText("")
        props.navigation.navigate("Boot", {referrer: "SignUp", backScreen: "LogOut"})
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>

            <AppBackground />
            <CompanyLogo />

            <CustomCapsule style={styles.container}>

                <AltSignUpService />

                <View stlye={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorText}</Text>
                </View>
                
                <CustomTextInput
                    placeholder="First Name"
                    value={firstNameField}
                    onChangeText={setFirstNameField}
                />
                <CustomTextInput
                    placeholder="Last Name"
                    value={lastNameField}
                    onChangeText={setLastNameField}
                />
                <CustomTextInput
                    placeholder="Email"
                    value={emailField}
                    onChangeText={setEmailField}
                />
                <CustomTextInput
                    placeholder="Password"
                    value={pwField}
                    onChangeText={setPwField}
                />
                <CustomTextInput
                    placeholder="Verify Password"
                    value={verifyPwField}
                    onChangeText={setVerifyPwField}
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
    errorContainer: {},
    errorText: {
        color: "red",
    },
})