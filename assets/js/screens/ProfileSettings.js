import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import CustomTextInputWithLabel from "../components/CustomTextInputWithLabel"
import CustomButton from "../components/CustomButton"



export default function ProfileSettings(props) {
    const [firstNameText, setFirstNameText] = useState("")
    const [lastNameText, setLastNameText] = useState("")
    const [emailText, setEmailText] = useState("")
    const [passwordText, setPasswordText] = useState("")

    function done() {
        console.log("DONE ACTION")
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <CustomTextInputWithLabel
                    label="First Name"
                    placeholder="First Name"
                    value={firstNameText}
                    onChangeText={(text) => setFirstNameText(text)}
                />
                <CustomTextInputWithLabel
                    label="Last Name"
                    placeholder="Last Name"
                    value={lastNameText}
                    onChangeText={(text) => setLastNameText(text)}
                />
                <CustomTextInputWithLabel
                    label="Email"
                    placeholder="Email"
                    value={emailText}
                    onChangeText={(text) => setEmailText(text)}
                />
                <CustomTextInputWithLabel
                    label="Password"
                    placeholder="Password"
                    value={undefined} // Left out on purpose
                    onChangeText={(text) => setPasswordText(text)}
                />
                <CustomButton
                    title="Done"
                    onPress={done}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    content: {
        width: "85%",
    },
})