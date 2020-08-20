import React from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableHighlight } from 'react-native'

import AppBackground from "../components/AppBackground"
import ProfileRepr from "../components/ProfileRepr"

import CustomCapsule from "../components/CustomCapsule"
import UserIcon from '../components/UserIcon'
import { simpleShadow } from '../contexts/Colors'
import BackButton from '../components/BackButton'
import { useNavigation } from '@react-navigation/native'
import { publicStorage } from '../backend/HelperFunctions'
import { fonts } from '../contexts/Styles'



/**
 * props
 * .data -- has to have { name, iconUri }
 */
export default function ProfileLayout(props) {
  let user = props.data
  let navigation = useNavigation()

  function goBack() {
    navigation.goBack()
  }

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
          <Text
            style={styles.profileName}
            numberOfLines={1}
          >
            {user.name}
          </Text>

          {props.hideBackButton ? null :
          <TouchableHighlight
            style={styles.sidePanelButtonContainer}
            underlayColor="#eed"
            onPressIn={props.onBack || goBack}
          >
            <BackButton />
          </TouchableHighlight>}

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