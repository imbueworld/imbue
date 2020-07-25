import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"
import AltSignUpService from "../components/AltSignUpService"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"



export default function SignUp(props) {
    function signUp() {
        console.log("SIGN UP ACTION")
    }

    return (
        <ScrollView>
            <View style={styles.container}>

                <AppBackground />
                <CompanyLogo />

                <CustomCapsule style={{
                    // alignItems: "center",
                    marginBottom: 50,
                    paddingBottom: 0,
                }}>

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

                </CustomCapsule>

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
        // width: "85%",
    },
})