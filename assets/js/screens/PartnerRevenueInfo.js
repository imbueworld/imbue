import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"
import CustomText from "../components/CustomText"
import CustomButton from "../components/CustomButton"

import { FONTS } from '../contexts/Styles'
import { currencyFromZeroDecimal } from '../backend/HelperFunctions'
import User from '../backend/storage/User'



export default function PartnerRevenueInfo(props) {
  const [user, setUser] = useState(null)
  const [gym, setGym] = useState(null)

  useEffect(() => {
    const init = async () => {
      const user = new User()

      const gym = (
        await user.retrievePartnerGyms()
      ).map(it => it.getAll())[ 0 ]

      setUser(await user.retrieveUser())
      setGym(gym)
    }; init()
  }, [])


  
  if (!user || !gym) return <View />

  return (
    <ProfileLayout
      innerContainerStyle={{
        paddingBottom: 10,
      }}
    >
      <CustomText
        style={styles.text}
        containerStyle={styles.textContainer}
        label="Revenue"
      >
        {`$${currencyFromZeroDecimal(user.revenue)}`}
      </CustomText>
      <CustomText
        style={styles.text}
        containerStyle={styles.textContainer}
        label="Member Count"
      >
        {gym.active_clients_memberships &&
          gym.active_clients_memberships.length}
      </CustomText>

      <Text style={{
        paddingTop: 15,
        paddingBottom: 10,
        ...FONTS.subtitle,
        textAlign: "center",
        fontSize: 22,
      }}>Payouts</Text>
      <CustomButton
        title="Bank Account"
      />
      <CustomButton
        title="Plaid"
      />

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
})