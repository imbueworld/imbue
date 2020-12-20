import React, { useEffect, useState } from 'react'
import { View, Text, Linking } from 'react-native'
import firestore from '@react-native-firebase/firestore'


import ProfileLayout from "../layouts/ProfileLayout"
import CustomButton from "../components/CustomButton"
import Icon from '../components/Icon'
import GoBackButton from '../components/buttons/GoBackButton'

import User from '../backend/storage/User'
import { FONTS } from '../contexts/Styles'

export default function PartnerDashboard(props) {
  const [user, setUser] = useState(null)


  useEffect(() => {
    const init = async () => {
      const user = new User()
      setUser(await user.retrieveUser())

    }; init()
  }, [])


  if (!user) return <View />

  return (
    <ProfileLayout
      innerContainerStyle={{
        padding: 10,
      }}
      hideBackButton={false}
      buttonOptions={{
        logOut: {
          show: false,
        },
      }}
    >

      <View>
        <Text style={{ ...FONTS.body, textAlign: 'center', marginTop: 50, marginBottom: 17 }}>
          We're here to help! send us an email or shoot us a text with the links below. We will get back to you as soon as possible.
          </Text>
      </View>


      <CustomButton
        onPress={() => Linking.openURL('mailto:<influencer@imbuefitness.com>?subject=I Need Help&body=I have really been struggling with: (explain here)')}
        title="Send Email" />

      <View>
        <Text style={{ ...FONTS.body, textAlign: 'center', marginTop: 50, marginBottom: 10 }}>
          Or, give us a call:
          </Text>
          <Text style={{ ...FONTS.body, textAlign: 'center', marginTop: 0, marginBottom: 17, fontSize: 6 }}>
          copy and paste phone number
          </Text>
          <Text selectable style={{ ...FONTS.heading, textAlign: 'center', marginTop: 15, marginBottom: 17 }}>
          (952) 292 8738
          </Text>
      </View>


    </ProfileLayout>
  )

}