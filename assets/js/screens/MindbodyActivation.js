import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import config from '../../../App.config'
import User from '../backend/storage/User'
import GoBackButton from '../components/buttons/GoBackButton'
import CompanyLogo from '../components/CompanyLogo'
import CustomButton from '../components/CustomButton'
import CustomTextInputV2 from '../components/CustomTextInputV2'
import Hyperlink from '../components/Hyperlink'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'



export default function MindbodyActivation(props) {
  const [siteId, setSiteId] = useState('')
  const [activationLink, setActivationLink] = useState('')
  const [activationCode, setActivationCode] = useState('')



  const submit = async () => {
    if (!siteId) return

    const {
      ActivationLink,
      ActivationCode,
    } = await (new User).requestMindbodyActivation({ siteId })

    setActivationLink(ActivationLink)
    setActivationCode(ActivationCode)
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ minHeight: '100%' }}
      keyboardShouldPersistTaps='handled'
    >
      <CompanyLogo />
      <GoBackButton containerStyle={styles.backButton} />

      <View style={styles.container}>

        <CustomTextInputV2
          placeholder='Your Mindbody Site ID'
          value={siteId}
          onChangeText={setSiteId}
        />
        <CustomButton
          title='Confirm'
          onPress={submit}
        />

        <Hyperlink
          textStyle={{ textAlign: 'center' }}
          href='https://support.mindbodyonline.com/s/article/Setting-up-an-API-integration?language=en_US'
        >
          Learn more about how to link your Mindbody account with Imbue
        </Hyperlink>

          {activationLink && activationCode ? <>
          <View style={styles.section}>
            <Text style={styles.text}>Your activation link:</Text>
            <Hyperlink>{ activationLink }</Hyperlink>
          </View>
          <View style={styles.section}>
            <Text style={styles.text}>Your activation code:</Text>
            <Text style={styles.codeText}>{ activationCode }</Text>
          </View>
          </> : null}

      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '6%',
  },
  text: {
    ...FONTS.body,
    color: colors.accent,
    fontSize: 16,
  },
  codeText: {
    color: colors.accent,
    fontSize: 16,
  },
  section: {
    marginTop: 20,
  },
  backButton: config.styles.GoBackButton_screenDefault,
})
