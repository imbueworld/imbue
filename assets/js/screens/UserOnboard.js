import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View, RefreshControl, Text, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"
import CustomButton from "../components/CustomButton"
import Icon from '../components/Icon'
import CustomTextInputV2 from "../components/CustomTextInputV2"
import { TouchableHighlight } from 'react-native-gesture-handler'
import ForwardButton from '../components/ForwardButton'
import { simpleShadow, colors } from '../contexts/Colors'
import { handleAuthError } from '../backend/HelperFunctions'

import User from '../backend/storage/User'
import { FONTS } from '../contexts/Styles'
import config from '../../../App.config'
import { useNavigation } from '@react-navigation/native'
import functions from '@react-native-firebase/functions'
import firestore from '@react-native-firebase/firestore';
import { text } from 'react-native-communications'
import moment from 'moment'


export default function UserOnboard(props) {
  const [user, setUser] = useState(null)
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = React.useState(false);
  const [dob, setDob] = useState("")
  const [email, setEmail] = useState("")
  const [first, setFirst] = useState("")
  const [last, setLast] = useState("")
  const [userId, setUserId] = useState("")
  const [errorMsg, setErrorMsg] = useState('')
  const [redFields, setRedFields] = useState([])
  const [successMsg, setSuccessMsg] = useState("")
  const [updating, setUpdating] = useState(false)


  const [r, refresh] = useState(0)

  const updateDobForUser = async () => {
    setUpdating(true)
    let redFields = []

    if (dob.length != 10) redFields.push('dob')
    const DateMoment = moment(dob, 'MM-DD-YYYY')

    if (!userId) {
      return
    }

    if (redFields.length) {
      setRedFields(redFields)
      setErrorMsg("Dob needs to look like: 00-00-0000 ")
      return
    } else {
      setSuccessMsg("Success!")
    }

    console.log("userID: ", userId)

    let dobInfo = {
      day: DateMoment.date(),
      month: DateMoment.month() + 1,
      year: DateMoment.year(),
    }

    try {
      firestore()
        .collection('users')
        .doc(userId)
        .update({
          dob: dobInfo,
        })
        .then(() => {
          console.log('User added!');
      });


      // setPasswordField('')
      // Keyboard.dismiss()
    } catch (err) {
      console.log('User not added!');
      console.log('error: !', err);
      // if (config.DEBUG) console.error(err)
      // let [errorMsg, redFields] = handleAuthError(err)
      // setErrorMsg(errorMsg)
    }

    console.log("user??: ", user)


     // Adding to Member sendgrid list (assuming if no dob they are a new user)
     try {
      console.log("addToSendGrid UserOnboard")
      let listName = "member"
      // Add to Sendgrid
      const addToSendGrid = functions().httpsCallable('addToSendGrid')
      await addToSendGrid({email, first, last, listName})
    } catch (err) {
      console.log("addToSendGrid didn't work: ", err)
    }

    // then navigate to user dashboard
    navigation.navigate('SuccessScreen', {successMessageType: 'MemberSignUp'})
    setTimeout(
      () => {  navigation.navigate ('UserDashboard') },
      6000
    )
  }


  useEffect(() => {
    async function init() {


    }; init()
  }, [])

  // get user info
  useEffect(() => {
    async function init() {
      const user = new User()
      const userDoc = await user.retrieveUser()
      setUserId(user.uid)

      setEmail(userDoc.email)
      setFirst(userDoc.first)
      setLast(userDoc.last)

      console.log("email: ", userDoc.email)
      console.log("first: ", userDoc.first)
      console.log("last: ", userDoc.last)
      
    }; init()
  }, [])

  useEffect(() => {
    async function init() {
      const user = new User()
      const userDoc = await user.retrieveUser()
      setUserId(user.uid)
    }; init()
  }, [updating])

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const user = new User()
    const userDoc = await user.retrieveUser()
    
    setUser(userDoc)
    wait(2000).then(() => setRefreshing(false));

  }, []);

  // adds hyphens in text input
  const handleDOB = (text) => {
    if (text.length == 2) {
      text = text += "-"
      return text
    } else if (text.length == 5) {
      text = text += "-"
      return text
    }

    return text
  }

  if (!user === undefined) return <View />

  return (
    <>
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
        <View>
          <Text
            style={styles.profileName}
          >
            {/* {user.name} */}
        </Text>
        </View>
        <View>
          <Text
            style={styles.miniText}
          >
            Welcome to imbue! One last thing before you sign in, we need you to input your Date of Birth!
        </Text>
        </View>

        {errorMsg
        ? <Text style={{ color: "red" }}>{errorMsg}</Text>
        : <Text style={{ color: "green" }}>{successMsg}</Text>}

        <CustomTextInputV2
          containerStyle={styles.inputField}
          keyboardType='numeric'
          value={dob}
          maxLength={10}
          placeholder='Date of Birth (MM-DD-YYYY)'
          onChangeText={(text) => 
              setDob(handleDOB(text))
          }
        />

        <View>
          <CustomButton
          title='Finish Setup'
          onPress={updateDobForUser}
          />
        </View>


      </ProfileLayout>
    </>
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
  profileName: {
    marginTop: 15,
    marginBottom: 10,
    alignSelf: "center",
    ...FONTS.luloClean,
    fontSize: 16,
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
  forwardButtonContainer: {
    marginBottom: 30,
    alignSelf: "flex-end",
    marginEnd: 5,
    backgroundColor: "#ffffff",
    marginTop: 25,
  },
})
