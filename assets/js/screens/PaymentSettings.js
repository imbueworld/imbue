import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'

import AppBackground from "../components/AppBackground"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"
import { retrievePaymentMethods } from '../backend/CacheFunctions'
import { colors } from '../contexts/Colors'



export default function PaymentSettings(props) {
    let cache = props.route.params.cache

    // const getCustomerData = firebase.functions().httpsCallable("getCustomerData")
    const [creditCards, setCreditCards] = useState(null)

    const [CreditCards, CreditCardsCreate] = useState(null)

    useEffect(() => {
        const init = async() => {
            let creditCards = await retrievePaymentMethods(cache)
            setCreditCards(creditCards)
        }
        init()
    }, [])

    useEffect(() => {
        if (!creditCards) return

        CreditCardsCreate(
            creditCards.map((doc, idx) =>
                <View
                    style={styles.creditCardContainer}
                    key={idx}
                >
                    <Text style={styles.creditCardText}>
                        {`${doc.brand}  |  ending in ${doc.last4}`}
                    </Text>
                </View>
            )
        )
    }, [creditCards])

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <CustomCapsule style={styles.container}>

                {/* <CustomCapsule style={{
                    paddingHorizontal: 20,
                    paddingVertical: 0,
                    borderRadius: 30,
                }}> */}
                    <View style={{
                        borderRadius: 20,
                        overflow: "hidden",
                        maxHeight: 500,
                    }}>
                        <ScrollView>
                            {CreditCards}
                        </ScrollView>
                    </View>

                    <CustomButton
                        style={styles.buttonSmall}
                        textStyle={styles.buttonText}
                        title="Add a credit card"
                        onPress={() => {
                            props.navigation.navigate(
                                "AddPaymentMethod"
                            )
                        }}
                    />
                {/* </CustomCapsule> */}


            </CustomCapsule>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {
        marginTop: 50,
        // paddingBottom: 0,
        width: "88%",
        alignSelf: "center",
    },
    creditCardContainer: {
        // backgroundColor: "",
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 30,
        marginTop: 20,
        padding: 20,
    },
    creditCardText: {
        fontSize: 20,
        color: colors.gray,
    },
    buttonSmall: {
        alignSelf: "center",
        marginVertical: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 999,
    },
    buttonText: {
        fontSize: 14,
        color: colors.gray,
    },
})