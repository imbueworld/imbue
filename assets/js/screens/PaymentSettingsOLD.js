import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import CustomTextInputWithLabel from "../components/CustomTextInputWithLabel"
import CustomButton from "../components/CustomButton"



export default function Component(props) {
    const [holderNameText, setHolderNameText] = useState("")

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

    function done() {
        console.log("DONE ACTION")
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                <CustomTextInputWithLabel
                    label="Name of Holder"
                    placeholder="Name of Holder"
                    value={holderNameText}
                    onChangeText={(text) => setHolderNameText(text)}
                />
                <CustomTextInputWithLabel
                    label="Credit Card Number"
                    placeholder="Credit Card Number"
                    value={creditCardText}
                    onChangeText={creditCard}
                />
                <CustomTextInputWithLabel
                    label="MM/YY"
                    placeholder="MM/YY"
                    value={expireDateText}
                    onChangeText={expireDate}
                />
                <CustomTextInputWithLabel
                    label="CCV"
                    placeholder="CCV"
                    value={CCVText}
                    onChangeText={CCV}
                />
                <CustomTextInputWithLabel
                    label="ZIP code"
                    placeholder="ZIP code"
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
        alignItems: "center",
    },
    content: {
        width: "85%",
    },
})