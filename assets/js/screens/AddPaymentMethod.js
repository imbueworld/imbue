import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"

import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/functions"



const exampleUser = {
    cardNumber: "4242424242424242",
    expMonth: "12",
    expYear: "69",
    cvc: "699",
    name: "Oskar Tree",
    address_zip: "699",
}



export default function AddPaymentMethod(props) {
    let cache = props.route.params.cache

    const [holderNameText, setHolderNameText] = useState("")
    const [creditCardText, setCreditCardText] = useState("")
    const [expireDateText, setExpireDateText] = useState("")
    const [CCVText, setCCVText] = useState("")
    const [zipCodeText, setZipCodeText] = useState("")

    const [errorMsg, setErrorMsg] = useState("")

    async function sendForm(form) {
        try {
            /**
             * Takes { cardNumber, expMonth, expYear, cvc, name, address_zip }
             */
            let paymentMethod = await firebase.functions().httpsCallable("addPaymentMethod")(form)
            if (!cache.creditCards) cache.creditCards = []
            cache.creditCards.push(paymentMethod)
            props.navigation.goBack()
        } catch(err) {
            setErrorMsg(err.message)
        }
    }

    function validateAndProceed() {
        let [expMonth, expYear] = expireDateText.split("/")

        let form = {
            cardNumber: creditCardText,
            expMonth,
            expYear,
            cvc: CCVText,
            name: holderNameText,
            address_zip: zipCodeText,
        }
        sendForm(form)
    }

    return (
        <ProfileLayout capsuleStyle={styles.container}>
            <Text style={{ color: "red" }}>{errorMsg}</Text>
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
                placeholder="ZIP"
                value={zipCodeText}
                onChangeText={(text) => setZipCodeText(text)}
            />
            <CustomButton
                title="Save"
                onPress={validateAndProceed}
            />
        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
})