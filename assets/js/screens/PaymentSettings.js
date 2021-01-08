import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useFocusEffect } from '@react-navigation/native';

import CustomButton from "../components/CustomButton"
import CreditCardBadge from "../components/CreditCardBadge"
import { colors } from '../contexts/Colors'
import ProfileLayout from '../layouts/ProfileLayout'
import User from '../backend/storage/User'
import cache from '../backend/storage/cache'
import firestore from '@react-native-firebase/firestore';


export default function PaymentSettings(props) {
  const [creditCards, setCreditCards] = useState([])
  const [CreditCards, CreditCardsCreate] = useState(null)
  const [user, setUser] = useState(null)


  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const init = async () => {
        setCreditCards([])

        const user = new User()
        setUser(await user.retrieveUser())

        getCreditCards(await user.retrieveUser())
        
        // const creditCards = await user.retrievePaymentMethods()
        // setCreditCards(creditCards)
      }; init()
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  ); 


  const getCreditCards = async(thisUser) => {

    let obje
    await firestore()
      .collection('stripe_customers')
      .doc(thisUser.id)
      .collection('payment_methods')
      .get()
       .then((snap) => {
          snap.forEach((doc) => {
            obje = doc.data()
            obje.docId = doc.id
            setCreditCards(creditCards => [...creditCards, obje])
          })
      })

  }


  useEffect(() => {
    // if (!creditCards) return
    console.log("cards: ", creditCards)
    CreditCardsCreate(
      creditCards.map(({ brand, last4, exp_month, exp_year, docId, paymentMethodId }, idx) =>
        <CreditCardBadge 
          key={`${exp_year}${last4}`}
          data={{ brand, last4, exp_month, exp_year }}
          user={user}
          paymentMethodId={docId}
        />
      )
    )
  }, [creditCards])


  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: '#fff' }}
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