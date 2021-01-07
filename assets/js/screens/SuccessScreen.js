import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, RefreshControl, Platform } from 'react-native'
import { useDimensions } from '@react-native-community/hooks'

import { useNavigation } from '@react-navigation/native'
import GoBackButton from '../components/buttons/GoBackButton'
import config from '../../../App.config' 
import User from '../backend/storage/User'
import Icon from '../components/Icon'
import { FONTS } from '../contexts/Styles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import { publicStorage } from '../backend/BackendFunctions'
import LottieView from 'lottie-react-native';
import CustomButton from "../components/CustomButton"


export default function SuccessScreen(props) {
  const { gymId } = props.route.params
  const { classDoc } = props.route.params
  let navigation = useNavigation()

  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [r, refresh] = useState(0)
  const [liveStatus, setLiveStatus] = useState(null)
  const [gymImage, setGymImage] = useState(null)
  const [fillerText, setFillerText] = useState(null)

  const [refreshing, setRefreshing] = React.useState(false);
  const [gymName, setGymName] = useState(null)
  const [playbackLink, setPlaybackLink] = useState(null)


  useEffect(() => {
    const init = async () => {
      const user = new User()

      setUser(await user.retrieveUser())
      setUserId(user.uid)
      
    }; init()
  }, [])


  return (
    <>
      <View style={{
        position: "absolute",
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        }} />

          <View style={{
            height: 100,
            width: 300,
            flex: 1,
            marginTop: hp('5%'),
            marginLeft: wp('2%'),
            justifyContent: 'center',
            alignItems: 'center',
          }}>

            <LottieView source={require('../components/img/animations/health-and-fitness.json')} autoPlay loop />;
           
            <Text style={{
              color: "#fff",
              marginTop: 20,
              ...FONTS.body,
              textAlign: "center"
              // justifyContent: 'center',
              // alignItems: 'center',
            }}>
              Congrats you completed a class! Keep it up.
            </Text>

            <CustomButton
              style={{
                marginBottom: 20,
              }}
              title="Go to Home"
              onPress={async () => {
                navigation.navigate('UserDashboard')
              }}
            />
        </View>
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "black"
  },
  video: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: -100,
  },
  GoBackButton: {
    ...config.styles.GoBackButton_screenDefault,
  },
})