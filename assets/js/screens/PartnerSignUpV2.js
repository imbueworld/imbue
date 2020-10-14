import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useForm } from 'react-hook-form'
import moment from 'moment'
import { FONTS } from '../contexts/Styles'
import { colors } from '../contexts/Colors'
import { NetworkInfo } from 'react-native-network-info'
import { geocodeAddress } from '../backend/BackendFunctions'
import config from '../../../App.config'
import functions from '@react-native-firebase/functions'
import { useNavigation } from '@react-navigation/native'
import User from '../backend/storage/User'
import Gym from '../backend/storage/Gym'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AppBackground from '../components/AppBackground'
import CompanyLogo from '../components/CompanyLogo'
import GoBackButton from '../components/buttons/GoBackButton'
import CustomTextInputV2 from '../components/CustomTextInputV2'
import CustomButton from '../components/CustomButton'
import FormStatusMessage from '../components/FormStatusMessage'



export default function PartnerSignUpV2(props) {
  const navigation = useNavigation()
  const { register, handleSubmit, setValue, errors, watch } = useForm()
  const [local, _resetLocal] = useState({})
  local.passwordText = watch('password', '')
  const [ip, setIp] = useState(ip)
  const [submitError, setSubmitError] = useState('')
  console.log("submitError", submitError)

  useEffect(() => {
    const rules = {
      required: 'Required fields must be filled.',
    }

    // General
    register('password', {
      ...rules,
      pattern: {
        value: /(?=.*[a-z])(?=.*[A-Z]).{8}/,
        message:
          'Password must consist of at least 8 characters, '
          + 'and at least 1 lowercase and uppercase letter.',
      },
    })
    register('confirm_password', {
      ...rules,
      // validate: text =>
      //   text == passwordText
      //   || 'Passwords must match.',
      // DEBUG
      validate: text => {
        console.log("[validate] passwordText", local.passwordText)
        return text == local.passwordText || 'Passwords must match.'
      },
    })

    // Company details
    register('company_address', rules)
    register('company_name', rules)
    register('gym_description', rules)
    register('tax_id', rules)
    
    // Personal details
    register('first', {
      ...rules,
      pattern: {
        value: /[A-Za-z]{2,100}/,
        message: 'Name should consist of only letters, and at least two.'
      },
    })
    register('last', {
      ...rules,
      pattern: {
        value: /[A-Za-z]{2,100}/,
        message: 'Name should consist of only letters, and at least two.'
      },
    })
    register('email', rules)
    register('phone', {
      ...rules,
      validate: text =>
        text.replaceAll(/[^0-9]/g, '').length == 10
        || 'Number should consist of 10 digits.',
      // DEBUG
      // validate: text => {
      //   console.log("text", text)
      //   let number = text.replaceAll(/[^0-9]/g, '')
      //   console.log("number", number)
      //   if (number.length != 10) return 'Number should consist of 10 digits.'
      //   return true
      // },
    })
    register('dob', {
      ...rules,
      validate: {
        format: text =>
          text.split('-').length == 3
          || 'Date of birth should be of correct format.',
        values: text => {
          const [m, d, y] = text.split('-')
          const currentDate = new Date()

          if (currentDate.getUTCFullYear() - y < 18)
            return 'User must be of age from 18 to 120.'
          if (currentDate.getUTCFullYear() - y > 119)
            return 'User must be of age from 18 to 120.'
          
          return true
        },
        date: text =>
          moment(text, 'MM-DD-YYYY').isValid()
          || 'Invalid date.',
        // DEBUG
        // date: text => {
        //   console.log(moment(text, 'MM-DD-YYYY').format('MM DD YYYY'))
        //   return (
        //     moment(text, 'MM-DD-YYYY').isValid()
        //     || 'Invalid date.'
        //   )
        // },
      },
    })
    register('address', rules)
    register('ssn_last_4', {
      ...rules,
      validate: {
        length: text =>
          text.length == 4
          || 'SSN last 4 should consist of 4 digits.',
        content: text =>
          !text
            .split('')
            .map(char => isNaN(char))
            .includes(true)
          || 'SSN last 4 should only consist of numbers.'
      },
    })
  }, [register])
  console.log("errors", errors) // D
  console.log("errors", errors.phone) // D

  useEffect(() => {
    // Temporary confirmation details
    NetworkInfo.getIPAddress().then(setIp)
  }, [])

  // DEBUG stuff
  useEffect(() => {
    if (!config.DEBUG) return

    setValue('company_address', '1111 S Figueroa St, Los Angeles, CA 90015')
    setValue('company_name', 'CompanyName')
    setValue('gym_description', 'This is the product description.')
    setValue('tax_id', '000000000')

    setValue('first', 'First')
    setValue('last', 'Last')
    setValue('email', '123@gmail.com')
    setValue('phone', '888 867 5309')
    setValue('dob', '7-6-1998')
    setValue('address', '1111 S Figueroa St, Los Angeles, CA 90015')
    setValue('ssn_last_4', '0000')

    setValue('password', '123@gmail.comA')
    setValue('confirm_password', '123@gmail.comA')
  }, [])



  const onSubmit = async form => {
    // At this point the form has been validated, as far as individual fields go.
    // Certain data still needs to be gotten, based on form data...

    setSubmitError('')
    const p = console.log

    // Separate between core user data and other type of data,
    // and data that is to be adjusted/formatted in a sec
    let {
      company_address: companyAddressText,
      address: individualAddressText,
      dob: dobText,
      phone: phoneText,
      //
      password,
      confirm_password,
      gym_description,
      ...USER
    } = form

    // Create user
    const partner = new User()
    let errMsg = await partner.create({
      ...USER,
      password,
      type: 'partner',
    })

    if (errMsg) {
      setSubmitError(errMsg)
      return
    }



    // Do data formatting/adjustment

    const {
      address: company_address,
      formatted_address: company_formatted_address,
    } = await geocodeAddress(companyAddressText) || {}
    if (config.DEBUG) p("company_address", company_address)
    // Do not continue, if provided address is invalid.
    if (!company_address) {
      await partner.delete()
      setSubmitError('Provided company address was not specific enough.')
      return
    }

    const {
      address,
      formatted_address,
      location,
    } = await geocodeAddress(individualAddressText) || {}
    if (config.DEBUG) p("address", address)
    // Do not continue, if provided address is invalid.
    if (!address) {
      await partner.delete()
      setSubmitError('Provided individual\'s address was not specific enough.')
      return
    }

    const [m, d, y] = dobText.split('-')
    const dob = { day: parseInt(d), month: parseInt(m), year: parseInt(y) }
    const phone = phoneText.replaceAll(/[^0-9]/g, '')

    Object.assign(USER, {
      // Override with adjusted/formatted values
      company_address,
      address,
      formatted_address,
      dob,
      phone,
    })



    try {
      // Attempt to create a Stripe account
      const createStripeSeller = functions().httpsCallable('createStripeSeller')
      await createStripeSeller({
        ...USER,
        product_description: gym_description,
        ip, // for TOS agreement
      })

      // Add the adjusted/formatted items to user's doc in database
      partner.mergeItems({
        company_address,
        address,
        formatted_address,
        dob,
        phone,
      })
      await partner.push()
    } catch(err) {
      if (config.DEBUG) console.warn(err)
      await partner.delete()
      return
    }

    // Create gym
    const gym = new Gym()
    await gym.create({
      address: company_address,
      formatted_address: company_formatted_address,
      name: form.company_name,
      description: gym_description,
      coordinate: location,
      partner_id: partner.uid,
    })

    // Redirect
    navigation.reset({
      index: 0,
      routes: [{ name: 'Boot' }],
    })
  }



  return (
    <KeyboardAwareScrollView>
      <AppBackground />
      <CompanyLogo />

      <GoBackButton />

      <Text style={styles.sectionTitle}>Partner Sign Up</Text>

      <FormStatusMessage type='error' containerStyle={{
        alignSelf: 'center',
        marginBottom: 10,
      }}>
        { errors && (errors[Object.keys(errors)[ 0 ]] || {}).message }
      </FormStatusMessage>

      <View>
        {/* Company details */}
        <CustomTextInputV2
          containerStyle={styles.inputField}
          placeholder='Company Address'
          onChangeText={text => setValue('company_address', text)}
        />
        <CustomTextInputV2
          containerStyle={styles.inputField}
          placeholder='Company Name'
          onChangeText={text => setValue('company_name', text)}
        />
        <CustomTextInputV2
          containerStyle={styles.inputField}
          placeholder='Gym Description'
          onChangeText={text => setValue('gym_description', text)}
        />
        <CustomTextInputV2
          containerStyle={styles.inputField}
          placeholder='Tax ID'
          onChangeText={text => setValue('tax_id', text)}
        />

        {/* Personal details */}
        <CustomTextInputV2
          containerStyle={styles.inputField}
          isRed={errors.first ? true : false}
          placeholder='First Name'
          onChangeText={text => setValue('first', text)}
        />
        <CustomTextInputV2
          containerStyle={styles.inputField}
          placeholder='Last Name'
          onChangeText={text => setValue('last', text)}
        />
        <CustomTextInputV2
          containerStyle={styles.inputField}
          placeholder='Email'
          onChangeText={text => setValue('email', text)}
        />
        <CustomTextInputV2
          containerStyle={styles.inputField}
          placeholder='Phone'
          onChangeText={text => setValue('phone', text)}
        />
        <CustomTextInputV2
          containerStyle={styles.inputField}
          placeholder='Date of Birth (MM-DD-YYYY)'
          onChangeText={text => setValue('dob', text)}
        />
        <CustomTextInputV2
          containerStyle={styles.inputField}
          placeholder='Address'
          onChangeText={text => setValue('address', text)}
        />
        <CustomTextInputV2
          containerStyle={styles.inputField}
          placeholder='SSN Last 4'
          onChangeText={text => setValue('ssn_last_4', text)}
        />

        {/* Password */}
        <CustomTextInputV2
          containerStyle={styles.inputField}
          placeholder='Password'
          secureTextEntry
          onChangeText={text => setValue('password', text)}
        />
        <CustomTextInputV2
          containerStyle={styles.inputField}
          placeholder='Confirm Password'
          secureTextEntry
          onChangeText={text => setValue('confirm_password', text)}
        />

        {/* ==== */}
        <CustomButton
          style={styles.signUpButton}
          title='Sign Up'
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 20,
    marginBottom: 20,
    ...FONTS.title,
    alignSelf: 'center',
    fontSize: 25,
    color: colors.gray,
  },
  inputField: {
    marginBottom: 20,
  },
  signUpButton: {
    marginBottom: 20,
  },
})