import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableHighlight } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import CustomCapsule from "../components/CustomCapsule"
import { simpleShadow } from '../contexts/Colors'
import BackButton from '../components/BackButton'
import { StackActions, useNavigation } from '@react-navigation/native'
import { fonts, FONTS } from '../contexts/Styles'
import LogOutButton from '../components/buttons/LogOutButton'
import auth from "@react-native-firebase/auth"
import AppBackground from '../components/AppBackground'
import Icon from '../components/Icon'
import { retrieveUserData } from '../backend/CacheFunctions'
import { pickAndUploadFile } from '../backend/BackendFunctions'
import EditButton from '../components/buttons/EditButton'
import { GoogleSignin } from '@react-native-community/google-signin'
import { LoginManager } from 'react-native-fbsdk'



/**
 * props
 * .data -- has to have { name, iconUri }
 */
export default function ProfileLayout(props) {
  let cache = props.cache // Is not always passed, cache reworking in need
  const navigation = useNavigation()

  const [errorMsg, setErrorMsg] = useState("")

  const [user, setUser] = useState(props.data) // Default to provided data

  const [buttonOptions, setButtonOptions] = useState(null)

  useEffect(() => {
    const init = async () => {
      if (cache) { // cache optional
        let user = await retrieveUserData(cache)
        setUser(user)
      }
    }
    init()
  }, [])

  useEffect(() => {
    const defaultButtonOptions = {
      goBack: {
        show: true,
      },
      logOut: {
        show: false,
        onLongPress: () => {
          auth().signOut()
          GoogleSignin.signOut()
          LoginManager.logOut()
          const pushAction = StackActions.push("Boot")
          navigation.dispatch(pushAction)
        },
      },
      editPfp: { // Requires props.cache currently to function
        show: false,
      },
    }
  
    if (props.buttonOptions) {
      Object.entries(props.buttonOptions).forEach(([button, instructions]) => {
        Object.entries(instructions).forEach(([key, value]) => {
          defaultButtonOptions[ button ][ key ] = value
        })
      })
    }
    setButtonOptions(defaultButtonOptions)
  }, [])



  if (!user || !buttonOptions) return <View />

  return (
    <>
    <View style={{
      width: "100%",
      height: "100%",
      position: "absolute",
      left: 25,
      backgroundColor: "#F9F9F9",
      borderRadius: 40,
    }}/>

    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false} 
    >
      <AppBackground />

      <View style={{
        marginVertical: 50,
      }}>
        <Icon
          containerStyle={{
            width: 200,
            height: 200,
            position: "absolute",
            alignSelf: "center",
            borderRadius: 999,
            overflow: "hidden",
            ...simpleShadow,
            zIndex: 100,
          }}
          source={{ uri: user.iconUri || user.icon_uri_full }}
        />
        <View style={{
          width: 200,
          height: 200,
          position: "absolute",
          alignSelf: "center",
          alignItems: "center",
          ...simpleShadow,
          zIndex: 110,
        }}>
          {buttonOptions.editPfp.show
          ? <EditButton
              containerStyle={{
                top: 145,
                left: 65,
              }}
              onPress={() => pickAndUploadFile(cache, setErrorMsg)}
              // [uncomment upon DEBUG start]
              // onLongPress={() => pickAndUploadFile(cache, setErrorMsg)}
              // [comment upon DEBUG end]
            />
          : null}
        </View>

        <CustomCapsule
          style={[
            {
              marginTop: 115,
              width: "88%",
              alignSelf: "center",
            },
            props.containerStyle,
          ]}
          innerContainerStyle={[
            {
              paddingTop: 90,
            },
            props.innerContainerStyle,
          ]} 
        >
          {errorMsg && errorMsg.length
          ? <Text style={{ color: "red" }}>{ errorMsg }</Text>
          : null}

          {!buttonOptions.goBack.show || props.hideBackButton ? null :
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
          </TouchableHighlight>}

          {buttonOptions.logOut.show ?
          <LogOutButton
            containerStyle={{
              position: "absolute",
              top: 10,
              right: 10,
            }}
            onPress={buttonOptions.logOut.onPress}
            onLongPress={buttonOptions.logOut.onLongPress}
          /> : null}

          <Text
            style={styles.profileName}
            numberOfLines={1}
          >
            {user.name}
          </Text>

          {props.children}

        </CustomCapsule>

      </View>
    </KeyboardAwareScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
  },
  profileName: {
    // marginTop: 15,
    marginBottom: 10,
    alignSelf: "center",
    fontSize: 22,
    // fontFamily: fonts.default,
    ...FONTS.title,
  },
  sidePanelButtonContainer: {
    ...simpleShadow,
    backgroundColor: "white",
    marginTop: 10,
    marginLeft: 10,
    position: "absolute",
    justifyContent: "center", 
    alignItems: "center",
    borderRadius: 999,
    zIndex: 110,
  },
})