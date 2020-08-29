import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableHighlight } from 'react-native'

import CustomCapsule from "../components/CustomCapsule"
import { simpleShadow } from '../contexts/Colors'
import BackButton from '../components/BackButton'
import { useNavigation } from '@react-navigation/native'
import { fonts } from '../contexts/Styles'
import LogOutButton from '../components/buttons/LogOutButton'
import auth from "@react-native-firebase/auth"
import AppBackground from '../components/AppBackground'
import Icon from '../components/Icon'
import { retrieveUserData } from '../backend/CacheFunctions'
import { pickAndUploadFile } from '../backend/BackendFunctions'
import EditButton from '../components/buttons/EditButton'



/**
 * props
 * .data -- has to have { name, iconUri }
 */
export default function ProfileLayout(props) {
  let cache = props.cache // Is not always passed, cache reworking in need
  let navigation = useNavigation()

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
        onPress: () => {
          auth().signOut()
          navigation.navigate("Boot", { referrer: "PartnerDashboard" })
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
      backgroundColor: "#eee",
      borderRadius: 40,
    }}/>

    <ScrollView
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
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
          source={{ uri: user.iconUri || user.icon_uri }}
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
              onLongPress={() => pickAndUploadFile(cache, setErrorMsg)}
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
            onPressIn={props.onBack || (() => navigation.goBack())}
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
    </ScrollView>
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
    fontFamily: fonts.default,
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