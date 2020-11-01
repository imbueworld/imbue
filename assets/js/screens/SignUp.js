import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableHighlight, Platform, View, Image } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth'

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"

import { handleAuthError } from '../backend/HelperFunctions'
import SocialLogin from '../components/SocialLogin'
import { StackActions, useNavigation } from '@react-navigation/native'

import BackButton from '../components/BackButton'
import User from '../backend/storage/User'
import GoBackButton from '../components/buttons/GoBackButton';
import config from '../../../App.config';
import CustomTextInputV2 from '../components/CustomTextInputV2';




export default function SignUp(props) {
  const navigation = useNavigation()

  const [redFields, setRedFields] = useState([])
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const [first, setFirst] = useState("")
  const [last, setLast] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")// passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

  const [referrerToken, setReferrerToken] = useState('')


  function invalidate() {
    let redFields = []
    if (!first) redFields.push("first")
    if (!last) redFields.push("last")
    if (!email) redFields.push("email")
    if (!city) redFields.push("city")
    if (!password) redFields.push("password")
    if (!passwordConfirm) redFields.push("passwordConfirm")

    if (redFields.length) {
      setRedFields(redFields)
      return "Required fields need to be filled."
    }

    if (password !== passwordConfirm) {
      setRedFields(["password", "passwordConfirm"])
      setPasswordConfirm("")
      return "Passwords did not match"
    }

    if (password.length < 8
      || !password.match(/[A-Z]/g)
      || !password.match(/[a-z]/g)) {
      setRedFields(["password", "passwordConfirm"])
      return "Password must consist of at least 8 characters, " +
        "and at least 1 lowercase and uppercase letter."
    }
  }

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
      alwaysBounceVertical={false} 
    >
      <AppBackground />
      <CompanyLogo />
      <GoBackButton containerStyle={styles.GoBackButton} />

      <CustomCapsule style={styles.container}>   

        <SocialLogin
          containerStyle={{
            marginTop: 20,
            marginBottom: 10,
            marginHorizontal: 20,
          }}
          onAuthChange={() => {
            const pushAction = StackActions.push("Boot")
            navigation.dispatch(pushAction)
          }}
        />

       
        {errorMsg
          ? <Text style={{ color: "red" }}>{errorMsg}</Text>
          : <Text style={{ color: "green" }}>{successMsg}</Text>}

        <CustomTextInput
          containerStyle={{
            borderColor: redFields.includes("first") ? "red" : undefined,
          }}
          placeholder="First Name"
          value={first}
          onChangeText={setFirst}
        />
        <CustomTextInput
          containerStyle={{
            borderColor: redFields.includes("last") ? "red" : undefined,
          }}
          placeholder="Last Name"
          value={last}
          onChangeText={setLast}
        />
        <CustomTextInput
          containerStyle={{
            borderColor: redFields.includes("email") ? "red" : undefined,
          }}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <CustomTextInput
          secureTextEntry
          containerStyle={{
            borderColor: redFields.includes("password") ? "red" : undefined,
          }}
          multiline={false}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
        <CustomTextInput
          secureTextEntry
          containerStyle={{
            borderColor: redFields.includes("passwordConfirm") ? "red" : undefined,
          }}
          placeholder="Verify Password"
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
        />

        <CustomTextInputV2
          containerStyle={styles.input}
          placeholder='Referral Token (optional)'
          value={referrerToken}
          onChangeText={setReferrerToken}
        />

        <CustomButton
          style={{
            marginBottom: 20,
          }}
          title="Sign Up"
          onPress={async () => {
            setRedFields([])
            setErrorMsg("")
            setSuccessMsg("")

            let errorMsg
            try {
              let type = "user"

              errorMsg = invalidate()
              if (errorMsg) throw new Error(errorMsg)

              const user = new User()
              await user.create({
                first,
                last,
                email,
                password,
                type,
              })


              await user.addToWaitlist(email, referrerToken)

              setSuccessMsg("You've been signed up!")

              // Navigate
              const pushAction = StackActions.push("Boot")
              navigation.dispatch(pushAction)
            } catch (err) {
              // If not native (form) error, check for auth error
              if (!errorMsg) {
                let [errorMsg, redFields] = handleAuthError(err)
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

      </KeyboardAwareScrollView>
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
  input: {
    marginVertical: 10,
  },
  GoBackButton: {
    ...config.styles.GoBackButton_screenDefault,
  },
})