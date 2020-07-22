import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'

import CompanyLogo from "../components/CompanyLogo"
import CustomButton from "../components/CustomButton"



export default function Home(props) {
    function test() {
        props.navigation.navigate("Test")
    }

    function signUp() {
        props.navigation.navigate("SignUp")
    }

    function logIn() {
        props.navigation.navigate("Login")
    }

    return (
        <View style={styles.container}>
        {/* <View> */}
            {/* <Button
                onPress={test}
                title="Generic Button"
            /> */}
            <CompanyLogo />
            <View style={styles.buttonContainer}>
            {/* <View> */}
                <CustomButton
                    onPress={signUp}
                    title="Sign Up"
                />
                <CustomButton
                    onPress={logIn}
                    title="Login"
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        justifyContent: "space-around",
        alignItems: "center",
    },
    buttonContainer: {
        width: "85%",
    },
})