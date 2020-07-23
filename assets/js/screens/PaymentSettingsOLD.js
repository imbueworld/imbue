import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import CustomTextInputWithLabel from "../components/CustomTextInputWithLabel"
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
                    onChangeText={(text) => setCreditCardText(text)}
                />
                <CustomTextInputWithLabel
                    label="MM/YY"
                    placeholder="MM/YY"
                    value={expireDateText}
                    onChangeText={(text) => setExpireDateText(text)}
                />
                <CustomTextInputWithLabel
                    label="CCV"
                    placeholder="CCV"
                    value={CCVText}
                    onChangeText={(text) => setCCVText(text)}
                />
                <CustomTextInputWithLabel
                    label="ZIP code"
                    placeholder="ZIP code"
                    value={zipCodeText}
                    onChangeText={(text) => setZipCodeText(text)}
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