  import React, { useState } from 'react'
  import { StyleSheet, Text, TouchableHighlight } from 'react-native'
  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
  import AppBackground from "../components/AppBackground"
  import CompanyLogo from "../components/CompanyLogo"
  import CustomTextInput from "../components/CustomTextInput"
  import CustomButton from "../components/CustomButton"
  import CustomCapsule from "../components/CustomCapsule"

  import { initializeAccount } from "../backend/BackendFunctions"
  import { handleAuthError } from '../backend/HelperFunctions'
  import SocialLogin from '../components/SocialLogin'
  import { StackActions, useNavigation } from '@react-navigation/native'
  import BackButton from '../components/BackButton'
  import User from '../backend/storage/User'
  import functions from '@react-native-firebase/functions'

  export default function SignUp(props) {
    const navigation = useNavigation()
    const [redFields, setRedFields] = useState([])
    const [errorMsg, setErrorMsg] = useState("")
    const [successMsg, setSuccessMsg] = useState("")
    const [first, setFirst] = useState("")
    const [last, setLast] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    function invalidate() {
      let redFields = []
      if (!first) redFields.push("first")
      if (!last) redFields.push("last")
      if (!email) redFields.push("email")
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
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false} 
      >
        <AppBackground />
        {/* <Image
            style={{
                width: "100%",
                height: "100%",
                position: "absolute",
            }}
            source={require("../components/img/workout-21.jpg")}
        /> */}
        <CompanyLogo />
          
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

                // try {
                //   let listName = "member"
                //   // Add to Sendgrid
                //   const addToSendGrid = functions().httpsCallable('addToSendGrid')
                //   await addToSendGrid({email, first, last, listName})
                // } catch (err) {
                //   console.log("addToSendGrid didn't work: ", err)
                // }

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