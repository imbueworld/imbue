import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import CheckBox from '@react-native-community/checkbox';

import ProfileLayout from "../layouts/ProfileLayout"

import { FONTS } from '../contexts/Styles'
import { useNavigation } from '@react-navigation/native'
import { handleAuthError } from '../backend/HelperFunctions'
import User from '../backend/storage/User'
import config from '../../../App.config'
const p = console.log


export default function PreLiveChecklist(props) {


  useEffect(() => {
    const init = async () => {
      const user = new User()
      const userDoc = await user.retrieveUser()
    }; init()
  }, [])


  // if (!user) return <View />

  return (
    <ProfileLayout
      innerContainerStyle={{
        paddingBottom: 10,
      }}
      buttonOptions={{
        editPfp: {
          show: false,
        },
      }}
    >
      <View>
      <Text>

      </Text>
      </View>
      <CheckBox
      text='Hello'
      onCheckColor='#f9f9f9'
      onFillColor='#242429'
      onTintColor='#242429'
      tintColor='#242429'
      />

    </ProfileLayout>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 20,
    marginHorizontal: 5,
    borderRadius: 35
  },
  buttonText: {
    fontSize: 14,
  },
  inputField: {
    marginTop: 10,
    marginBottom: 10,
  },
  text: {
    paddingVertical: 8,
    alignSelf: "center",
    fontSize: 22,
  },
  textContainer: {
    marginVertical: 10,
  },
  miniText: {
    // ...config.styles.body,
    ...FONTS.body,
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
})