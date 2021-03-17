import React, { useState, useEffect } from 'react'
import { SafeAreaView, StyleSheet, Text, View, Platform } from 'react-native'

import CustomButton from "../components/CustomButton"
import MembershipApprovalBadge from '../components/MembershipApprovalBadge'
import MembershipApprovalBadgeImbue from '../components/MembershipApprovalBadgeImbue'
import firestore from '@react-native-firebase/firestore';

import { colors } from '../contexts/Colors'
import GymLayout from '../layouts/GymLayout'
import { FONTS } from '../contexts/Styles'
import CreditCardSelectionV2 from '../components/CreditCardSelectionV2'
import Icon from '../components/Icon'
import User from '../backend/storage/User'
import Gym from '../backend/storage/Gym'
import config from '../../../App.config'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import functions from '@react-native-firebase/functions'


export default function GymDescription(props) {
  const gym  = props.route.params

  const [gymId, setGymId] = useState('')

  const [r, refresh] = useState(0)
  const [errorMsg, setErrorMsg] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  // const [gym, setGym] = useState('')
  const [partnerInfo, setPartnerInfo] = useState(null)

  const [user, setUser] = useState(null)
  const [userId, setUserId] = useState(null)

  const [Genres, GenresCreate] = useState(null)
  const [Desc, DescCreate] = useState(null)
  const [Name, NameCreate] = useState(null)

  const [popup, setPopup] = useState(false)

  const [hasMembership, setHasMembership] = useState(null)

  // useEffect(() => {
  //   const init = async () => {
  //     const user = new User()
  //     setUser(await user.retrieveUser())
     
  //     const gym = new Gym()
  //     setGym(await gym.retrieveGym(gymId))
  //     console.log("gym (description): ", gym)
  //   }; init()
  // }, [popup])

  useEffect(() => {
    const {
      id
    } = gym
    setGymId(id)
    const init = async () => {
      const thisUser = new User()
      setUser(await thisUser.retrieveUser())
      setUserId(user.uid)
    }; init()
  }, [])

  useEffect(() => {
    const init = async () => {
      if (!gym) return
      if (!user) return
      const imbue = new Gym()

      const {
        id: imbueId,
      } = await imbue.retrieveGym('imbue')

      let hasMembership =
        user.active_memberships.includes(imbueId)
          ? 'imbue'
          : user.active_memberships.includes(gym.id)
            ? 'gym'
            : false
      
      setHasMembership(hasMembership)
    }; init()
  }, [user])



  useEffect(() => {
    if (!gym) return

    NameCreate(
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>{gym.name}</Text>
      </View>
    )
    GenresCreate(
      <View style={styles.genreContainer}>
        {gym.genres && gym.genres.map((txt, idx) =>
          <View
            style={styles.genre}
            key={idx}
          >
            <Text style={styles.genreText}>{txt}</Text>
          </View>)}
      </View>
    )
    DescCreate(
      <View style={styles.descContainer}>
        <Text style={styles.descText}>
          {gym.description}
        </Text>
      </View>
    )
  }, [gym])
 
  function openClassesSchedule() {
    props.navigation.navigate(
      "ScheduleViewer", { gymId })
  }

  // if (!gym) return <View />

  return (
    <SafeAreaView style={{ flex: 0, backgroundColor: colors.bg, paddingTop: Platform.OS === 'android' ? 25 : 0 }}>

    <GymLayout
      innerContainerStyle={{
        paddingBottom: 10 
        }}
      data={gym}
    >
      {Name} 
      {Genres}
      {Desc} 
      
      {/* <CustomButton
        style={{
          marginBottom: 0,
        }}
          title="Join Livestream for Free"
          onPress={() => {
            props.navigation.navigate("Livestream", { gymId })
          }}
        /> */}
{/* 
      <CustomButton
        style={{
          marginBottom: 0,
        }}
        title="Classes"
        onPress={openClassesSchedule}
        />
         */}
        

      {errorMsg
      ? <Text style={{ color: "red" }}>{errorMsg}</Text>
      : null}
      {successMsg
      ? <Text style={{ color: "green" }}>{successMsg}</Text>
      : null}

      {/* if null, it means it hasn't been initialized yet. */}
      {hasMembership === null ? <View /> :
        hasMembership ? null :
          <>
          {popup === "buy"
            ? <CreditCardSelectionV2
                containerStyle={styles.cardSelectionContainer}
                title={
                  <Text>
                    {`Confirm payment for ${gym.name}'s`}
                    <Text style={{
                      textDecorationLine: "underline"
                    }}>Unlimited Membership:</Text>
                  </Text>
                }
                price={
                  <Text>{`$${gym.membership_price_online} `}</Text>
                }
                onX={() => setPopup(null)}
                onCardSelect={async paymentMethodId => {
                  try {
                    setErrorMsg('') 
                    setSuccessMsg('')

                    const { id: gymId } = gym


                    const user = new User()
                    await user.purchaseGymMembership({ 
                      user, 
                      paymentMethodId,
                      gymId,
                    })

                    // sendGridPurchasedYourMembership
                    try {
                      // initiate SendGrid email
                      const sendGridPurchasedYourMembership = functions().httpsCallable('sendGridPurchasedYourMembership')
                      await sendGridPurchasedYourMembership(gymId)
                    } catch (err) {
                      setErrorMsg('Email could not be sent')
                    }

                    // sendGridMemberPurchasedMembership
                    try {
                      // initiate SendGrid email
                      const sendGridMemberPurchasedMembership = functions().httpsCallable('sendGridMemberPurchasedMembership')
                      await sendGridMemberPurchasedMembership(userId)
                    } catch (err) {
                      setErrorMsg('Email could not be sent')
                    }

                    // After success with purchase
                    setHasMembership('gym')
                    navigation.navigate ('SuccessScreen', {successMessageType: 'UserPurchasedMembership'})
                    setTimeout(
                      () => {  navigation.navigate ('ScheduleViewer') },
                      7000
                    )
                  } catch (err) {
                    if (config.DEBUG) console.error(err.message) // DEBUG
                    switch (err.code) {
                      case "busy":
                        setErrorMsg(err.message)
                        break
                      case "membership-already-bought":
                        setSuccessMsg(err.message)
                        break
                      default:
                        setErrorMsg("Something prevented the action.")
                        break
                    }
                  }
                }}
              />
            : <>
              <CustomButton
                style={{
                  marginBottom: 0, 
                }}
                title="Get Membership" 
                onPress={() => setPopup("buy")} 
                // Icon={
                //   <Icon
                //     source={require("../components/img/png/membership.png")}
                //   />
                // }
              />
              
             {/* <CustomButton
                style={{
                  marginBottom: 0,
                }}
                textStyle={{
                  fontSize: 16,
                }}
                title="Get Imbue Universal Membership"
                onPress={() => props.navigation.navigate("PurchaseUnlimited")}
                Icon={
                  <Icon
                    source={require("../components/img/png/membership-2.png")}
                  />
                }
              /> */}
              </>}
          </>}

      {hasMembership === "gym" ?
        <MembershipApprovalBadge
          containerStyle={{
            marginTop: 10,
          }}
          data={gym}
        /> : null}

      {hasMembership === "imbue" ?
        <MembershipApprovalBadgeImbue
          containerStyle={{
            marginTop: 10,
          }}
          data={gym}
        /> : null}
      </GymLayout>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
  // scrollView: {
  //     minHeight: "100%",
  // },
  // container: {
  //     width: "88%",
  //     marginVertical: 30,
  //     alignSelf: "center",
  // },
  // innerContainer: {
  //     paddingHorizontal: 0,
  // },
  // gymImg: {
  //     width: "100%",
  //     height: "100%",
  //     height: 300,
  //     borderRadius: 30,
  //     borderBottomLeftRadius: 0,
  //     borderBottomRightRadius: 0,
  // },
  // button: {
  //     // marginVertical: 20,
  //     marginTop: 10,
  //     marginBottom: 0,
  // },
  cardSelectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 30,
    marginBottom: hp('5%')
  },
  nameContainer: {},
  nameText: {
    marginTop: hp('2%'),
    ...FONTS.title,
    textAlign: "center",
    fontSize: 27,
  },
  genreContainer: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  genre: {
    marginRight: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  genreText: {
    ...FONTS.subtitle,
    fontSize: 14,
  },
  descContainer: {
    marginTop: 0,
    textAlign: "center",
    paddingHorizontal: hp('5%'),
    paddingVertical: hp('1%'),
    borderRadius: 30,
    marginBottom: 10
    // borderWidth: 1,
    // borderColor: colors.gray,
  },
  descText: {
    ...FONTS.body,
    fontSize: 16,
    textAlign: "center",
  },
})