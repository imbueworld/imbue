import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, RefreshControl, Platform } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import User from '../backend/storage/User'
import { FONTS } from '../contexts/Styles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import CustomButton from "../components/CustomButton"
import { colors } from "../contexts/Colors"


export default function SuccessScreen(props) {
  const { successMessageType } = props.route.params
  let navigation = useNavigation()




  useEffect(() => {
    const init = async () => {
      // go back
      // setTimeout(
      //   () => { navigation.navigation() },
      //   5000
      // )

    }; init()
  }, [])


  return (
    <View style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.bg,
      paddingHorizontal: 30
    }} >
      <LottieView source={require('../components/img/animations/loading-dots.json')} style={{ marginRight: 100, marginLeft: 50 }} autoPlay loop />

    </View>
  )
}

const styles = StyleSheet.create({

})