import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import CustomIcon from "./CustomIcon"
import { colors } from '../contexts/Colors'



export default function AltLoginService(props) {
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
        // borderColor: colors.gray,
        borderColor: colors.buttonFill,
        borderBottomWidth: 1,
        marginBottom: 30,
    },
    iconContainer: {
        padding: 30,
    },
})