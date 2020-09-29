import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"

import { retrieveUserData } from '../backend/CacheFunctions'
import { addPaymentMethod } from '../backend/BackendFunctions'



// 4000000760000002 // Visa
// 5555555555554444 // Mastercard
// 6011111111111117 // Discover
// const exampleUser = {
//     cardNumber: "4000000760000002",
//     expMonth: "12",
//     expYear: "69",
//     cvc: "699",
//     name: "Oskar Tree",
//     address_zip: "699",
// }



export default function AddPaymentMethod(props) {
    let cache = props.route.params.cache
    let params = props.route.params

    const [holderNameText, setHolderNameText] = useState("")
    const [creditCardText, setCreditCardText] = useState("")
    const [expireDateText, setExpireDateText] = useState("")
    const [CCVText, setCCVText] = useState("")
    const [zipCodeText, setZipCodeText] = useState("")

    const [errorMsg, setErrorMsg] = useState("")

    const [user, setUser] = useState(null)

    useEffect(() => {
        const init = async() => {
            let user = await retrieveUserData(cache)
            setUser(user)
        }
        init()
    }, [])

    async function validateAndProceed() {
        let [expMonth, expYear] = expireDateText.split("/")

        let form = {
            cardNumber: creditCardText,
            expMonth,
            expYear,
            cvc: CCVText,
            name: holderNameText,
            address_zip: zipCodeText,
        }

        try {
            await addPaymentMethod(cache, form)
            if (!params.referrer) {
                props.navigation.goBack()
                return
            }
            props.navigation.navigate(props.route.params.referrer, { referrer: "AddPaymentSettings" })
        } catch(err) {
            setErrorMsg(err.message)
        }
    }

    if (!user) return <View />

    return (
        <KeyboardAwareScrollView>
        <ProfileLayout
            innerContainerStyle={styles.innerContainer}
        >
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
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    innerContainer: {
        paddingBottom: 10,
    },
})