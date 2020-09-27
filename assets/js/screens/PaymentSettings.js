import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


import AppBackground from "../components/AppBackground"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"
import CreditCardBadge from "../components/CreditCardBadge"
import { retrievePaymentMethods } from '../backend/CacheFunctions'
import { colors } from '../contexts/Colors'
import ProfileLayout from '../layouts/ProfileLayout'



// function initializeCache(cache) {
//     if (!cache.creditCards) cache.creditCards = []
// }

export default function PaymentSettings(props) {
    let cache = props.route.params.cache
    // initializeCache(cache)

    const [creditCards, setCreditCards] = useState([])
    const [CreditCards, CreditCardsCreate] = useState(null)

    useEffect(() => {
        const init = async() => {
            let creditCards = await retrievePaymentMethods(cache)
            setCreditCards(creditCards)
        }
        init()
    }, [props.route.params.referrer])

    useEffect(() => {
        if (!creditCards) return

        CreditCardsCreate(
            creditCards.map(({ brand, last4, exp_month, exp_year }, idx) => 
                <CreditCardBadge
                    key={`${exp_year}${last4}`}
                    data={{ brand, last4, exp_month, exp_year }}
                />
            )
        )
    }, [creditCards.length])//, cache.creditCards.length])

    return (
        // <ScrollView contentContainerStyle={styles.scrollView}>
        //     <AppBackground />
        //     <CustomCapsule style={styles.container}>
        <KeyboardAwareScrollView
            style={{ backgroundColor: '#f9f9f9' }}
            resetScrollToCoords={{ x: 0, y: 0 }}

        contentContainerStyle={styles.container}
        scrollEnabled={false}
       >
                <ProfileLayout
                    cache={cache}
                >
                    <View style={{
                        borderRadius: 20,
                        overflow: "hidden",
                        maxHeight: 450,
                    }}>
                        <ScrollView>
                            { CreditCards }
                        </ScrollView>
                    </View>

                    <CustomButton
                        style={styles.buttonSmall}
                        textStyle={styles.buttonText}
                        title="Add a credit card"
                        onPress={() => {
                            props.navigation.navigate(
                                "AddPaymentMethod",
                                { referrer: "PaymentSettings" }
                            )
                        }}
                    />
                </ProfileLayout>
                </KeyboardAwareScrollView>

        //     </CustomCapsule>
        // </ScrollView>
       
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {
        // paddingBottom: 0,
        width: "100%",
        alignSelf: "center",
    },
    buttonSmall: {
        alignSelf: "center",
        marginVertical: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 999,
    },
    buttonText: {
        color: colors.gray,
        fontSize: 14,
    },
})