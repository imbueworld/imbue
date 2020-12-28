import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View, RefreshControl, Text, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"
import CustomButton from "../components/CustomButton"
import Icon from '../components/Icon'
import CustomTextInputV2 from "../components/CustomTextInputV2"
import { TouchableHighlight } from 'react-native-gesture-handler'
import ForwardButton from '../components/ForwardButton'
import { simpleShadow, colors } from '../contexts/Colors'

import User from '../backend/storage/User'
import { FONTS } from '../contexts/Styles'
import config from '../../../App.config'
import { useNavigation } from '@react-navigation/native'
import functions from '@react-native-firebase/functions'
import firestore from '@react-native-firebase/firestore';



export default function UserOnboard(props) {
  const [user, setUser] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = React.useState(false);
  const [dob, setDob] = useState("")

  const [r, refresh] = useState(0)

  const updateSafeInfoForUser = async () => {
    setErrorMsg('')
    setSuccessMsg('')

    let redFields = []

    // let {
    //   dob,
    // } = reactNativeForm

    if (firstNameField.length === 0) redFields.push("first")
    if (lastNameField.length === 0) redFields.push("last")
    if (emailField.length === 0) redFields.push("email")
    // if (passwordField.length === 0 && !isForeignUser) redFields.push("main_password")
    if (dob.split('-').length != 3) redFields.push('dob')



    const DateMoment = moment(dob, 'MM-DD-YYYY')

    try {
      // if (!isForeignUser) await auth().signInWithEmailAndPassword(user.email, passwordField)
      let updatables = {
        dob: {
          day: DateMoment.date(),
          month: DateMoment.month() + 1,
          year: DateMoment.year(),
        },
      }

      if (firstNameField !== user.first) {
        updatables.first = firstNameField
        updatables.name = `${firstNameField} ${user.last}` // Upadting the helper property
      }
      if (lastNameField !== user.last) {
        updatables.last = lastNameField
        updatables.name = `${user.first} ${lastNameField}` // Upadting the helper property
      }
      if (emailField !== user.email) {
        updatables.email = emailField
        await auth().currentUser.updateEmail(emailField)
      }

      // Return if no fields to update.
      if (!Object.keys(updatables).length) {
        setSuccessMsg('All information is up to date.')
        return
      }

      if (config.DEBUG) p('updatables', updatables)

      const userObj = new User()
      await userObj.init()
      userObj.mergeItems(updatables)
      await userObj.push()

      setSuccessMsg('Successfully updated profile information.')
      // setPasswordField('')
      Keyboard.dismiss()
    } catch (err) {
      if (config.DEBUG) console.error(err)
      let [errorMsg, redFields] = handleAuthError(err)
      setErrorMsg(errorMsg)
    }
    navigation.navigate('UserDashboard')
  }


  useEffect(() => {
    async function init() {
      const user = new User()
      const userDoc = await user.retrieveUser()

    }; init()
  }, [r])

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

        <CustomTextInputV2
            containerStyle={styles.inputField}
            // red={redFields.includes('dob')}
            // keyboardType='numeric'
            placeholder='Date of Birth (MM-DD-YYYY)'
            value={dob}
            // onChangeText={(text) => console.log("text: ", text)}
            onChangeText={setDob}
          />

        <View>
          <CustomButton
          title='Finish Creating Your Account'
          onPress={updateSafeInfoForUser}
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
