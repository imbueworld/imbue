import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Keyboard } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"

import auth from "@react-native-firebase/auth"
import { FONTS } from '../contexts/Styles'
import moment from 'moment'
import { useNavigation } from '@react-navigation/native'
import { handleAuthError } from '../backend/HelperFunctions'
import User from '../backend/storage/User'
import CustomTextInputV2 from '../components/CustomTextInputV2'
import config from '../../../App.config'
import { useForm } from 'react-hook-form'
import { geocodeAddress } from '../backend/BackendFunctions'
import Gym from '../backend/storage/Gym'
import PlaidButton from '../components/PlaidButton'
import BankAccountFormWithButtonEntry from '../components/BankAccountFormWithButtonEntry'
import functions from '@react-native-firebase/functions'
import firestore from '@react-native-firebase/firestore';
const p = console.log



export default function ProfileSettings(props) {
  const [user, setUser] = useState(null)
  const [isForeignUser, setIsForeignUser] = useState()
  const navigation = useNavigation()
  const [hasBankAccountAdded, setHasBankAccountAdded] = useState()
  const [gym, setGym] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [refreshing, setRefreshing] = React.useState(false);
  const [r, refresh] = useState(0)


  // p(auth().currentUser)

  useEffect(() => {
    const init = async () => {
      const user = new User()
      const userDoc = await user.retrieveUser()
      setUser(userDoc)
      setIsForeignUser(userDoc.icon_uri_foreign ? true : false)
      const gym = (
        await user.retrievePartnerGyms()
      ).map(it => it.getAll())[0]
      setUser(userDoc)
      setGym(gym)

      console.log("user (useEffect): ", user)

    }; init()
  }, [r])

  useEffect(() => {
    if (!user) return
    setEmailField(user.email)
    let { day, month, year } = user.dob || {}
    let dobString = user.dob ? `${month}-${day}-${year}` : ''
    setDob(dobString)
    //
    //
    setAddress(user.formatted_address)
    setPhone(user.phone)
    setSSNLast4(user.ssn_last_4)
    // setCompanyAddress(user.formatted_company_address)
    // setCompanyName(user.company_name)
    // setTaxId(user.tax_id)
  }, [user])

  const [redFields, setRedFields] = useState([])

  const [successMsg, setSuccessMsg] = useState("")
  const [changing, change] = useState("safeInfo") // || "password"

  const [emailField, setEmailField] = useState("")

  const [dob, setDob] = useState("")
  const { register, handleSubmit, setValue, errors } = useForm()

  useEffect(() => {
    const rules = {
      required: 'Required fields must be filled.',
    }

    // register('company_address', rules)
    // register('company_name', rules)
    // register('tax_id', rules)
    register('phone', {
      ...rules,
      validate: text =>
        text.replaceAll(/[^0-9]/g, '').length == 10
        || 'Number should consist of 10 digits.',
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
          || 'Date of Birth is invalid.',
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
    // register('password', rules)
  }, [register])

  // Personal type of data, for partner accounts
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [ssn_last_4, setSSNLast4] = useState('')


  useEffect(() => {
    let redFields = []
    for (let tag of Object.keys(errors)) {
      redFields.push(tag)
    }
    setRedFields(redFields)
  }, [errors])

  // DEBUG stuff
  useEffect(() => {
    if (!config.DEBUG) return

    // setValue('company_address', '1111 S Figueroa St, Los Angeles, CA 90015')
    // setValue('company_name', 'CompanyName')
    // setValue('tax_id', '000000000')
    setValue('phone', '888 867 5309')
    setValue('dob', '7-6-1998')
    setValue('address', '1111 S Figueroa St, Los Angeles, CA 90015')
    setValue('ssn_last_4', '0000')

    // setValue('password', 'asdfg')
  }, [])

  const updateSafeInfoForPartner = async () => {

    const gym = new Gym
    await gym.retrievePartnerGym() // Loads (or instantly accesses cached) data, finishes instantiation
    setRedFields([])
    setErrorMsg("")
    setSuccessMsg("")


    let redFields = []
    const auditField = (field, tag) => !field.length ? redFields.push(tag) : null

    //
    if (dob.split('-').length != 3) redFields.push('dob')
    auditField(address, 'address')
    auditField(phone, 'phone')
    auditField(ssn_last_4, 'ssn_last_4')

    if (redFields.length) {
      setRedFields(redFields)
      setErrorMsg("Required fields need to be filled.")
      return
    }

    const DateMoment = moment(dob, 'MM-DD-YYYY')

    try {
      // if (!isForeignUser) await auth().signInWithEmailAndPassword(user.email, passwordField)
      let updatables = {
        dob: {
          day: DateMoment.date(),
          month: DateMoment.month() + 1,
          year: DateMoment.year(),
        },
      }

      // pf -- "prefetch", passed in .updateStripeAccount()
      // let pfGeocodeAddress, pfGeocodeCompanyAddress
      let pfGeocodeAddress
      if (address) pfGeocodeAddress = await geocodeAddress(address)
      if (pfGeocodeAddress) {
        const {
          address,
          formatted_address,
        } = pfGeocodeAddress


        updatables.address = address
        updatables.formatted_address = formatted_address
      }
      if (emailField !== user.email || emailField == user.email) {
        updatables.email = emailField
        await auth().currentUser.updateEmail(emailField)
      }
  

      if (phone) updatables.phone = phone.replaceAll(/[^0-9]/g, '')
      // if (company_name) updatables.company_name = company_name
      // if (tax_id) updatables.tax_id = tax_id
      if (ssn_last_4) updatables.ssn_last_4 = ssn_last_4

      // Return if no fields to update.
      if (!Object.keys(updatables).length) {
        setSuccessMsg('All information is up to date.')
        return
      }

      const userObj = new User()
      await userObj.init()
      userObj.mergeItems(updatables)

      await Promise.all([
        userObj.push(),
        gym.push(),

        // Update stripe details, the function will automatically avoid calling
        // Cloud Function endpoint if there was nothing to update.
        //
        // note: Currently only minimum required fields are updated in stripe
        // (ones that weren't added during Partner Sign Up).

        // userObj.updateStripeAccount(updatables, { pfGeocodeAddress, pfGeocodeCompanyAddress }), 
        userObj.updateStripeAccount(updatables, { pfGeocodeAddress }),
        navigation.navigate('PartnerDashboard')
      ])

      setSuccessMsg('Successfully updated profile information.')
      // setPasswordField('')
      Keyboard.dismiss()
    } catch (err) {
      if (config.DEBUG) console.error(err)
      let [errorMsg, redFields] = handleAuthError(err)
      setRedFields(redFields)
      setErrorMsg(errorMsg)
    }
    // navigation.navigate('PartnerDashboard')
  }

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  // adds hyphens in text input
  const handleDOB = (text) => {
    if (text.length == 2) {
      text = text += "-"
      return text
    } else if (text.length == 5) {
      text = text += "-"
      return text
    }

    return text
  }

  if (!user || isForeignUser === undefined) return <View />


  return (
    <ProfileLayout
      hideBackButton={true}
      buttonOptions={{
        logOut: {
          show: true,
        },
      }}>

      <View>
        <Text
          style={styles.profileName}>
          {user.name}
        </Text>
      </View>

      {errorMsg
        ? <Text style={{ color: "red" }}>{errorMsg}</Text>
        : <Text style={{ color: "green" }}>{successMsg}</Text>}
          <View>
            <Text
              style={{ ...FONTS.subtitle }}
              textAlign='center'>
              this information used only to connect with stripe so we can accecpt and process your payments with stripe.
          </Text>
          </View>

          <CustomTextInput
            containerStyle={{
              borderColor: redFields.includes("email")
                ? "red" : undefined
            }}
            placeholder="Email"
            value={emailField}
            onChangeText={setEmailField}
          />
          {/* <CustomTextInputV2
            containerStyle={styles.inputField}
            red={redFields.includes('dob')}
            // keyboardType='numeric'
            placeholder='Date of Birth (MM-DD-YYYY)'
            value={dob}
            // onChangeText={(text) => console.log("text: ", text)}
            onChangeText={setDob}
          /> */}
          <CustomTextInputV2
            containerStyle={styles.inputField}
            keyboardType='numeric'
            value={dob}
            maxLength={10}
            placeholder='Date of Birth (MM-DD-YYYY)'
            onChangeText={(text) => 
                setDob(handleDOB(text))
            }
        />

            <CustomTextInputV2
              containerStyle={styles.inputField}
              red={redFields.includes('address')}
              placeholder='Personal Address'
              value={address}
              onChangeText={setAddress}
            />
            <CustomTextInputV2
              containerStyle={styles.inputField}
              red={redFields.includes('phone')}
              placeholder='Phone'
              value={phone}
              onChangeText={setPhone}
            />

            <CustomTextInputV2
              containerStyle={styles.inputField}
              red={redFields.includes('ssn_last_4')}
              placeholder='SSN Last 4'
              value={ssn_last_4}
              onChangeText={setSSNLast4}
            />
            <Text style={{
              paddingTop: 20,
              paddingBottom: 10,
              ...FONTS.subtitle,
              textAlign: "center", 
              fontSize: 16,
            }}>Add bank account</Text>

            { !hasBankAccountAdded ? <> 
              <BankAccountFormWithButtonEntry
                onError={setErrorMsg} 
                onSuccess={() => refresh(r => r + 1)}
              />
              <PlaidButton onError={setErrorMsg} onSuccess={setHasBankAccountAdded(true)}/> 
            </> : <>
              <Text style={styles.confirmation}>Your bank account has been linked.</Text>
              </>
            }

            <Text style={styles.error}>{errorMsg}</Text>

      {hasBankAccountAdded ?
        (<CustomButton
        style={styles.button}
        title="Finish 
        Your Account!"
        onPress={updateSafeInfoForPartner}
      />):null
      }
      
    </ProfileLayout>
  )
}

const styles = StyleSheet.create({
  text: {
    paddingVertical: 8,
    alignSelf: "center",
    fontSize: 22,
  },
  textContainer: {
    marginVertical: 10,
    marginStart: 5,
    marginEnd: 5,
  },
  miniText: {
    ...config.styles.body,
    fontSize: 12,
    alignSelf: "center",
  },
  confirmation: {
    ...config.styles.body,
    color: 'green',
    textAlign: 'center',
    paddingBottom: 10,
  },
  error: {
    ...config.styles.body,
    color: 'red',
    textAlign: 'center',
  },
  profileName: {
    marginTop: 15,
    marginBottom: 10,
    alignSelf: "center",
    ...FONTS.luloClean,
    fontSize: 16,
  },
  forwardButtonContainer: {
    marginBottom: 30,
    alignSelf: "flex-end",
    marginEnd: 5,
    backgroundColor: "#ffffff",
    marginTop: 5,
    position: "absolute",
    bottom: 0,
    right: 0,
  }
})
