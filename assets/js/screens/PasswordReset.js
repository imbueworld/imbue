import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import User from '../backend/storage/User'
import AppBackground from '../components/AppBackground'
import GoBackButton from '../components/buttons/GoBackButton'
import CompanyLogo from '../components/CompanyLogo'
import CustomButton from '../components/CustomButton'
import CustomTextInputV2 from '../components/CustomTextInputV2'
import FormStatusMessageV2 from '../components/FormStatusMessageV2'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'



export default function PasswordReset(props) {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [enterCodeStage, setEnterCodeStage] = useState(false)
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  

  const resetPassword = () => {
    if (!email) return
    (new User).sendPasswordResetEmail(email)
      .then(() => {
        setSuccessMessage('Password reset email has been sent.')
        // setSuccessMessage('Code has been sent to your email.')
        // setEnterCodeStage(true)
      })
      .catch(setErrorMessage)
  }

  const confirmReset = async () => {
    if (!code || !password || !passwordConfirm) return
    if (password != passwordConfirm) {
      setErrorMessage('Passwords didn\'t match.')
      return
    }
    try {
      await (new User).confirmPasswordReset(code, password)
      setSuccessMessage('Your password has been changed.')
      await new Promise(r => setTimeout(r, 500))
      navigation.navigate('Login')
    } catch(userFacingErrMessage) {
      setErrorMessage(userFacingErrMessage)
    }
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ minHeight: '100%' }}
      keyboardShouldPersistTaps='handled'
    >
      <AppBackground />
      <CompanyLogo />
      <GoBackButton containerStyle={styles.backButton} />

      <View style={styles.innerContainer}>
        <FormStatusMessageV2 error={errorMessage} success={successMessage} />

        <Text style={[styles.text, styles.title]}>Reset Your Password</Text>

        {!enterCodeStage && <>
        <CustomTextInputV2
          style={styles.field}
          placeholder='Your Email'
          value={email}
          onChangeText={setEmail}
        />
        <CustomButton
          // title='Send Code'
          title='Reset Password'
          onPress={resetPassword}
        /></>}

        {enterCodeStage && <>
        <CustomTextInputV2
          style={styles.field}
          placeholder='Code'
          value={code}
          onChangeText={setCode}
        />
        <CustomTextInputV2
          style={styles.field}
          placeholder='New Password'
          value={password}
          onChangeText={setPassword}
        />
        <CustomTextInputV2
          style={styles.field}
          placeholder='Confirm Password'
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
        />
        <CustomButton
          title='Confirm'
          onPress={confirmReset}
        /></>}
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: '6%',
  },
  text: {
    ...FONTS.title,
    color: colors.accent,
  },
  title: {
    fontSize: 25,
    alignSelf: 'center',
    marginBottom: 20,
  },
  field: {
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    marginTop: 40,
    marginLeft: 10,
  },
})