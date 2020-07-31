import React, { useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"
import AltSignUpService from "../components/AltSignUpService"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"

import { signUp/*, createAccount, updateAccount*/ } from "../backend/SignUp"



export default function SignUp(props) {
    const [formStatus, setFormStatus] = useState("ok")
    console.log(formStatus)

    const [emailField, setEmailField] = useState("")
    const [pwField, setPwField] = useState("")
    const [verifyPwField, setVerifyPwField] = useState("")
    const [firstNameField, setFirstNameField] = useState("")
    const [lastNameField, setLastNameField] = useState("")

    function signUpAction() {
        console.log(emailField)
        console.log(pwField)
        console.log(verifyPwField)
        console.log(firstNameField)
        console.log(lastNameField)
        
        if (
            !( emailField.length !== 0
            && pwField.length !== 0
            && verifyPwField.length !== 0
            && firstNameField.length !== 0
            && lastNameField.length !== 0)
        )
            setFormStatus("fields/empty")
        else if (pwField !== verifyPwField)
            setFormStatus("password/does-not-match")
        else if (pwField.length < 8)
            setFormStatus("password/too-weak")
        else
            setFormStatus("proceed")
    }

    switch(formStatus) {
        case "proceed":
            console.log("Form is ok!")

            const form = {
                email: emailField,
                password: pwField,
                first: firstNameField,
                last: lastNameField,
            }

            signUp(form)
            break
    }

    // if (formStatus === "ok") {
    //     const emailField = [""]
    //     const pwField = [""]
    //     const verifyPwField = [""]
    //     const firstNameField = [""]
    //     const lastNameField = [""]
    // }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>

            <AppBackground />
            <CompanyLogo />

            <CustomCapsule style={styles.container}>

                <AltSignUpService />
                <CustomTextInput
                    placeholder="First Name"
                    // info={firstNameField}
                    onChangeText={setFirstNameField}
                />
                <CustomTextInput
                    placeholder="Last Name"
                    // info={lastNameField}
                    onChangeText={setLastNameField}
                />
                <CustomTextInput
                    placeholder="Email"
                    // info={emailField}
                    onChangeText={setEmailField}
                />
                <CustomTextInput
                    placeholder="Password"
                    // info={pwField}
                    onChangeText={setPwField}
                />
                <CustomTextInput
                    placeholder="Verify Password"
                    // info={verifyPwField}
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
})