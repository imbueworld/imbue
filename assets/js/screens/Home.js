import React from 'react'
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native'

import { colors } from "../contexts/Colors"

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"
import CustomButton from "../components/CustomButton"



export default function Home(props) {
    function signUp() {
        props.navigation.navigate("SignUp")
    }

    function logIn() {
        props.navigation.navigate("Login")
    }

    function partnerSignUp() {
        props.navigation.navigate("PartnerSignUp")
    }

    return (
        <View style={styles.container}>

            <AppBackground />
            <CompanyLogo />

            <View style={styles.buttonContainer}>
                <CustomButton
                    onPress={signUp}
                    title="Sign Up"
                />
                <CustomButton
                    onPress={logIn}
                    title="Login"
                />
                <TouchableOpacity
                    onPress={partnerSignUp}
                >
                    <Text style={{
                        marginTop: 10,
                        color: colors.gray,
                        fontSize: 16,
                        textAlign: "center",
                    }}>Partner Sign Up</Text>
                </TouchableOpacity>

                <Button
                    title="TESTING GROUNDS"
                    onPress={() => {props.navigation.navigate("Livestream", {referrer: "Home"})}}
                />
                <Button
                    title="TESTING GROUNDS"
                    onPress={() => {props.navigation.navigate("ClassesSchedule")}}
                />

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        // justifyContent: "space-around",
        alignItems: "center",
    },
    buttonContainer: {
        width: "85%",
    },
})