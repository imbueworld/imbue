import React from 'react'
import { StyleSheet, ScrollView, View, Text, Button, TouchableOpacity } from 'react-native'

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
        <ScrollView contentContainerStyle={styles.scrollView}>

            <AppBackground />
            <CompanyLogo
                containerStyle={{
                    top: 0,
                    position: "absolute",
                }}
            />

            <View style={styles.container}>
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
                    onPress={() => {props.navigation.navigate("UserClasses", {referrer: "Home"})}}
                />
                <Button
                    title="TESTING GROUNDS"
                    onPress={() => {props.navigation.navigate("Livestream", {referrer: "Home"})}}
                />

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
        flexDirection: "column-reverse",
        alignItems: "center",
    },
    container: {
        width: "85%",
    },
})