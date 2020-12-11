import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import firestore from '@react-native-firebase/firestore'


import ProfileLayout from "../layouts/ProfileLayout"
import CustomButton from "../components/CustomButton"
import Icon from '../components/Icon'
import GoBackButton from '../components/buttons/GoBackButton'

import User from '../backend/storage/User'
import { FONTS } from '../contexts/Styles'

export default function PartnerDashboard(props) {
  const [user, setUser] = useState(null)



  return (

      <ProfileLayout
        innerContainerStyle={{
          padding: 10,
        }}
        hideBackButton={true}
        buttonOptions={{
          logOut: {
            show: true,
          },
        }}
      >
        <View>
          <Text style={{
        ...FONTS.body,
        fontSize: 20
          }}
          >
            Thank you so much for applying to showcase you're fitness content on imbue.

            We'll be in touch withn 12 hours if we think you're a great fit!
          </Text>
        </View>
      </ProfileLayout>
  )

}


