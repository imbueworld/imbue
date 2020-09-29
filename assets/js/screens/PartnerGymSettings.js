import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import { updateGymAddress } from '../backend/BackendFunctions'
import Icon from '../components/Icon'
import Gym from '../backend/storage/Gym'
import User from '../backend/storage/User'



export default function PartnerGymSettings(props) {
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
        associated_gyms=[],
      } = userDoc

      const gym = new Gym()
      const gymDoc = await gym.retrieveGym(associated_gyms[ 0 ]) || {}
      setGym(gymDoc)

      const {
        name,
        description,
        address,
      } = gymDoc

      setName(name)
      setDescription(description)
      setAddress(address)
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
      {errorMsg
        ? <Text style={{ color: "red" }}>{errorMsg}</Text>
        : <Text style={{ color: "green" }}>{successMsg}</Text>}

      <CustomTextInput
        placeholder="Gym Name"
        value={name}
        onChangeText={setName}
      />
      <CustomTextInput
        containerStyle={{
          height: 200,
        }}
        placeholder="Gym Description"
        value={description}
        onChangeText={setDescription}
      />
      <CustomTextInput
        placeholder="Gym Address"
        value={address}
        onChangeText={setAddress}
      />

      <CustomButton
        title="Save"
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

            gymObj.updateLocation(address, res => {
              if (!res) {
                setErrorMsg('Provided address was not an address for a premise.')
                return
              }
              setSuccessMsg('Information updated.')
            })
          } catch(err) {
            if (!errorMsg) {
              setErrorMsg('Something prevented the action.')
              return
            }
            setErrorMsg(errorMsg)
          }
        }}
      />

      <CustomButton
        icon={
          <Icon
            source={require("../components/img/png/my-classes-2.png")}
          />
        }
        title="Update Classes"
        onPress={() => props.navigation.navigate(
          "PartnerUpdateClasses"
        )}
      />
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
        title="More Information"
        onPress={() => props.navigation.navigate(
          "PartnerRevenueInfo")}
      />
    </ProfileLayout>
  )
}

const styles = StyleSheet.create({})