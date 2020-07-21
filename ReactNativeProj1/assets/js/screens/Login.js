import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import CompanyLogo from "../components/CompanyLogo"
import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import AltLoginService from "../components/AltLoginService"



export default function Login(props) {
    function login() {
        console.log("LOGIN ACTION")
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <CompanyLogo />
                <View style={styles.fieldContainer}>
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