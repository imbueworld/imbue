import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import CustomIcon from "./CustomIcon"



export default function AltLoginService(props) {
    function googleLogin() {
        console.log("GOOGLE LOGIN ACTION")
    }
    
    function facebookLogin() {
        console.log("FACEBOOK LOGIN ACTION")
    }

    function linkedinLogin() {
        console.log("LINKEDIN LOGIN ACTION")
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={googleLogin}
            >
                <CustomIcon
                    source={require("./img/google-logo.png")}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={facebookLogin}
            >
                <CustomIcon
                    source={require("./img/facebook-logo.png")}
                />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.iconContainer}
                onPress={linkedinLogin}
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