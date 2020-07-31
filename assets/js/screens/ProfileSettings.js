import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import PasswordConfirmation from "../components/PasswordConfirmation"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"

import Firebase from "firebase/app"
import "firebase/auth"



export default function ProfileSettings(props) {
    if (!props.route.params.init) {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) console.log("Still logged in.")
            else console.log("Became logged out.")
        })
        props.route.params.init = true
    }

    const user = Firebase.auth().currentUser
    let [firstName, lastName] = user.displayName.split(" ")

    const [formState, setFormState] = useState("ok")

    const [firstNameField, setFirstNameField] = useState(firstName)
    const [lastNameField, setLastNameField] = useState(lastName)
    const [emailField, setEmailField] = useState(user.email)
    const [passwordField, setPasswordField] = useState("")
    const [confPasswordField, setConfPasswordField] = useState("")

    function save() {
        if (
            !( firstNameField.length !== 0
            && lastNameField.length !== 0
            && emailField.length !== 0
            && passwordField.length !== 0
            && confPasswordField.length !== 0)
        ) {
            setFormState("fields/empty")
        } else if (passwordField !== confPasswordField) {
            setFormState("password/does-not-match")
        } else {
            setFormState("proceed")

            Firebase.auth().signInWithEmailAndPassword(user.email, passwordField)
                .then(() => {
                    console.log("All good!")

                    if (firstNameField !== firstName || lastNameField !== lastName) {
                        user.updateProfile({
                            displayName: `${firstNameField} ${lastNameField}`,
                        })
                    }

                    if (emailField !== user.email) {
                        user.updateEmail(emailField)
                    }
                })
                .catch((err) => {
                    console.log(err.code)
                    console.log(err.message)
                })
        }
    }
    

    const [pwForm, setPwForm] = useState(false)

    function changePassword(password) {
        user.updatePassword(password)
            .then(() => {
                console.log("Password Changed!")
            })
            .catch((err) => {
                console.log(err.code)
                console.log(err.message)
            })
    }


    return (
        <>
        {/* { pwForm
        ?   <View style={{
                width: "85%",
                height: "100%",
                position: "absolute",
                justifyContent: "center",
                alignSelf: "center",
                zIndex: 200,
            }}>
                <PasswordConfirmation
                    onSuccess={changePassword}
                    onX={() => setPwForm(false)}
                />
            </View>
        :   <View />} */}

        <ProfileLayout capsuleStyle={styles.container}>
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

            { pwForm
            ?   <PasswordConfirmation
                    capsuleStyle={{
                        // marginTop: 10,
                        marginVertical: 10,
                    }}
                    onSuccess={changePassword}
                    onFail={setFormState}
                    onX={() => setPwForm(false)}
                />
            :   <CustomButton
                    title="Change Password"
                    onPress={() => setPwForm(true)}
                />}
            
            <CustomTextInput
                placeholder="Current Password"
                value={passwordField}
                onChangeText={setPasswordField}
            />
            {/* <CustomTextInput
                placeholder="Confirm Password"
                value={confPasswordField}
                onChangeText={setConfPasswordField}
            /> */}

            <CustomButton
                title="Save"
                onPress={save}
            />
        </ProfileLayout>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
})