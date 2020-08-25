import React from 'react'
import { StyleSheet, ScrollView, View, Text, Button, TouchableOpacity } from 'react-native'

import { colors } from "../contexts/Colors"

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"
import CustomButton from "../components/CustomButton"
import CustomCapsule from '../components/CustomCapsule'
import { fonts } from '../contexts/Styles'



export default function Home(props) {
    function signUp() {
        props.navigation.navigate("SignUp")
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
                    alignSelf: "center",
                }}
            /> 

            {/* <View style={styles.container}> */}
            <CustomCapsule
                containerStyle={{
                    width: "88%",
                    alignSelf: "center",
                    marginBottom: 50,
                }}
            >
                <CustomButton
                    style={{
                        marginTop: 20,
                        marginBottom: 0,
                    }}
                    onPress={signUp}
                    title="Sign Up"
                />
                <CustomButton
                    style={{
                        marginTop: 20,
                        marginBottom: 0,
                    }}
                    title="Login"
                    onPress={() => props.navigation.navigate("Login")}
                />
                <TouchableOpacity
                    onPress={partnerSignUp}
                >
                    <Text style={{
                        marginTop: 20,
                        marginBottom: 20,
                        color: colors.gray,
                        textAlign: "center",
                        fontSize: 16,
                        textDecorationLine: "underline",
                        fontFamily: fonts.default,
                    }}>Partner Sign Up</Text>
                </TouchableOpacity>
            </CustomCapsule>
            {/* </View> */}

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
        flexDirection: "column-reverse",
        // alignItems: "center",
    },
    container: {
        width: "80%",
        marginBottom: 50,
    },
})