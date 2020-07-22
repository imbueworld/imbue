import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import CustomIcon from "./CustomIcon"



export default function AltSignUpService(props) {
    function googleSignUp() {
        console.log("GOOGLE SignUp ACTION")
    }
    
    function facebookSignUp() {
        console.log("FACEBOOK SignUp ACTION")
    }

    function linkedinSignUp() {
        console.log("LINKEDIN SignUp ACTION")
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={googleSignUp}
            >
                <CustomIcon
                    source={require("./img/google-logo.png")}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={facebookSignUp}
            >
                <CustomIcon
                    source={require("./img/facebook-logo.png")}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={linkedinSignUp}
            >
                <CustomIcon
                    source={require("./img/linkedin-logo.png")}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        borderStyle: "solid",
        borderColor: "lightgray",
        borderBottomWidth: 3, // "3px",
        marginBottom: 30, // "2em",
    },
    iconContainer: {
        padding: 30, // "2em",
    },
})