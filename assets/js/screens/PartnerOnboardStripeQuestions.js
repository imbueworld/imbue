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
import { currencyFromZeroDecimal } from '../backend/HelperFunctions'
import functions from '@react-native-firebase/functions'
import firestore from '@react-native-firebase/firestore';
const p = console.log



export default function ProfileSettings(props) {
  const [user, setUser] = useState(null)
  const [isForeignUser, setIsForeignUser] = useState()
  const navigation = useNavigation()
  const [gym, setGym] = useState(null)
  const [hasBankAccountAdded, setHasBankAccountAdded] = useState()
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
      setHasBankAccountAdded(Boolean(userDoc.stripe_bank_account_id))
      // setHasBankAccountAdded(true)

      console.log("user (useEffect): ", user)

      // update Stripe balance revenue
      if (gym) {
        const updateStripeAccountRevenue = functions().httpsCallable('updateStripeAccountRevenue')
        await updateStripeAccountRevenue(gym.id)
      }
    }; init()
  }, [r])

  useEffect(() => {
    if (!user) return
    setFirstNameField(user.first)
    setLastNameField(user.last)
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

  const [firstNameField, setFirstNameField] = useState("")
  const [lastNameField, setLastNameField] = useState("")
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



  const updateSafeInfoForUser = async () => {
    setRedFields([])
    setErrorMsg('')
    setSuccessMsg('')

    let redFields = []

    // let {
    //   dob,
    // } = reactNativeForm

    if (firstNameField.length === 0) redFields.push("first")
    if (lastNameField.length === 0) redFields.push("last")
    if (emailField.length === 0) redFields.push("email")
    // if (passwordField.length === 0 && !isForeignUser) redFields.push("main_password")
    if (dob.split('-').length != 3) redFields.push('dob')


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

      if (firstNameField !== user.first) {
        updatables.first = firstNameField
        updatables.name = `${firstNameField} ${user.last}` // Upadting the helper property
      }
      if (lastNameField !== user.last) {
        updatables.last = lastNameField
        updatables.name = `${user.first} ${lastNameField}` // Upadting the helper property
      }
      if (emailField !== user.email) {
        updatables.email = emailField
        await auth().currentUser.updateEmail(emailField)
      }

      // Return if no fields to update.
      if (!Object.keys(updatables).length) {
        setSuccessMsg('All information is up to date.')
        return
      }

      if (config.DEBUG) p('updatables', updatables)

      const userObj = new User()
      await userObj.init()
      userObj.mergeItems(updatables)
      await userObj.push()

      setSuccessMsg('Successfully updated profile information.')
      // setPasswordField('')
      Keyboard.dismiss()
    } catch (err) {
      if (config.DEBUG) console.error(err)
      let [errorMsg, redFields] = handleAuthError(err)
      setRedFields(redFields)
      setErrorMsg(errorMsg)
    }
  }

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
    // auditField(company_name, 'company_name')
    // auditField(companyAddressText, 'company_address')
    // auditField(tax_id, 'tax_id')

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
      if (addressText) pfGeocodeAddress = await geocodeAddress(addressText)
      // if (companyAddressText) pfGeocodeCompanyAddress = await geocodeAddress(companyAddressText)
      if (pfGeocodeAddress) {
        const {
          address,
          formatted_address,
        } = pfGeocodeAddress


        updatables.address = address
        updatables.formatted_address = formatted_address
      }

      // if (pfGeocodeCompanyAddress) {
      //   const {
      //     address,
      //     formatted_address,
      //     location,
      //   } = pfGeocodeCompanyAddress

      //   // updatables.company_address = address
      //   // updatables.formatted_company_address = formatted_address

      //   // Since company address and gym address are synced together,
      //   // update the gym as well
      //   await gym.updateCoordinates(location)
      //   gym.mergeItems({
      //     address,
      //     formatted_address,
      //   })
      // }

      if (phoneText) updatables.phone = phoneText.replaceAll(/[^0-9]/g, '')
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
        userObj.updateStripeAccount(updatables, { pfGeocodeAddress })
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
  }

  async function updatePassword() {
    setRedFields([])
    setErrorMsg("")
    setSuccessMsg("")
    let redFields = []


    if (redFields.length) {
      setErrorMsg("Required fields need to be filled.")
      setRedFields(redFields)
      return
    }

    if (changePasswordField !== changePasswordFieldConfirm) {
      setErrorMsg("Passwords do not match.")
      setRedFields(["change_password", "change_password_confirm"])
      return
    }

    try {
      await auth().signInWithEmailAndPassword(user.email, passwordField)
      await auth().currentUser.updatePassword(changePasswordField)
      setSuccessMsg("Successfully changed password.")
      setChangePasswordField("")
      setChangePasswordFieldConfirm("")
      // setPasswordField("")
      Keyboard.dismiss()
    } catch (err) {
      let [errorMsg, redFields] = handleAuthError(err)
      setRedFields(redFields)
      setErrorMsg(errorMsg)
    }
    navigation.reset({
      index: 0,
      routes: [{ name: 'Boot' }],
    })
  }


  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  if (!user || isForeignUser === undefined) return <View />


  return (
    <ProfileLayout
      hideBackButton={true}>

      <View>
        <Text
          style={styles.profileName}>
          {user.name}
        </Text>
      </View>

      {errorMsg
        ? <Text style={{ color: "red" }}>{errorMsg}</Text>
        : <Text style={{ color: "green" }}>{successMsg}</Text>}

      {changing === "safeInfo"
        ? <>
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
          <CustomTextInputV2
            containerStyle={styles.inputField}
            red={redFields.includes('dob')}
            // keyboardType='numeric'
            placeholder='Date of Birth (MM-DD-YYYY)'
            value={dob}
            // onChangeText={(text) => console.log("text: ", text)}
            onChangeText={setDob}
          />

          {user.account_type == 'partner' && <>
            <CustomTextInputV2
              containerStyle={styles.inputField}
              red={redFields.includes('address')}
              placeholder='Personal Address'
              value={address}
              onChangeText={text => {
                setValue('address', text)
                setAddress(text)
              }}
            />
            <CustomTextInputV2
              containerStyle={styles.inputField}
              red={redFields.includes('phone')}
              placeholder='Phone'
              value={phone}
              onChangeText={text => {
                setValue('phone', text)
                setPhone(text)
              }}
            />

            <CustomTextInputV2
              containerStyle={styles.inputField}
              red={redFields.includes('ssn_last_4')}
              placeholder='SSN Last 4'
              value={ssn_last_4}
              onChangeText={text => {
                setValue('ssn_last_4', text)
                setSSNLast4(text)
              }}
            />
            <Text style={{
              paddingTop: 15,
              paddingBottom: 10,
              ...FONTS.subtitle,
              textAlign: "center",
              fontSize: 22,
            }}>Add bank account</Text>

            <Text style={styles.error}>{errorMsg}</Text>

            { !hasBankAccountAdded ? <>
              <BankAccountFormWithButtonEntry
                onError={setErrorMsg}
                onSuccess={() => refresh(r => r + 1)}
              />
              <Text
              style={styles.miniText}>
                or
              </Text>
              <PlaidButton onError={setErrorMsg} onSuccess={setHasBankAccountAdded} />
            </> : <>
                <Text style={styles.confirmation}>Your bank account has been linked.</Text>
              </>
            }

          </>}
        </>
        : null}
      <CustomButton
        style={styles.button}
        title="Finish 
        Your Account!"
        onPress={updateSafeInfoForPartner}
      />
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
