import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"
import AltLoginService from "../components/AltLoginService"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"

import firebase from "firebase/app"
import "firebase/auth"



export default function Login(props) {
    async function login() {
        await firebase.auth().signInWithEmailAndPassword(emailField[0], pwField[0])
            .then(() => {
                props.navigation.navigate("Boot", {referrer: "Login"})
            })
            .catch((err) => {
                console.log(err.code)
                console.log(err.message)
            })
        
        console.log("User just signed in!  " + firebase.auth().currentUser.email)
    }

    const emailField = []
    const pwField = []

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            
            <AppBackground />
            <CompanyLogo />

            <CustomCapsule style={styles.container}>

                <View>
                    <AltLoginService />
                    <CustomTextInput
                        placeholder="Email"
                        info={emailField}
                    />
                    <CustomTextInput
                        placeholder="Password"
                        info={pwField}
                    />
                    <CustomButton
                        title="Login"
                        onPress={login}
                    />
                </View>

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