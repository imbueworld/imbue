import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"



export default function Component(props) {
    const [holderNameText, setHolderNameText] = useState("")
    const [creditCardText, setCreditCardText] = useState("")
    const [expireDateText, setExpireDateText] = useState("")
    const [CCVText, setCCVText] = useState("")
    const [zipCodeText, setZipCodeText] = useState("")

    function done() {
        console.log("DONE ACTION")
    }

    return (
        <ProfileLayout style={styles.container}>
            <CustomTextInput
                placeholder="Name of Holder"
                value={holderNameText}
                onChangeText={(text) => setHolderNameText(text)}
            />
            <CustomTextInput
                placeholder="Credit Card Number"
                value={creditCardText}
                onChangeText={(text) => setCreditCardText(text)}
            />
            <CustomTextInput
                placeholder="MM/YY"
                value={expireDateText}
                onChangeText={(text) => setExpireDateText(text)}
            />
            <CustomTextInput
                placeholder="CCV"
                value={CCVText}
                onChangeText={(text) => setCCVText(text)}
            />
            <CustomTextInput
                placeholder="ZIP code"
                value={zipCodeText}
                onChangeText={(text) => setZipCodeText(text)}
            />
            <CustomButton
                title="Save"
                onPress={done}
            />
        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "85%",
        alignSelf: "center",
    },
})