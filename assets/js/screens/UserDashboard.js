import React, { useState, useEffect, useRef, Component } from 'react'
import { StyleSheet, View, Animated, TouchableHighlight, BackHandler, Text } from 'react-native'

import { useDimensions } from '@react-native-community/hooks'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "../components/CustomButton"
import CustomTextInput from "../components/CustomTextInput"

import auth from "@react-native-firebase/auth"
import Icon from '../components/Icon'
import { simpleShadow } from '../contexts/Colors'
import { GoogleSignin } from '@react-native-community/google-signin'
import { LoginManager } from 'react-native-fbsdk'
import { useNavigation } from '@react-navigation/native'
import User from '../backend/storage/User'
import cache from '../backend/storage/cache'
import AlgoliaSearchAbsoluteOverlay from '../components/AlgoliaSearchAbsoluteOverlay'
import config from '../../../App.config'
// import ImbueMap from '../components/ImbueMap'



export default function UserDashboard(props) {
  const navigation = useNavigation()

  const [expanded, setExpanded] = useState(null)

  const { width, height } = useDimensions().window
  const slidingAnim = useRef(new Animated.Value(-1 * width - 25)).current

  const [user, setUser] = useState(null)

  useEffect(() => {
    const init = async () => {
      const user = new User()
      setUser(await user.retrieveUser())

      // This acts as a prefetch for when user eventually navs to ScheduleViewer
      user.retrieveClasses()
    }; init()
  }, [])

  /**
   * Some logic to control Native Back Button
   */
  useEffect(() => {
    cache("UserDashboard/toggleMenu").set(() => setExpanded(expanded => !expanded))

    // Takes control or releases it upon each toggle of the side menu
    if (expanded) cache("UserDashboard/toggleMenu/enabled").set(true)
    else cache("UserDashboard/toggleMenu/enabled").set(false)

    // Stops listening upon leaving screen
    navigation.addListener("blur", () => {
      cache("UserDashboard/toggleMenu/enabled").set(false)
    })

    // Continues listening upon coming back to screen
    navigation.addListener("focus", () => {
      if (expanded === null) return // do not run on initial render
      cache("UserDashboard/toggleMenu/enabled").set(true)
    })

    const onBack = () => {
      const controlled = cache("UserDashboard/toggleMenu/enabled").get()
      const toggleMenu = cache("UserDashboard/toggleMenu").get()

      if (controlled) {
        toggleMenu()
        return true
      }
    }
    
    // Even though this is called every expanded state change,
    // assuming it doesn't matter how many listeners are added
    BackHandler.addEventListener('hardwareBackPress', onBack)
  }, [expanded])

  function sidePanelSlideIn() {
    Animated.timing(slidingAnim, {
      toValue: -1 * width - 25, // -25 to hide the added side in <ProfileLayout /> as well
      duration: 275,
      useNativeDriver: false,
    }).start()
  }

  function sidePanelSlideOut() {
    Animated.timing(slidingAnim, {
      toValue: 0,
      duration: 425,
      useNativeDriver: false,
    }).start()
  }

  useEffect(() => {
    if (expanded === null) return // do not run on initial render
    if (expanded) sidePanelSlideOut()
    else sidePanelSlideIn()
  }, [expanded])



  return (
    <>
    <AlgoliaSearchAbsoluteOverlay style={{ position: 'absolute', top: 300 }}/>

    {/* <ImbueMap style={styles.map} /> */}

    {
    !user ? null :
    expanded ? null :
      <View style={{
        marginTop: 50,
        marginLeft: 15,
        position: "absolute",
        zIndex: 0,
      }}>
        <TouchableHighlight
          style={{
            borderRadius: 999,
          }}
          underlayColor="#000000C0"
          onPress={() => setExpanded(!expanded)}
          // [v DEBUG ONLY v]
          onLongPress={config.DEBUG ? (() => setExpanded(!expanded)) : undefined}
          // [^ DEBUG ONLY ^]
        >
          <Icon
            containerStyle={{
              width: 64,
              height: 64,
              borderRadius: 999,
              overflow: "hidden",
              ...simpleShadow,
            }}
            source={{ uri: user.icon_uri_full }}
          />
        </TouchableHighlight>
      </View>
      }
      

    {!user ? null :
    <Animated.View style={[styles.sidePanel, { left: slidingAnim }]}>
      <ProfileLayout
        innerContainerStyle={{
          paddingBottom: 10,
        }}
        buttonOptions={{
          logOut: {
            show: true,
            onPress: async () => {
              await Promise.all([
                auth().signOut(),
                GoogleSignin.signOut(),
                LoginManager.logOut(),
              ])
              if (expanded) setExpanded(false)
              navigation.reset({
                index: 0,
                routes: [{ name: 'Boot' }],
              })
            }
          },
        }}
        onBack={() => setExpanded(!expanded)}
      >
        <CustomButton
          icon={
            <Icon
              source={require("../components/img/png/my-classes.png")}
            />
          }
          title="My Classes"
          onPress={() => {
            props.navigation.navigate("ScheduleViewer")
          }}
        />
        <CustomButton
          icon={
            <Icon
              source={require("../components/img/png/user-memberships.png")}
            />
          }
          title="Manage Memberships"
          onPress={() => props.navigation.navigate(
            "UserMemberships")}
        />
        <CustomButton
          icon={
            <Icon
              source={require("../components/img/png/profile.png")}
            />
          }
          title="Edit Profile"
          onPress={() => props.navigation.navigate(
            "ProfileSettings")}
        />
        <CustomButton
          icon={
            <Icon
              source={require("../components/img/png/generic-credit-card.png")}
            />
          }
          title="Payment Settings"
          onPress={() => props.navigation.navigate(
            "PaymentSettings")}
        />

      </ProfileLayout>
          </Animated.View>}
      </>
     
  )
    
}

const styles = StyleSheet.create({
  container: {
    // minHeight: "100%", // This breaks sidePanel within <Anmimated.View>; minHeight does not synergize well with child position: "absolute" 's ? ; Unless it's used for ScrollView containerStyle?
    // flex: 1,
    // width: "100%",
    // height: "100%",
  },
  sidePanel: {
    width: "100%",
    height: "100%",
    // minWidth: "100%",
    // minHeight: "100%",
    position: "absolute",
    zIndex: 100,
  },
  // map: {
  //   position:'absolute',
  //   // top:0,
  //   // left:0,
  //   // right:0,
  //   // bottom:0,
  //   width: '100%',
  //   height: '100%',
  //   zIndex: -100,
  // },
  badgeContainer: {
    width: "100%",
    marginBottom: 40,
    bottom: 0,
  },
})