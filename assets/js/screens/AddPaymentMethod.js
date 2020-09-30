import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"

import User from '../backend/storage/User'



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
  const { referrer } = props.route.params

  const [holderNameText, setHolderNameText] = useState("")
  const [creditCardText, setCreditCardText] = useState("")
  const [expireDateText, setExpireDateText] = useState("")
  const [CVCText, setCVCText] = useState("")
  const [zipCodeText, setZipCodeText] = useState("")

  const [errorMsg, setErrorMsg] = useState("")

  const [user, setUser] = useState(null)

  useEffect(() => {
    const init = async () => {
      const user = new User()
      setUser(await user.retrieveUser())
    }; init()
  }, [])

  async function validateAndProceed() {
    let [expMonth, expYear] = expireDateText.split('/')

    let form = {
      cardNumber: creditCardText,
      expMonth,
      expYear,
      cvc: CVCText,
      name: holderNameText,
      address_zip: zipCodeText,
    }

    try {
      const userObj = new User()
      await userObj.addPaymentMethod(form)

      if (!referrer) {
        props.navigation.goBack()
        return
      }
      props.navigation.navigate(referrer, { referrer: "AddPaymentSettings" })
    } catch (err) {
      setErrorMsg('Something prevented the action.')
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
          keyboardType='number-pad'
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
          value={CVCText}
          onChangeText={(text) => setCVCText(text)}
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