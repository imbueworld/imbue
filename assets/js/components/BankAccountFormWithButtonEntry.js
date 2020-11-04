import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  getOnProcceed,
} from './BankAccountFormWithButtonEntry.backend'
import CustomButton from './CustomButton'
import CustomTextInputV2 from './CustomTextInputV2'



export default function BankAccountFormWithButtonEntry(props) {
  const {
    onError=() => {},
    onSuccess=() => {},
  } = props

  const [stage, setStage] = useState('button') // || 'form'
  const [routing_number, setRoutingNumber] = useState('')
  const [account_number, setAccountNumber] = useState('')
  const form = { routing_number, account_number }



  const onProceed = getOnProcceed(form, onError, onSuccess)

  switch (stage) {
    case 'button':
      return (
        <CustomButton
          title='Add Bank Account'
          onPress={() => setStage('form')}
        />
      )
    case 'form':
      return (
        <>
        <CustomTextInputV2
          containerStyle={styles.textInput}
          placeholder='Routing Number'
          onChangeText={setRoutingNumber}
        />
        <CustomTextInputV2
          containerStyle={styles.textInput}
          placeholder='Account Number'
          onChangeText={setAccountNumber}
        />
        <CustomButton
          style={styles.proceed}
          title='Proceed'
          onPress={onProceed}
        />
        </>
      )
    default:
      return <View />
  }
}

const styles = StyleSheet.create({
  textInput: {
    marginBottom: 10,
  },
  proceed: {
    marginTop: 0,
  },
})
