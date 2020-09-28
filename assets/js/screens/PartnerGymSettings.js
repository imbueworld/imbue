import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import { retrieveUserData, retrieveGymsByIds } from '../backend/CacheFunctions'
import { updateGym, updateGymAddress } from '../backend/BackendFunctions'
import Icon from '../components/Icon'



export default function PartnerGymSettings(props) {
  let cache = props.route.params.cache

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
      let user = await retrieveUserData(cache)
      setUser(user)
      // Currently operates on the premise that each partner has only one gym
      let gym = await retrieveGymsByIds(cache, { gymIds: [user.associated_gyms[0]] })

      if (!gym) {
        setGym({})
        return
      }

      gym = gym[0]
      setGym(gym)

      setName(gym.name)
      setDescription(gym.description)
      setAddress(gym.address)
    }
    init()
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
      data={{ name: user.name, iconUri: user.icon_uri_full }}
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
            errorMsg = invalidate()
            if (errorMsg) throw new Error(errorMsg)

            await updateGym(cache, {
              gymId: gym.id,
              doc: {
                name,
                description,
              }
            })

            updateGymAddress(address, res => {
              if (!res) {
                setErrorMsg('Provided address was not a street address.')
                return
              }
              setSuccessMsg('Information updated.')
            })
          } catch (err) {
            if (!errorMsg) {
              setErrorMsg("Something prevented the action.")
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