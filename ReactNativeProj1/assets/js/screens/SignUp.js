import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import CompanyLogo from "../components/CompanyLogo"
import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import AltSignUpService from "../components/AltSignUpService"



export default function SignUp(props) {
    function signUp() {
        console.log("SIGN UP ACTION")
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <CompanyLogo />
                <View style={styles.fieldContainer}>
                    <AltSignUpService />
                    <CustomTextInput
                        placeholder="First Name"
                    />
                    <CustomTextInput
                        placeholder="Last Name"
                    />
                    <CustomTextInput
                        placeholder="Email"
                    />
                    <CustomTextInput
                        placeholder="Password"
                    />
                    <CustomTextInput
                        placeholder="Verify Password"
                    />
                    <CustomButton
                        title="Sign Up"
                        onPress={signUp}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        // width: "100%",
        // height: "100%",
        // justifyContent: "space-around",
        alignItems: "center",
    },
    fieldContainer: {
        width: "85%",
    },
})