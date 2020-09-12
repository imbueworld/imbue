import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, ScrollView, Image } from 'react-native'

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"
import { signIn } from '../backend/BackendFunctions'
import { handleAuthErrorAnonymous } from '../backend/HelperFunctions'
import SocialLogin from '../components/SocialLogin'
import { StackActions } from '@react-navigation/native'



export default function Login(props) {
  let cache = props.route.params.cache

  const [redFields, setRedFields] = useState([])
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function invalidate() {
    let redFields = []
    if (!email) redFields.push("email")
    if (!password) redFields.push("password")

    if (redFields.length) {
      setRedFields(redFields)
      return "Required fields need to be filled."
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
    >

      <AppBackground />
      {/* <Image
          style={{
              width: "100%",
              height: "100%",
              position: "absolute",
          }}
          source={require("../components/img/workout-23.jpg")}
      /> */}
      <CompanyLogo />

      <CustomCapsule containerStyle={styles.container}>

        <SocialLogin
          cache={cache}
          containerStyle={{
            marginTop: 20,
            marginBottom: 10,
            marginHorizontal: 20,
          }}
          onAuthChange={() => {
            const pushAction = StackActions.push("Boot")
            props.navigation.dispatch(pushAction)
          }}
          // onError={err => {
          //   // setErrorMsg(err.message)
          //   setErrorMsg(`${err.code}  |  ${err.message}`)
          // }}
        />

        {errorMsg
          ? <Text style={{ color: "red" }}>{errorMsg}</Text>
          : <Text style={{ color: "green" }}>{successMsg}</Text>}

        <CustomTextInput
          containerStyle={{
            borderColor: redFields.includes("email") ? "red" : undefined,
          }}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <CustomTextInput
          containerStyle={{
            borderColor: redFields.includes("password") ? "red" : undefined,
          }}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />

        <CustomButton
          style={{
            marginBottom: 20,
          }}
          title="Login"
          onPress={async () => {
            setRedFields([])
            setErrorMsg("")
            setSuccessMsg("")

            let errorMsg
            try {
              // Validate
              errorMsg = invalidate()
              if (errorMsg) throw new Error(errorMsg)
              
              // Log in
              await signIn(cache, { email, password })
              setSuccessMsg("You've signed in!")

              // Navigate
              const pushAction = StackActions.push("Boot")
              props.navigation.dispatch(pushAction)
            } catch (err) {
              // If not native (form) error, check for auth error
              if (!errorMsg) {
                let [errorMsg, redFields] = handleAuthErrorAnonymous(err)
                setRedFields(redFields)
                setErrorMsg(errorMsg)
                return
              }
              // Otherwise...
              // setRedFields(redFields)
              setErrorMsg(errorMsg)
            }
          }}
        />
      </CustomCapsule>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
  },
  container: {
    width: "88%",
    marginBottom: 30,
    alignSelf: "center",
  },
})