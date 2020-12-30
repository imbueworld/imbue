import React, { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View, TouchableHighlight, Platform, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useRoute } from '@react-navigation/native';

import { useNavigation } from '@react-navigation/native'
import { FONTS } from '../contexts/Styles'

import CustomCapsule from "../components/CustomCapsule"
import { colors, simpleShadow } from '../contexts/Colors'
import BackButton from '../components/BackButton'
import LogOutButton from '../components/buttons/LogOutButton'
import AppBackground from '../components/AppBackground'
import Icon from '../components/Icon'
import EditButton from '../components/buttons/EditButton'
import { useFocusEffect } from '@react-navigation/native';
import QuestionMark from '../components/img/svg/question-mark.svg';
import SvgUri from 'react-native-svg-uri';


import auth from "@react-native-firebase/auth"
import { GoogleSignin } from '@react-native-community/google-signin'
import { LoginManager } from 'react-native-fbsdk'
import User from '../backend/storage/User'
import config from '../../../App.config'



export default function ProfileLayout(props) {
  const navigation = useNavigation()

  const [errorMsg, setErrorMsg] = useState('')
  const [user, setUser] = useState()
  const [buttonOptions, setButtonOptions] = useState(null)
  const [r, refresh] = useState(0)
  const [route, setRoute] = useState()

  const thisRoute = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const init = async () => {
        const user = new User()
        setUser(await user.retrieveUser())
      }; init()
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  useEffect(() => {
    const init = async () => {
      const user = new User()
      setUser(await user.retrieveUser())


      setRoute(thisRoute.name)
      console.log('route: ', route)
    }; init()
  }, [])

  useEffect(() => {
    const defaultButtonOptions = {
      goBack: {
        show: true,
      },
      logOut: {
        show: false,
        onPress: async () => {
          await Promise.all([
            auth().signOut(),
            GoogleSignin.signOut(),
            LoginManager.logOut(),
          ])
          navigation.reset({
            index: 0,
            routes: [{ name: 'Boot' }],
          })

        },
        // [v DEBUG ONLY v]
        onLongPress: config.DEBUG ? async () => {
          await Promise.all([
            auth().signOut(),
            GoogleSignin.signOut(),
            LoginManager.logOut(),
          ])
          navigation.reset({
            index: 0,
            routes: [{ name: 'Boot' }],
          })
        } : null,
        // [^ DEBUG ONLY ^]
      },
      editPfp: {
        show: false,
      },
    }

    if (props.buttonOptions) {
      Object.entries(props.buttonOptions).forEach(([button, instructions]) => {
        Object.entries(instructions).forEach(([key, value]) => {
          defaultButtonOptions[button][key] = value
        })
      })
    }
    setButtonOptions(defaultButtonOptions)
  }, [])



  const editPfp = async () => {
    setErrorMsg('')
    const user = new User()
    try {
      await user.changeIcon()
      refresh(r => r + 1)
    } catch (errorMsg) { setErrorMsg(errorMsg) }
  }



  if (!user || !buttonOptions) return <View />

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: colors.bg, paddingTop: Platform.OS === 'android' ? 25 : 0 }}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps='handled'
        >
          <AppBackground />


          {/* <View style={{flex: 1, flexDirection: 'row'}}> */}
            {!buttonOptions.goBack.show || props.hideBackButton ? null :
              <TouchableHighlight
                style={styles.sidePanelButtonContainer}
                // underlayColor="#eed"
                onPress={props.onBack || (() => navigation.goBack())}
              >
                <BackButton
                  imageStyle={{
                    width: 47,
                    height: 47,
                  }}
                /> 
            </TouchableHighlight>}
          {/* </View> */}

            {/* Help and logout buttons */}
            <View style={{flex: 1, position: "absolute", right: 0, flexDirection: 'row-reverse', paddingRight: 10, marginTop: 10, marginRight: 10, zIndex: 2 }}>

                {buttonOptions.logOut.show ?
                  <LogOutButton
                    containerStyle={{
                      position: "absolute",
                      top: 0,
                      right: 0,
  
                    }}
                    onPress={buttonOptions.logOut.onPress}
                    onLongPress={buttonOptions.logOut.onLongPress}
                  /> : null}

                <TouchableOpacity
                    onPress={() => navigation.navigate('help')}
                    containerStyle={{
                      alignSelf: "center",
                      width: 30,
                      height: 30,
                      marginLeft: 10,
                    }}
                  >
                    <Icon
                      containerStyle={{
                      width: 30,
                      height: 30,
                      position: "absolute",
                      top: 10,
                      right: 0

                      }}
                      source={require("../components/img/png/question-mark.png")}
                    />
                </TouchableOpacity>              
            </View>

          <View style={{ marginTop: 20
          }}>
            <Icon
              containerStyle={{
                width: 180,
                height: 180,
                position: "absolute",
                alignSelf: "center",
                borderRadius: 999,
                overflow: "hidden",
                ...simpleShadow,
                zIndex: 100,
              }}
              source={{ uri: user.icon_uri_full }}
            />
            <View style={{
              width: 180,
              height: 180,
              position: "absolute",
              alignSelf: "center",
              alignItems: "center",
              ...simpleShadow,
              zIndex: 110,
            }}>
              {buttonOptions.editPfp.show
                ? <EditButton
                  containerStyle={{
                    top: 135,
                    left: 65,
                  }}
                  onPress={editPfp}
                  // [v DEBUG ONLY v]
                  onLongPress={config.DEBUG ? editPfp : undefined}
                // [^ DEBUG ONLY ^]
                />
                : null}

            </View>

            <CustomCapsule
              style={[
                {
                  marginTop: 100,
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
                ? <Text style={{ color: "red" }}>{errorMsg}</Text>
                : null}


              {route === 'PartnerDashboard' ?
                <>

                  <Text
                    style={styles.profileName}
                    numberOfLines={1}
                  >
                    {user.name}
                  </Text>
                </>
                : null
              }

              {props.children}



            </CustomCapsule>

          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
    backgroundColor: "#F9F9F9"
  },
  profileName: {
    marginTop: 15,
    marginBottom: 10,
    alignSelf: "center",
    ...FONTS.luloClean,
    fontSize: 16,
  },
  sidePanelButtonContainer: {
    // ...simpleShadow,
    backgroundColor: "white",
    marginTop: 10,
    marginLeft: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    zIndex: 110,
  },
  leftSidePanelButtonContainer: {
    ...simpleShadow,
    backgroundColor: "white",
    marginTop: 10,
    marginRight: 10,
    position: "absolute",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 999,
    zIndex: 110,
  },
})