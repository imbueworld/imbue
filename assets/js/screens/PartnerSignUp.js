import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import { colors } from "../contexts/Colors"

import AppBackground from "../components/AppBackground"
import CompanyLogo from "../components/CompanyLogo"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"



export default function PartnerSignUp(props) {
    const [firstNameText, setFirstNameText] = useState("")
    const [lastNameText, setLastNameText] = useState("")
    const [gymNameText, setGymNameText] = useState("")
    const [emailText, setEmailText] = useState("")
    const [passwordText, setPasswordText] = useState("")
    const [verifyPasswordText, setVerifyPasswordText] = useState("")

    function signUp() {
        props.navigation.navigate("PartnerDashboard")
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
                        onPress={signUp}
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