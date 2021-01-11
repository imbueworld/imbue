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
      {successMessageType === "UserLiveStreamCompleted" ?
        <>
          <LottieView source={require('../components/img/animations/black-check-animation.json')} style={{ width: 250, height: 250 }} autoPlay loop />

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


        </>
        :
        successMessageType === "PartnerLiveStreamCompleted" ?
          <>
            <LottieView source={require('../components/img/animations/black-check-animation.json')} style={{ width: 250, height: 250 }} autoPlay loop />

            <Text style={{
              color: colors.textInputFill,
              ...FONTS.body,
              textAlign: 'center',
              marginTop: 30,
            }}>
              Congrats! You completed your class. Thanks so much for using imbue - we couldn't do what we do without you.
              </Text>
          </>
          :
          successMessageType === "PartnerApplicationSubmitted" ?
          <>
            <LottieView source={require('../components/img/animations/black-check-animation.json')} style={{ width: 250, height: 250 }} autoPlay loop />

            <Text style={{
              color: colors.textInputFill,
              ...FONTS.body,
              textAlign: 'center',
              marginTop: 30,
            }}>
              Congrats! Your application has been submitted. We'll get back to you shortly!
              </Text>

            <CustomButton
              style={{
                marginBottom: 20,
                paddingHorizontal: 40,
                marginTop: 30
              }}
              title="Go to Home"
              onPress={ () => {
                navigation.navigate('Landing')
              }}
            />
          </>
          :
          successMessageType === "MemberSignUp" ?
          <>
            <LottieView source={require('../components/img/animations/black-check-animation.json')} style={{ width: 250, height: 250 }} autoPlay loop />

            <Text style={{
              color: colors.textInputFill,
              ...FONTS.body,
              textAlign: 'center',
              marginTop: 30,
            }}>
              Congrats! You created your imbue member account! Let's get you set up for your first class!
              </Text>

          </>
          :
          successMessageType === "UserPurchasedMembership" ?
          <>
            <LottieView source={require('../components/img/animations/black-check-animation.json')} style={{ width: 250, height: 250 }} autoPlay loop />

            <Text style={{
              color: colors.textInputFill,
              ...FONTS.body,
              textAlign: 'center',
              marginTop: 30,
            }}>
              Congrats! You purchased an influencer membership!
              </Text>

            <CustomButton
              style={{
                marginBottom: 20,
                paddingHorizontal: 40,
                marginTop: 30
              }}
              title="Go to your schedule"
              onPress={ () => {
                navigation.navigate('ScheduleViewer')
              }}
            />
          </>
          :
          successMessageType === "UserPurchasedClass" ?
          <>
            <LottieView source={require('../components/img/animations/black-check-animation.json')} style={{ width: 250, height: 250 }} autoPlay loop />

            <Text style={{
              color: colors.textInputFill,
              ...FONTS.body,
              textAlign: 'center',
              marginTop: 30,
            }}>
              Congrats! You purchased an influencer class!
              </Text>

            <CustomButton
              style={{
                marginBottom: 20,
                paddingHorizontal: 40,
                marginTop: 30
              }}
              title="Go to your schedule"
              onPress={ () => {
                navigation.navigate('ScheduleViewer')
              }}
            />
          </>
          :
          successMessageType === "PartnerAccountCreated" ?
          <>
            <LottieView source={require('../components/img/animations/black-check-animation.json')} style={{ width: 250, height: 250 }} autoPlay loop />

            <Text style={{
              color: colors.textInputFill,
              ...FONTS.body,
              textAlign: 'center',
              marginTop: 30,
            }}>
              Congrats! You're account is created!
              </Text>

            <CustomButton
              style={{
                marginBottom: 20,
                paddingHorizontal: 40,
                marginTop: 30
              }}
              title="Go to Dasboard"
              onPress={ () => {
                navigation.navigate('PartnerDasboard')
              }}
            />
          </>
          :
          successMessageType === "ClassCreated" ?
          <>
            <LottieView source={require('../components/img/animations/black-check-animation.json')} style={{ width: 250, height: 250 }} autoPlay loop />

            <Text style={{
              color: colors.textInputFill,
              ...FONTS.body,
              textAlign: 'center',
              marginTop: 30,
            }}>
              Congrats! You created a class! Now, let's schedule it.
              </Text>

          </>
          :
          successMessageType === "ClassScheduled" ?
          <>
            <LottieView source={require('../components/img/animations/black-check-animation.json')} style={{ width: 250, height: 250 }} autoPlay loop />

            <Text style={{
              color: colors.textInputFill,
              ...FONTS.body,
              textAlign: 'center',
              marginTop: 30,
            }}>
              Congrats! You scheduled a class!
              </Text>
          </>
          : null}
    </View>
  )
}

const styles = StyleSheet.create({

})