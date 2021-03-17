import React from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableHighlight, View, Platform } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import BackButton from '../components/BackButton'
import auth from '@react-native-firebase/auth'
import { FONTS } from '../contexts/Styles'
import { colors, simpleShadow } from '../contexts/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PartnerApplyBackground } from '../components/PartnerApplyBackground'

export default function PartnerApply(props) {
  const navigation = useNavigation()

  const { top, bottom } = useSafeAreaInsets()

  return (
    <PartnerApplyBackground onNextButton={() => navigation.push('PartnerStep', {step: 'name'})}>
      <Text style={styles.body}>
         {`Thank you so much for your interest in imbue.\n\n We’re going to ask a few questions to make sure you’ll be a good fit!\n\n Click the button to get started!`}
      </Text>
    </PartnerApplyBackground>
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
  },
  sidePanelButtonContainer: {
    backgroundColor: "white",
    justifyContent: "center",
    position: 'absolute'
    // alignItems: "center",
  },
  forwardButtonContainer: {
    marginBottom: 30,
    alignSelf: "flex-end",
    position: 'absolute',
    right: 25,
    backgroundColor: "#ffffff",
    marginTop: 5
  },
  title: {
    width: '60%',
    textAlign: 'center',
    marginBottom: 50,
    alignSelf: "center",
    ...FONTS.subtitle,
    fontSize: 17,
  },
  body: {
    alignSelf: 'center',
    textAlign: 'center',
    ...FONTS.body,
    fontSize: 12,
  },
  text: {
    ...FONTS.body,
    color: colors.accent,
  },
})