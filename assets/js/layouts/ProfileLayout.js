import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableHighlight } from 'react-native'

import CustomCapsule from "../components/CustomCapsule"
import UserIcon from '../components/UserIcon'
import { simpleShadow } from '../contexts/Colors'
import BackButton from '../components/BackButton'
import { useNavigation } from '@react-navigation/native'
import { publicStorage } from '../backend/HelperFunctions'
import { fonts } from '../contexts/Styles'
import LogOutButton from '../components/buttons/LogOutButton'
import auth from "@react-native-firebase/auth"
import AppBackground from '../components/AppBackground'



/**
 * props
 * .data -- has to have { name, iconUri }
 */
export default function ProfileLayout(props) {
  let user = props.data
  let navigation = useNavigation()

  const [buttonOptions, setButtonOptions] = useState(null)

  useEffect(() => {
    const defaultButtonOptions = {
      goBack: {
        show: true,
      },
      logOut: {
        show: true,
        onPress: () => {
          auth().signOut()
          navigation.navigate("Boot", { referrer: "PartnerDashboard" })
        },
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



  if (!buttonOptions) return <View />

  return (
    <>

    <View style={{
      width: "100%",
      height: "100%",
      position: "absolute",
      left: 25,
      backgroundColor: "#eee",
      borderRadius: 40,
      // zIndex: -110,
    }}/>

    <ScrollView
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps="handled"
    >
      <AppBackground />

      <View style={{
        marginVertical: 50,
      }}>

        <UserIcon
          containerStyle={{
            position: "absolute",
            alignSelf: "center",
          }}
          data={{ uri: publicStorage(user.iconUri) }}
        />

        <CustomCapsule
          style={[
            {
              // marginTop: 150,
              marginTop: 115,
              width: "88%",
              alignSelf: "center",
            },
            props.containerStyle,
          ]}
          innerContainerStyle={[
            {
              // paddingTop: 135,
              paddingTop: 90,
            },
            props.innerContainerStyle,
          ]}
        >
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