import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import { colors } from "../contexts/Colors"

import AppBackground from "../components/AppBackground"
import CompanyLogo from "../components/CompanyLogo"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"

import { signUp } from "../backend/SignUp"

import firebase from "firebase/app"
import "firebase/auth"
import "firebase/functions"



export default function PartnerSignUp(props) {
    firebase.auth().onAuthStateChanged(user => {
        if (user) props.navigation.navigate("Boot", {referrer: "PartnerSignUp"})
    })

    // const [formStatus, setFormStatus] = useState("ok")
    const [errorText, setErrorText] = useState("")

    const [firstNameText, setFirstNameText] = useState("Parnet")
    const [lastNameText, setLastNameText] = useState("Fist")
    const [gymNameText, setGymNameText] = useState("YogaBoga")
    const [emailText, setEmailText] = useState("Biz@YogaBoga.com")
    const [passwordText, setPasswordText] = useState("123123123")
    const [verifyPasswordText, setVerifyPasswordText] = useState("123123123")

    function signUpAction() {
        if (
            !( firstNameText.length !== 0
            && lastNameText.length !== 0
            && gymNameText.length !== 0
            && emailText.length !== 0
            && passwordText.length !== 0
            && verifyPasswordText.length !== 0)
        ) {
            // setFormStatus("fields/empty")
            setErrorText("All fields must be filled")
        }
        else if (passwordText !== verifyPasswordText) {
            // setFormStatus("password/does-not-match")
            setErrorText("Passwords do not match")
        }
        else if (passwordText.length < 8) {
            // setFormStatus("password/too-weak")
            setErrorText("Password must be at least 8 characters long")
        }
        else {
            // setFormStatus("proceed")
            proceed()
        }
    }

    async function proceed() {
        const form = {
            email: emailText,
            password: passwordText,
            first: firstNameText,
            last: lastNameText,
        }

        const code = await signUp(form)
        
        if (code === "auth/invalid-email") {
            setErrorText("Email must be valid.")
            return
        } else if (code == "auth/email-already-in-use") {
            setErrorText("Email already signed up.")
            return
        }

        const initPrtnrAcc = firebase.functions().httpsCallable("initializePartnerAccount")
        await initPrtnrAcc()

        setErrorText("")
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <CompanyLogo />

            <CustomCapsule style={styles.container}>

                <Text style={{
                    marginTop: 10,
                    marginBottom: 20,
                    alignSelf: "center",
                    fontSize: 25,
                    color: colors.gray,
                }}>Partner Sign Up</Text>

                <View stlye={styles.errorContainer}>
                    <Text style={styles.errorText}>{errorText}</Text>
                </View>

                <View>
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
                        onPress={signUpAction}
                    />
                </View>
            
            </CustomCapsule>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {},
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