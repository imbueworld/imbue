import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"

import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"

// import stripe from "tipsi-stripe"
// const STRIPE_PUBLISHABLE_KEY = 'pk_test_UfUpsxLlCWUeZL5H8o4LgwzP00HpL3bKwl'
// stripe.setOptions({
//     publishableKey: STRIPE_PUBLISHABLE_KEY,
// })



let currentUser = {}
let customerData = {}

// const stripe = loadStripe(STRIPE_PUBLISHABLE_KEY)


function onComponentMount() {
    firebase.auth().onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
            currentUser = firebaseUser
            firebase
                .firestore()
                .collection("stripe_customers")
                .doc(currentUser.uid)
                .onSnapshot((snapshot) => {
                    if (snapshot.data()) {
                        customerData = snapshot.data()
                        startDataListeners()
                    } else {
                        // This should not happen, unless a user was signed up wrongly
                        console.warn(
                            `No Stripe customer found in Firestore for user: ${currentUser.uid}`
                        )
                    }
                })
        } else {
            // If user is on this screen, this should not happen.
            console.warn("PaymentSettings:  User is signed out.")
        }
    })
}

function startDataListeners() {
    /**
     * Get all payment methods for logged in customer
     */
    firebase
        .firestore()
        .collection("stripe_customers")
        .doc(currentUser.uid)
        .collection("payment_methods")
        .onSnapshot((snapshot) => {
            if (snapshot.empty) {
                // There are no cards added
            }

            snapshot.forEach((doc) => {
                const paymentMethod = doc.data()
                if (!paymentMethod.card) return

                // Do this for each card that's added
                // ...
                // paymentMethod.id // for internal usage
                // paymentMethod.card.brand
                // paymentMethod.card.last4
                // paymentMethod.card.exp_month
                // paymentMethod.card.exp_year
            })
        })

    /**
     * Get all payments for the logged in customer
     */
    firebase
        .firestore()
        .collection("stripe_customers")
        .doc(currentUser.uid)
        .collection("payments")
        .onSnapshot((snapshot) => {
            if (snapshot.empty) {
                // There haven't been any transactions
            }

            snapshot.forEach((doc) => {
                const payment = doc.data()

                // Do this with each payment
                // ...
            })
        })
}

/**
 * Function for save button
 */
async function save() {
    const cardholderName = holderNameText

    const { setupIntent, error } = await stripe.confirmCardSetup(
        customerData.setup_secret,
        {
            payment_method: {
                card: /*cardElement*/null,
                billing_details: {
                    name: cardholderName,
                },
            },
        }
    )

    if (error) {
        console.error(`Error with stripe.confirmCardSetup()  |  ${error.message}`)
        return
    } else {
        console.log("Success with stripe.confirmCardSetup()")
    }

    await firebase
        .firestore()
        .collection("stripe_customers")
        .doc(currentUser.uid)
        .collection("payment_methods")
        .add({ id: setupIntent.payment_method })
}

/**
 * Function for a pay button,
 * which will have to implemented somewhere in the future, anyways
 */
async function pay() {
    const amount = /*amount*/null
    const currency = /*currency*/null
    const data = {
        payment_method: /*pm_ABCDEFG (some kinda id)*/null,
        currency,
        amount: formatAmountForStripe(amount, currency),
        status: "new",
    }

    await firebase
        .firestore()
        .collection('stripe_customers')
        .doc(currentUser.uid)
        .collection('payments')
        .add(data)
}

/**
 * Helper functions
 */
// Format amount for Stripe
function formatAmountForStripe(amount, currency) {
    return zeroDecimalCurrency(amount, currency)
        ? amount
        : Math.round(amount * 100);
}
// Check if we have a zero decimal currency
// https://stripe.com/docs/currencies#zero-decimal
function zeroDecimalCurrency(amount, currency) {
    let numberFormat = new Intl.NumberFormat(['en-US'], {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
    });
    const parts = numberFormat.formatToParts(amount);
    let zeroDecimalCurrency = true;
    for (let part of parts) {
        if (part.type === 'decimal') {
            zeroDecimalCurrency = false;
        }
    }
    return zeroDecimalCurrency;
}






export default function PaymentSettings(props) {
    // handleCardPayPress = async () => {
    //     try {
    //         console.log("stripe.paymentRequestWithCardForm() START")

    //         const token = await stripe.paymentRequestWithCardForm({
    //             // Only iOS support this option
    //             smsAutofillDisabled: true,
    //             requiredBillingAddressFields: 'full',
    //             prefilledInformation: {
    //                 billingAddress: {
    //                     name: 'Gunilla Haugeh',
    //                     line1: 'Canary Place',
    //                     line2: '3',
    //                     city: 'Macon',
    //                     state: 'Georgia',
    //                     country: 'US',
    //                     postalCode: '31217',
    //                     email: 'ghaugeh0@printfriendly.com',
    //                 },
    //             },
    //         })
    
    //         console.log("stripe.paymentRequestWithCardForm() END")
    //     } catch (err) {
    //         console.log("Error in handleCardPayPress()")
    //         console.log(err.code)
    //         console.log(err.msg)
    //     }
    // }

    const exampleUser = {
        cardNumber: "4242424242424242",
        expMonth: "12",
        expYear: "24",
        cvc: "333",
        name: "Oskar Birch",
        address_zip: "345",
    }

    // const initPaymentMethod = firebase.functions().httpsCallable("initPaymentMethod")
    // initPaymentMethod(exampleUser)
    //     .then(result => {
    //         console.log(result)
    //     })
    //     .catch(err => {
    //         console.log("error")
    //         console.log(err.code)
    //         console.log(err.message)
    //     })

    const [holderNameText, setHolderNameText] = useState("")
    const [creditCardText, setCreditCardText] = useState("")
    const [expireDateText, setExpireDateText] = useState("")
    const [CCVText, setCCVText] = useState("")
    const [zipCodeText, setZipCodeText] = useState("")

    function done() {
        console.log("DONE ACTION")
    }

    return (
        <ProfileLayout capsuleStyle={styles.container}>
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
                onPress={done}
            />
        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
})