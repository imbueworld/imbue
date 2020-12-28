import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableHighlight, View, Platform } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AppBackground from "../components/AppBackground"
import CompanyLogo from "../components/CompanyLogo"
import CustomCapsule from "../components/CustomCapsule"
import { useNavigation } from '@react-navigation/native'
import BackButton from '../components/BackButton'
import auth from '@react-native-firebase/auth'
import { FONTS } from '../contexts/Styles'
import { colors, simpleShadow } from '../contexts/Colors'
import ForwardButton from '../components/ForwardButton'

export default function PartnerApply(props) {
  const navigation = useNavigation()


  // const { state, navigate } = this.props.navigation; 

  return (
    <SafeAreaView style={{ flex: 0, backgroundColor: colors.bg, paddingTop: Platform.OS === 'android' ? 25 : 0 }}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
      >
        <AppBackground />
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
              simpleShadow,
            }}
          />
        </TouchableHighlight>
        <CustomCapsule containerStyle={styles.container}>
                  <View>
          <Text
            style={styles.title}
          >
            Influencer application            
            </Text>
        </View>




          <View>
            <Text
              style={styles.body}
            >
              Thank you so much for your interest in imbue. We’re going to ask a few questions to make sure you’ll be a good fit! Click the button to get started!
            </Text>
          </View>


        </CustomCapsule>
        <View
        style={{
          marginTop: 150,
        }}>

        </View>
        <TouchableHighlight
          style={styles.forwardButtonContainer}
          underlayColor="#eed"
          onPress={(() => navigation.navigate('PartnerApply2'))}
        >
          <ForwardButton
            imageStyle={{
              width: 47,
              height: 47,
              simpleShadow,
            }}
          />
        </TouchableHighlight>
      </KeyboardAwareScrollView>

    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
    backgroundColor: "#F9F9F9",
  },
  container: {
    width: "88%",
    marginBottom: 30,
    alignSelf: "center",
    backgroundColor: "#ffffff",
    marginTop: 10
  },
  sidePanelButtonContainer: {
    backgroundColor: "white",
    marginTop: 0,
    marginLeft: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
    zIndex: 110,
  },
  forwardButtonContainer: {
    marginBottom: 30,
    alignSelf: "flex-end",
    marginEnd: 25,
    backgroundColor: "#ffffff",
    marginTop: 5
  },
  title: {
    // marginTop: 15,
    marginBottom: 10,
    alignSelf: "center",
    ...FONTS.title,
    fontSize: 16,
  },
  body: {
    alignSelf: 'center',
    ...FONTS.body,
    fontSize: 12,
  },
  text: {
    ...FONTS.body,
    color: colors.accent,
  },
})