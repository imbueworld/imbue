import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"



export default function Component(props) {
    const [creditCardText, setCreditCardText] = useState("")
    function creditCard(text) {
        setCreditCardText(text)
    }

    const [expireDateText, setExpireDateText] = useState("")
    function expireDate(text) {
        setExpireDateText(text)
    }

    const [CCVText, setCCVText] = useState("")
    function CCV(text) {
        setCCVText(text)
    }

    const [zipCodeText, setZipCodeText] = useState("")
    function zipCode(text) {
        setZipCodeText(text)
    }

    console.log(1, creditCardText)
    console.log(2, expireDateText)
    console.log(3, CCVText)
    console.log(4, zipCodeText)

    function done() {
        console.log("DONE ACTION")
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <CustomTextInput
                    label="Credit Card Number"
                    placeholder="Credit Card Number"
                    value={creditCardText}
                    onChangeText={creditCard}
                />
                <CustomTextInput
                    placeholder="MM/YY"
                    value={expireDateText}
                    onChangeText={expireDate}
                />
                <CustomTextInput
                    placeholder="CCV"
                    value={CCVText}
                    onChangeText={CCV}
                />
                <CustomTextInput
                    placeholder="ZIP"
                    value={zipCodeText}
                    onChangeText={zipCode}
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
    },
    content: {},
})