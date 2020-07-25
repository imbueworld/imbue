import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"
import AltLoginService from "../components/AltLoginService"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"



export default function Login(props) {
    function login() {
        console.log("LOGIN ACTION")
        props.navigation.navigate("UserDashboard")
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <CompanyLogo />

            <CustomCapsule style={styles.container}>

                <View>
                    <AltLoginService />
                    <CustomTextInput
                        placeholder="Email"
                    />
                    <CustomTextInput
                        placeholder="Password"
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
    scrollView: {},
    container: {
        width: "85%",
        marginBottom: 50,
        paddingBottom: 0,
        alignSelf: "center",
    },
})