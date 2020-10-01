import React, { useEffect } from 'react'
import { StyleSheet, ScrollView, View, Button } from 'react-native'
import config from '../../../App.config'

import AppBackground from "../components/AppBackground"
import CompanyLogo from "../components/CompanyLogo"

import auth from "@react-native-firebase/auth"
import { GoogleSignin } from '@react-native-community/google-signin'
import { LoginManager } from 'react-native-fbsdk'
import { StackActions, useNavigation } from '@react-navigation/native'
import { colors } from '../contexts/Colors'

import User from '../backend/storage/User'


export default function Boot(props) {
  // signs out user on app load
  // auth().signOut()
  // GoogleSignin.signOut()
  // LoginManager.logOut()

  const navigation = useNavigation()

  const bootWithUser = async () => {
    const user = new User()
    const { account_type } = await user.retrieveUser()

    switch (account_type) {
      case "user":
        navigation.reset({
          index: 0,
          routes: [{ name: "UserDashboard" }],
        })
        break
      case "partner":
        navigation.reset({
          index: 0,
          routes: [{ name: "PartnerDashboard" }],
        })
        break
    }
  }
  
  useEffect(() => {
    // Clear (session) cache no matter what, when entering this screen
    // Object.keys(cache).forEach(key => {
    //   cache[key] = null
    // })
    // cache.working = {}
    // [COMMENTED, BECAUSE THIS MAY NOT BE NEEDED ANYMORE]


    // Do not redirect automatically, if DEBUG
    if (config.DEBUG) return

    if (auth().currentUser) {
      bootWithUser()
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    }
  }, [])



  if (!config.DEBUG) return <CompanyLogo containerStyle={{
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgIcon,
  }}/>

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <AppBackground />
      <View style={styles.container}>
        <View style={{ height: 10, borderBottomWidth: 1, }} />
        <Button
          title="Normal Boot"
          onPress={() => {
            if (auth().currentUser) {
              bootWithUser()
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }]
              })
            }
          }}
        />

        <View style={{ height: 10, borderBottomWidth: 1, }} />
        <Button
          title="Testing Grounds"
          onPress={() => {
            props.navigation.navigate("Test")
          }}
        />
        <View style={{ height: 10, borderBottomWidth: 1, }} />

        <View style={{ height: 50 }} />
        <Button
          title="Livestream"
          onPress={() => {
            props.navigation.navigate("Livestream", { gymId: "D4iONGuVmdWwx4zGk4BI" })
          }}
        />

        <View style={{ height: 10 }} />
        <Button
          title="GoLive"
          onPress={() => {
            props.navigation.navigate("GoLive")
          }}
        />

        <View style={{ height: 10, borderBottomWidth: 1, }} />

        <View style={{ height: 10 }} />
        <Button
          title="AddPaymentMethod"
          onPress={() => {
            const pushAction = StackActions.push("AddPaymentMethod")
            props.navigation.dispatch(pushAction)
          }}
        />

        <View style={{ height: 10 }} />
        <Button
          title="ClassDescription"
          onPress={() => {
            const pushAction = StackActions.push("ClassDescription", { gymId: "4qmQLlVGU5Jgd0NLv3Wr" })
            props.navigation.dispatch(pushAction)
          }}
        />

        <View style={{ height: 10 }} />
        <Button
          title="GymDescription"
          onPress={() => {
            const pushAction = StackActions.push("GymDescription", { gymId: "4qmQLlVGU5Jgd0NLv3Wr" })
            props.navigation.dispatch(pushAction)
          }}
        />

        <View style={{ height: 10, borderBottomWidth: 1, }} />

      </View>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
    backgroundColor: "#F9F9F9",
  },
  container: {
    backgroundColor: "#F9F9F9",
  },
})