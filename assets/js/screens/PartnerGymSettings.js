import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInputV2 from '../components/CustomTextInputV2'
import CustomButton from "../components/CustomButton"
import Icon from '../components/Icon'
import Gym from '../backend/storage/Gym'
import User from '../backend/storage/User'
import { StackActions, useNavigation } from '@react-navigation/native'
import config from '../../../App.config'



export default function PartnerGymSettings(props) {
  const navigation = useNavigation()
  const [redFields, setRedFields] = useState([])
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const [user, setUser] = useState(null)
  const [gym, setGym] = useState(null)

  const [name, setName] = useState(null)
  const [description, setDescription] = useState(null)
  const [address, setAddress] = useState(null)

  useEffect(() => {
    const init = async () => {
      const user = new User()
      const userDoc = await user.retrieveUser()
      setUser(userDoc)

      const {
        associated_gyms = [],
      } = userDoc

      const gym = new Gym()
      const gymDoc = await gym.retrieveGym(associated_gyms[0]) || {}
      setGym(gymDoc)

      const {
        name,
        description,
        formatted_address,
      } = gymDoc

      setName(name)
      setDescription(description)
      setAddress(formatted_address)
    }; init()
  }, [])



  function invalidate() {
    let redFields = []
    if (!name) redFields.push("name")
    if (!description) redFields.push("description")
    if (!address) redFields.push("address")

    if (redFields.length) {
      setRedFields(redFields)
      return "Required fields need to be filled."
    }
  }


  if (!user || !gym) return <View />

  return (
    <ProfileLayout
      innerContainerStyle={{
        paddingBottom: 10,
      }}
    > 
          <CustomButton
        icon={
          <Icon
            source={require("../components/img/png/ellipsis.png")}
          /> 
        }
        title='Revenue Information'
        onPress={() => props.navigation.navigate(
          "PartnerRevenueInfo"
        )}
      />
     
       {/* <CustomTextInputV2
        containerStyle={styles.input}
        red={redFields.includes('name')}
        placeholder="Gym Name"
        value={name}
        onChangeText={setName}
      />
      <CustomTextInputV2
        containerStyle={styles.input}
        red={redFields.includes('description')}
        placeholder="Gym Description"
        value={description}
        onChangeText={setDescription}
      />
      <CustomTextInputV2
        containerStyle={styles.input}
        red={redFields.includes('address')}
        placeholder="Gym Address"
        value={address}
        onChangeText={setAddress}
      />

      <CustomButton
        style={{ marginTop: 20 }}
        title='Save'
        onPress={async () => {
          setRedFields([])
          setErrorMsg("")
          setSuccessMsg("")

          let errorMsg
          try {
            const gymObj = new Gym()
            await gymObj.initByUid(gym.id)

            errorMsg = invalidate()
            if (errorMsg) throw new Error(errorMsg)
            
            gymObj.mergeItems({
              name,
              description,
            })
            await gymObj.push()

            const res = await gymObj.updateLocation(address)
            if (!res) setErrorMsg('Provided address was not an address for a premise.')
            else setSuccessMsg('Information updated.')
          } catch(err) {
            if (config.DEBUG) console.error(err.message)
            if (!errorMsg) {
              setErrorMsg('Something prevented the action.') 
              return
            }
            setErrorMsg(errorMsg)
          }
        }}
      /> */}

      {/* {errorMsg
        ? null
        : <Text style={{ color: "green", flex: 1 }}>{successMsg}</Text>}  */}
      {/* <CustomButton
        icon={
          <Icon
            source={require("../components/img/png/my-classes-2.png")}
          />
        }
        title="Update Classes"
        onPress={() => props.navigation.navigate(
          "PartnerUpdateClasses"
        )}
      /> */}
        
      <CustomButton
        icon={
          <Icon
            source={require("../components/img/png/user-memberships.png")}
          />
        }
        title="Update Memberships"
        onPress={() => props.navigation.navigate(
          "PartnerUpdateMemberships")}
      />
      <CustomButton
        icon={
          <Icon
            source={require("../components/img/png/ellipsis.png")}
          /> 
        }
        title='Revenue Information'
        onPress={() => props.navigation.navigate(
          "PartnerRevenueInfo"
        )}
      />
      {/* <CustomButton
        title='Mindbody Integration'
        onPress={() => {
          const pushAction = StackActions.push('MindbodyActivation')
          navigation.dispatch(pushAction)
        }}
      /> */}
    </ProfileLayout>
  )
}

const styles = StyleSheet.create({
  input: {
    marginTop: 20,
  },
})