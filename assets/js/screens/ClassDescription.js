import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'

import AppBackground from "../components/AppBackground"

import CustomButton from "../components/CustomButton"
import CustomPopup from "../components/CustomPopup"
import PopupPurchase from '../components/popups/PopupPurchase'

import { retrieveUserData, retrieveGyms, retrieveMemberships } from '../backend/CacheFunctions'
import { purchaseClasses } from "../backend/BackendFunctions"



export default function ClassDescription(props) {
  let cache = props.route.params.cache
  let classData = props.route.params.data

  const [Title, TitleCreate] = useState(null)
  const [Time, TimeCreate] = useState(null)
  const [Desc, DescCreate] = useState(null)

  const [popup, setPopup] = useState(false)
  const [PopupCCNotFound, PopupCCNotFoundCreate] = useState(null)
  const [PopupBuy, PopupBuyCreate] = useState(null)

  const [hasMemebership, setHasMembership] = useState(null)
  const [selectedCard, selectCard] = useState(null)

  const [gym, setGym] = useState(null)

  useEffect(() => {
    const init = async () => {
      setGym(( await retrieveGyms(cache, { gymIds: [classData.gym_id] }) )[0])
    }
    init()
  }, [])

  useEffect(() => {
    if (!gym) return

    const init = async () => {
      let user = await retrieveUserData(cache)
      let imbueMembership = await retrieveMemberships(cache, {
        membershipIds: ["imbue"]
      })

      let membership =
        user.active_memberships.includes(imbueMembership.id)
          ? "imbue"
          : user.active_memberships.includes(gym.id)
              ? "gym"
              : user.active_classes.includes(classData.id)
                  ? "class"
                  : false

      setHasMembership(membership)
    }
    init()
  }, [popup, gym])

  useEffect(() => {
    TitleCreate(
      <View>
        <Text>{classData.name}</Text>
        <Text>{classData.instructor}</Text>
      </View>
    )
    TimeCreate(
      <View>
        <Text>{classData.formattedDate}</Text>
        <Text>{classData.formattedTime}</Text>
      </View>
    )
    DescCreate(
      <View>
        <Text>{classData.description}</Text>
      </View>
    )
    PopupCCNotFoundCreate(
      <CustomPopup
        containerStyle={{
          padding: 0,
        }}
        onX={() => setPopup(false)}
      >
        <View style={{
          flexDirection: "row",
          marginHorizontal: 20,
        }}>
          <CustomButton
            style={{
              flex: 1,
              marginRight: 10,
            }}
            title="Yes"
            onPress={() => {
              setPopup(false)
              props.navigation.navigate("AddPaymentMethod")
            }}
          />
          <CustomButton
            style={{
              flex: 1,
              marginLeft: 10,
            }}
            title="Cancel"
            onPress={() => setPopup(false)}
          />
        </View>
      </CustomPopup>
    )
  }, [])

  useEffect(() => {
    if (!gym) return

    PopupBuyCreate(
      <PopupPurchase
        cache={cache}
        // data={classData}
        popupText={`If you would like to confirm your purchase of ${classData.price}, select your payment method.`}
        selectedCard={selectedCard}
        selectCard={selectCard}
        onProceed={async () => {
          if (selectedCard) {
            await purchaseClasses(cache, {
              classIds: [classData.id],
              creditCardId: selectedCard,
              price: classData.price,
              description: `One Time Class purchase for ${gym.name}, ${classData.name}`,
            })
            setPopup(false)
          }
        }}
        onX={() => setPopup(false)}
      />
    )
  }, [selectedCard, gym])

  return (
    <>
      {/* { !popup ? null :
            !creditCards.length ? PopupCCNotFound : PopupConfirmPurchase
        } */}

      { popup ? PopupBuy : null}

      <ScrollView contentContainerStyle={styles.scrollView}>

        <AppBackground />

        <View style={styles.container}>
          {Title}
          {Time}
          {Desc}
        </View>
        <View>
          { hasMemebership ? null :
          <CustomButton
            title="Book"
            onPress={() => {
              setPopup("buy")
            }}
          />}
          
          { hasMemebership !== "imbue" ? null :
          <Text style={{ color: "purple" }}>[V] You have Imbue Universal Gym Membership!</Text>}
          { hasMemebership !== "gym" ? null :
          <Text style={{ color: "green" }}>[V] You have a membership to this gym!</Text>}
          { hasMemebership !== "class" ? null :
          <Text style={{ color: "green" }}>[V] You are signed up for this class!</Text>}
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
  },
  container: {},
})