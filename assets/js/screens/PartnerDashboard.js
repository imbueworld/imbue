import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View, RefreshControl, Text, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"
import CustomButton from "../components/CustomButton"
import Icon from '../components/Icon'
import CustomText from "../components/CustomText"

import User from '../backend/storage/User'
import { FONTS } from '../contexts/Styles'
import { currencyFromZeroDecimal } from '../backend/HelperFunctions'
import PlaidButton from '../components/PlaidButton'
import BankAccountFormWithButtonEntry from '../components/BankAccountFormWithButtonEntry'
import config from '../../../App.config'
import { useNavigation } from '@react-navigation/native'
import functions from '@react-native-firebase/functions'
import firestore from '@react-native-firebase/firestore';



export default function PartnerDashboard(props) {
  const [user, setUser] = useState(null)
  const [gym, setGym] = useState(null)
  const [hasBankAccountAdded, setHasBankAccountAdded] = useState()
  const [errorMsg, setErrorMsg] = useState('')
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = React.useState(false);

  const [r, refresh] = useState(0)

  useEffect(() => {
    async function init() {
      const user = new User()
      const userDoc = await user.retrieveUser()
      const gym = (
        await user.retrievePartnerGyms()
      ).map(it => it.getAll())[ 0 ]
      setUser(userDoc)
      setGym(gym) 
      setHasBankAccountAdded(Boolean(userDoc.stripe_bank_account_id))
      // setHasBankAccountAdded(true)

      console.log("user (useEffect): ", user)

      // update Stripe balance revenue
      if (gym) {
        const updateStripeAccountRevenue = functions().httpsCallable('updateStripeAccountRevenue')
        await updateStripeAccountRevenue(gym.id)
      }
    }; init()
  }, [r])

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefresh = React.useCallback(async() => {
    setRefreshing(true);
    const user = new User()
      const userDoc = await user.retrieveUser()
      const gym = (
        await user.retrievePartnerGyms()
    ).map(it => it.getAll())[ 0 ]

    const newUser = await firestore()
      .collection('partners')
      .doc(gym.partner_id)
      .get();
    setUser(newUser.data())
    wait(2000).then(() => setRefreshing(false));

  }, []);

  if (!user || !gym || hasBankAccountAdded === undefined) return <View />

  const toggleStream = async () => {
    console.log("pressed")
    const stream = cache("streamRef").get()
    const isStreaming = cache("isStreaming").get()

    if (isStreaming) {
      stream.stop()
      cache("isStreaming").set(false)
      return
    } 

    const partnerObj = new User() 
    await partnerObj.createLivestream({ gymId }) // Will not create livestream, if it already has been
    const { stream_key } = await partnerObj.retrieveUser()
    console.log("stream_key: " + stream_key)
    setStreamKey(stream_key)

    stream.start()
    cache("isStreaming").set(true)

  }

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
      {/* Current Balance */}
      <View style={{flex: 1, flexDirection: 'row'}}>
      <CustomText
          style={styles.text}
          containerStyle={styles.textContainer}
          label='Current Balance'
        > 
          {`$${currencyFromZeroDecimal(user.revenue)}`}
        </CustomText>

        {/* Total Earnings */}
        <CustomText
          style={styles.text}
          containerStyle={styles.textContainer} 
          label='Total Earnings'
        > 
          {`$${currencyFromZeroDecimal(user.total_revenue)}`}
        </CustomText>
        </View>
        
        {/* <CustomText
          style={styles.text}
          containerStyle={styles.textContainer}
          label="Member Count"
        >
          ?
        </CustomText> */}

        
      <CustomButton 
        // icon={
        //   <Icon
        //     source={require("../components/img/png/livestream.png")}
        //   />
        // }
        title="Go Live"
        onPress={() => {
          props.navigation.navigate(
            "PreLiveChecklist",
          )

          // toggleStream,
          // props.navigation.navigate(
          //   "GoLive",
          // )
        }}
      />
       {/* <CustomButton
        icon={
          <Icon
            source={require("../components/img/png/my-classes-2.png")}
          />
        }
        title="Create Class"
        onPress={() => props.navigation.navigate(
          "PartnerUpdateClasses"
        )}
      /> */}
      {/* <CustomButton
        title="Livestream Settings"
        onPress={() => {props.navigation.navigate(
            "PartnerLivestreamDashboard")}}
      /> */}
      <CustomButton
        // icon={
        //   <Icon
        //     source={require("../components/img/png/my-classes.png")}
        //   />
        // }
        title="Classes"
        onPress={() => {
          props.navigation.navigate(
            "ScheduleViewer",
            { gymId: user.associated_gyms[0] })
        }}
      />
        {/* <CustomButton
        title='Revenue 💰'
        onPress={() => props.navigation.navigate(
          "PartnerRevenueInfo"
        )}
        /> */}
      <CustomButton
        // icon={
        //   <Icon
        //     source={require("../components/img/png/profile.png")}
        //   />
        // }
        title="Edit Profile"
        onPress={() => props.navigation.navigate(
          "ProfileSettings")}
      />
      {/* <CustomButton
        icon={
          <Icon
            source={require("../components/img/png/gym-settings.png")}
          />
        }
        title="Manage Gym"
        onPress={() => { 
          props.navigation.navigate(
            "PartnerGymSettings")
        }}
      /> */}

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
    marginStart: 5,
    marginEnd: 5,
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
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  logOutButtonContainer: {
    width: 64,
    height: 64,
    marginTop: 10,
    marginRight: 10,
    position: "absolute",
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 999,
    zIndex: 110,
  },
})
