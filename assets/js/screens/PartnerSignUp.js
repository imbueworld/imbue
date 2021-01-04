import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import { NetworkInfo } from 'react-native-network-info'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { colors } from "../contexts/Colors"

import AppBackground from "../components/AppBackground"
import CompanyLogo from "../components/CompanyLogo"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"
import { geocodeAddress } from '../backend/BackendFunctions'
import { handleAuthError } from '../backend/HelperFunctions'
import { FONTS } from '../contexts/Styles'
import { useNavigation } from '@react-navigation/native'

import BackButton from '../components/BackButton'
import User from '../backend/storage/User'



export default function PartnerSignUp(props) {
  const navigation = useNavigation()

  const [redFields, setRedFields] = useState([])
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const [first, setFirst] = useState("")
  const [last, setLast] = useState("")
  const [gymName, setGymName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  //
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [dob, setDob] = useState('') // in the format of `mm-dd-yyyy`
  const [ip, setIp] = useState()

  // Init
  useEffect(() => {
    const init = async () => {
      setIp(await NetworkInfo.getIPAddress())
    }; init()
  }, [])


  function invalidate() {
    let redFields = []
    if (!first) redFields.push("first")
    if (!last) redFields.push("last")
    if (!email) redFields.push("email")
    if (!gymName) redFields.push("gymName")
    if (!password) redFields.push("password")
    if (!passwordConfirm) redFields.push("passwordConfirm")
    //
    if (!phone) redFields.push('phone')
    if (!address) redFields.push('address')
    if (dob.split('-').length != 3) redFields.push('dob')

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
    <KeyboardAwareScrollView showsVerticalScrollIndicator={false} contentContaineStyle={styles.scrollView} alwaysBounceVertical={false} >
      {/* back button */}
      <TouchableHighlight
        style={styles.sidePanelButtonContainer}
        underlayColor="#eed"
        onPress={props.onBack || (() => navigation.goBack())}
      >
        <BackButton
          imageStyle={{
            width: 48,
            height: 48,
          }}
        />
      </TouchableHighlight>

      <AppBackground />
      <CompanyLogo />

      <CustomCapsule style={styles.container}>
        <Text style={{
          marginTop: 20,
          marginBottom: 20,
          ...FONTS.title,
          alignSelf: "center",
          fontSize: 25,
          color: colors.gray,
        }}>Influencer Sign Up</Text>

        {errorMsg
          ? <Text style={{ color: "red" }}>{errorMsg}</Text>
          : <Text style={{ color: "green" }}>{successMsg}</Text>}

        <View>
        {/* <SocialLogin
          containerStyle={{
            marginTop: 20,
            marginBottom: 10,
            marginHorizontal: 20,
          }}
          onAuthChange={() => {
            const pushAction = StackActions.push("Boot")
            props.navigation.dispatch(pushAction)
          }}
          onError={err => {
            // setErrorMsg(err.message)
            // setErrorMsg(`${err.code}  |  ${err.message}`)
            setErrorMsg('Something prevented the action.')
          }}
        /> */}
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
              borderColor: redFields.includes("gymName") ? "red" : undefined,
            }}
            placeholder="Gym Name"
            value={gymName}
            onChangeText={setGymName}
          />
          <CustomTextInput
            containerStyle={redFields.includes('address') ? {
              borderColor: 'red',
            } : {}}
            placeholder='Gym address'
            value={address}
            onChangeText={setAddress}
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
            containerStyle={redFields.includes('phone') ? {
              borderColor: 'red',
            } : {}}
            placeholder='Phone'
            value={phone}
            onChangeText={setPhone}
          />
          <CustomTextInput
            containerStyle={redFields.includes('dob') ? {
              borderColor: 'red',
            } : {}}
            placeholder='Date of birth (MM-DD-YYYY)'
            value={dob}
            onChangeText={setDob}
          />

          {/* Company info */}
          <CustomTextInput
            containerStyle={redFields.includes('') ? {
              borderColor: 'red',
            } : {}}
            placeholder=''
            value={addressasd}
            onChangeText={asdasd}
          />

          <CustomTextInput
            containerStyle={{
              borderColor: redFields.includes("password") ? "red" : undefined,
            }}
            multiline={false}
            secureTextEntry
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />
          <CustomTextInput
            containerStyle={{
              borderColor: redFields.includes("passwordConfirm") ? "red" : undefined,
            }}
            multiline={false}
            secureTextEntry
            placeholder="Confirm Password"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
          />

          <CustomButton
            style={{
              marginBottom: 20,
            }}
            title="Sign Up"
            onPress={async () => {
              setRedFields([])
              setErrorMsg('')
              setSuccessMsg('')

              let errorMsg
              try {
                errorMsg = invalidate()
                if (errorMsg) throw new Error(errorMsg)

                const [mm, dd, yyyy] = dob.split('-')

                geocodeAddress(address, async asdf => {
                  return // DEBUG

                  let promises = []

                  const userObj = new User()
                  promises.push(
                    userObj.create({
                      type: 'partner',
                      first,
                      last,
                      email,
                      password,
                      address,
                      country,
                      dob: {
                        day: dd,
                        month: mm,
                        year: yyyy,
                      },
                      phone,
                      ip,
                    })
                  )

                  setSuccessMsg("You've been signed up!")

                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Boot' }],
                  })
                })
              } catch (err) {
                // If not form error, check for auth error
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
        </View>

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
  sidePanelButtonContainer: {
    backgroundColor: "white",
    marginTop: 40,
    marginLeft: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    zIndex: 110,
  },
})