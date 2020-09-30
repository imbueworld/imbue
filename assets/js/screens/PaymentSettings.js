import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


import CustomButton from "../components/CustomButton"
import CreditCardBadge from "../components/CreditCardBadge"
import { colors } from '../contexts/Colors'
import ProfileLayout from '../layouts/ProfileLayout'
import User from '../backend/storage/User'



export default function PaymentSettings(props) {
  const [creditCards, setCreditCards] = useState([])
  const [CreditCards, CreditCardsCreate] = useState(null)

  useEffect(() => {
    const init = async () => {
      const user = new User()
      const creditCards = await user.retrievePaymentMethods()
      setCreditCards(creditCards)
    }; init()
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
  }, [creditCards.length])

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: '#f9f9f9' }}
      resetScrollToCoords={{ x: 0, y: 0 }}

      contentContainerStyle={styles.container}
      scrollEnabled={false}
    >
      <ProfileLayout>
        <View style={{
          borderRadius: 20,
          overflow: "hidden",
          maxHeight: 450,
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
              "AddPaymentMethod",
              { referrer: "PaymentSettings" }
            )
          }}
        />
      </ProfileLayout>
    </KeyboardAwareScrollView>
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