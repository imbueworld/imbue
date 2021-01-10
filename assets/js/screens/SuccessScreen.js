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
  const { gymId } = props.route.params
  let navigation = useNavigation()




  useEffect(() => {
    const init = async () => {
        // go back
      setTimeout(
        () => { navigation.navigation() },
        5000
      )
      
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


            <LottieView source={require('../components/img/animations/black-check-animation.json')} style={{width: 250, height: 250}} autoPlay loop />
           
            <Text style={{
              color: colors.textInputFill,
              ...FONTS.body,
              textAlign: 'center',
              marginTop: 30,
            }}>
              Congrats! You completed a class. Keep it up.
            </Text>

            <CustomButton
              style={{
                marginBottom: 20,
                paddingHorizontal: 40,
                marginTop: 30
              }}
              title="Go to Home"
              onPress={async () => {
                navigation.navigate('UserDashboard')
              }}
            />
    </View>
  )
}

const styles = StyleSheet.create({

})