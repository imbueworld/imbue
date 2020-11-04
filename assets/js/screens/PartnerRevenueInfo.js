import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"
import CustomText from "../components/CustomText"
import CustomButton from "../components/CustomButton"

import { FONTS } from '../contexts/Styles'
import { currencyFromZeroDecimal } from '../backend/HelperFunctions'
import User from '../backend/storage/User'
import PlaidButton from '../components/PlaidButton'
import BankAccountFormWithButtonEntry from '../components/BankAccountFormWithButtonEntry'
import config from '../../../App.config'



export default function PartnerRevenueInfo(props) {
  const [user, setUser] = useState(null)
  const [gym, setGym] = useState(null)
  const [hasBankAccountAdded, setHasBankAccountAdded] = useState()
  const [errorMsg, setErrorMsg] = useState('')

  const [r, refresh] = useState(0)

  useEffect(() => {
    const init = async () => {
      const user = new User()
      const userDoc = await user.retrieveUser()
      const gym = (
        await user.retrievePartnerGyms()
      ).map(it => it.getAll())[ 0 ]
      setUser(userDoc)
      setGym(gym)
      setHasBankAccountAdded(Boolean(userDoc.stripe_bank_account_id))
    }; init()
  }, [r])



  if (!user || !gym || hasBankAccountAdded === undefined) return <View />
  
  return (
    <ProfileLayout
      innerContainerStyle={{
        paddingBottom: 10,
      }}
    >
      <CustomText
        style={styles.text}
        containerStyle={styles.textContainer}
        label='Revenue of the ongoing month'
      >
        {`$${currencyFromZeroDecimal(user.revenue)}`}
      </CustomText>
      {/* <CustomText
        style={styles.text}
        containerStyle={styles.textContainer}
        label="Member Count"
      >
        ?
      </CustomText> */}

      <Text style={{
        paddingTop: 15,
        paddingBottom: 10,
        ...FONTS.subtitle,
        textAlign: "center",
        fontSize: 22,
      }}>Payouts</Text>

      <Text style={styles.error}>{ errorMsg }</Text>

      { !hasBankAccountAdded ? <>
        <BankAccountFormWithButtonEntry
          onError={setErrorMsg}
          onSuccess={() => refresh(r => r + 1)}
        />
        <PlaidButton onError={setErrorMsg} />
      </> : <>
        <Text style={styles.confirmation}>Your bank account has been linked.</Text>
      </>}

      <Text style={styles.miniText}>In order to receive payouts, you must also make sure to have provided all necessary information in the Profile Settings.</Text>

    </ProfileLayout>
  )
}

const styles = StyleSheet.create({
  text: {
    paddingVertical: 8,
    alignSelf: "center",
    fontSize: 22,
  },
  textContainer: {
    marginVertical: 10,
  },
  miniText: {
    ...config.styles.body,
    fontSize: 12,
    textAlign: 'justify',
  },
  confirmation: {
    ...config.styles.body,
    color: 'green',
    textAlign: 'center',
    paddingBottom: 10,
  },
  error: {
    ...config.styles.body,
    color: 'red',
    textAlign: 'center',
  },
})