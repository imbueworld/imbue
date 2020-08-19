import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import CustomButton from "../components/CustomButton"
import CustomPopup from "../components/CustomPopup"
import PopupPurchase from '../components/popups/PopupPurchase'
import MembershipApprovalBadge from '../components/MembershipApprovalBadge'
import MembershipApprovalBadgeImbue from '../components/MembershipApprovalBadgeImbue'
import ClassApprovalBadge from '../components/ClassApprovalBadge'

import { retrieveUserData, retrieveGyms, retrieveMemberships } from '../backend/CacheFunctions'
import { purchaseClasses } from "../backend/BackendFunctions"
import GymLayout from '../layouts/GymLayout'
import { colors } from "../contexts/Colors"



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
      setGym((await retrieveGyms(cache, { gymIds: [classData.gym_id] }))[0])
    }
    init()
  }, [])

  useEffect(() => {
    if (!gym) return

    const init = async () => {
      let user = await retrieveUserData(cache)
      let memberships = await retrieveMemberships(cache, {
        membershipIds: ["imbue"]
      })

      let imbueMembership = memberships[0]

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
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>
          {classData.name}
        </Text>
        <Text style={styles.nameText}>
          {classData.instructor}
        </Text>
      </View>
    )
    TimeCreate(
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {classData.formattedDate}
          {classData.formattedTime}
        </Text>
      </View>
    )
    DescCreate(
      <View style={styles.descContainer}>
        <Text style={styles.descText}>
          {classData.description}
        </Text>
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

      {popup ? PopupBuy : null}

      {!gym ? null :
      <GymLayout
        containerStyle={styles.container}
        innerContainerStyle={styles.innerContainerStyle}
        data={gym}
      >
        {Title}
        {Time}
        {Desc}

        <View>
          {hasMemebership ? null :
            <CustomButton
              title="Book"
              onPress={() => {
                setPopup("buy")
              }}
            />}

          {hasMemebership !== "imbue" ? null :
          <MembershipApprovalBadgeImbue
            containerStyle={{
              marginTop: 10,
              marginBottom: 10,
            }}
            data={gym}
          />}
          {hasMemebership !== "gym" ? null :
          <MembershipApprovalBadge
            containerStyle={{
              marginTop: 10,
              marginBottom: 10,
            }}
            data={gym}
          />}
          {hasMemebership !== "class" ? null :
          <ClassApprovalBadge
            containerStyle={{
              marginTop: 10,
              marginBottom: 10,
            }}
          />}
        </View>
      </GymLayout>}
    </>
  )
}

const styles = StyleSheet.create({
  container: {},
  innerContainerStyle: {},
  nameContainer: {},
  nameText: {
      marginTop: 20,
      textAlign: "center",
      fontSize: 24,
  },
  timeContainer: {
    marginTop: 20,
    marginRight: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  timeText: {
    fontSize: 14,
  },
  descContainer: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  descText: {
    fontSize: 16,
    textAlign: "justify",
  },
})