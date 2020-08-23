import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import CustomButton from "../components/CustomButton"
import CustomPopup from "../components/CustomPopup"
import PopupPurchase from '../components/popups/PopupPurchase'
import MembershipApprovalBadge from '../components/MembershipApprovalBadge'
import MembershipApprovalBadgeImbue from '../components/MembershipApprovalBadgeImbue'
import ClassApprovalBadge from '../components/ClassApprovalBadge'

import { retrieveUserData, retrieveGymsByIds } from '../backend/CacheFunctions'
import { purchaseClasses, scheduleClasses } from "../backend/BackendFunctions"
import GymLayout from '../layouts/GymLayout'
import { colors } from "../contexts/Colors"
import { fonts } from '../contexts/Styles'
import CreditCardSelectionV2 from '../components/CreditCardSelectionV2'



export default function ClassDescription(props) {
  let cache = props.route.params.cache
  let classData = props.route.params.data

  const [r, refresh] = useState(0)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  // const [Title, TitleCreate] = useState(null)
  // const [Time, TimeCreate] = useState(null)
  // const [Desc, DescCreate] = useState(null)
  const [Content, ContentCreate] = useState(null)

  const [popup, setPopup] = useState(false)
  const [PopupCCNotFound, PopupCCNotFoundCreate] = useState(null)
  const [PopupBuy, PopupBuyCreate] = useState(null)

  const [hasMembership, setHasMembership] = useState(null)
  const [selectedCard, selectCard] = useState(null)

  const [user, setUser] = useState(null)
  const [gym, setGym] = useState(null)

  useEffect(() => {
    const init = async () => {
      let gyms = await retrieveGymsByIds(cache, {
        gymIds: [classData.gym_id]
      })
      let gym = gyms[0]
      setGym(gym)

      let user = await retrieveUserData(cache)
      setUser(user)
    }
    init()
  }, [])
  
  let activeClassesCount =
    user
      ? user.active_classes
          ? user.active_classes.length
          : null
      : null
  useEffect(() => {
    if (!gym) return
    if (!user) return

    const init = async () => {
      let memberships = await retrieveGymsByIds(cache, {
        gymIds: ["imbue"]
      })
      let imbueMembership = memberships[0]

      let membership =
        user.active_memberships.includes(imbueMembership.id)
          ? "imbue"
          : user.active_memberships.includes(gym.id)
              ? "gym"
              : user.active_classes.includes(classData.time_id)
                  ? "class"
                  : false

      setHasMembership(membership)
    }
    init()
  }, [activeClassesCount, gym, popup])

  useEffect(() => {
    const Bar = <View style={{
      width: "88%",
      height: 1,
      alignSelf: "center",
      borderBottomWidth: 1,
      borderColor: `${colors.gray}40`,
    }}/>

    // TitleCreate(
    //   <View style={styles.nameContainer}>
    //     <Text style={styles.nameText}>
    //       {classData.name}
    //     </Text>
    //     <Text style={styles.nameText}>
    //       {classData.instructor}
    //     </Text>
    //   </View>
    // )
    // TimeCreate(
    //   <View style={styles.timeContainer}>
    //     <Text style={styles.timeText}>
    //       {classData.formattedDate}
    //       {"\n"}
    //       {classData.formattedTime}
    //     </Text>
    //   </View>
    // )
    // DescCreate(
    //   <View style={styles.descContainer}>
    //     <Text style={styles.descText}>
    //       {classData.description}
    //     </Text>
    //   </View>
    // )
    ContentCreate(
      <View style={styles.contentContainer}>

        <Text style={styles.nameText}>
          {classData.name}
        </Text>
        <Text style={styles.instructorText}>
          {classData.instructor}
        </Text>

        { Bar }

        <Text style={styles.timeText}>
          {classData.formattedDate}
          {"\n"}
          {classData.formattedTime}
        </Text>

        { Bar }

        <View style={styles.descContainer}>
          <Text style={styles.descText}>
            {classData.description}
          </Text>
        </View>

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



  if (!gym || !user) return <View />

  // Helper variable
  const classIsAddedToCalendar =
    user.scheduled_classes.includes(classData.time_id)

  return (
    <>
      {/* { !popup ? null :
            !creditCards.length ? PopupCCNotFound : PopupConfirmPurchase
        } */}

      {/* {popup ? PopupBuy : null} */}

      <GymLayout
        containerStyle={styles.container}
        innerContainerStyle={styles.innerContainerStyle}
        data={gym}
        buttonOptions={{
          addToCalendar: {
            show: hasMembership /*=== "class"*/ ? true : false,
            state: classIsAddedToCalendar ? "fulfilled" : "opportunity",
            onPress: async () => {
              await scheduleClasses(cache, { time_ids: [classData.time_id] })
              refresh(r + 1)
            }
          },
          goToCalendar: { show: true } //{ show: hasMembership === "class" ? true : false },
        }}
      >
        {/* {Title}
        {Time}
        {Desc} */}
        { Content }

        {errorMsg
        ? <Text style={{ color: "red" }}>{errorMsg}</Text>
        : null}
        {successMsg
        ? <Text style={{ color: "green" }}>{successMsg}</Text>
        : null}

        {user.account_type !== "user" ? null :
        <View>
          {/* if null, it means it hasn't been initialized yet. */}
          {hasMembership === null ? <View /> :
            hasMembership ? null :
              <>
              {popup === "buy"
              ? <CreditCardSelectionV2
                  containerStyle={styles.cardSelectionContainer}
                  cache={cache}
                  onCardSelect={async cardId => {
                    try {
                      console.log("Book!")
                      setErrorMsg("")
                      setSuccessMsg("")

                      await purchaseClasses(cache, {
                        timeIds: [classData.time_id],
                        creditCardId: cardId,
                        price: classData.price,
                        description: `One Time Class purchase for ${gym.name}, ${classData.name}`,
                        partnerId: gym.partner_id,
                        gymId: gym.id,
                        purchaseType: "class",
                      })

                      refresh(r + 1)
                    } catch(err) {
                      switch (err.code) {
                        case "class-already-bought":
                          setSuccessMsg(err.message)
                          break
                        default:
                          // setErrorMsg("Something prevented the action.")
                          setErrorMsg(err.message)
                          break
                      }
                    }
                  }}
                />
              : <CustomButton
                  style={{
                    marginBottom: 0,
                  }}
                  title="Book"
                  onPress={() => {
                    setPopup("buy")
                  }}
                />}
              </>}

          {hasMembership !== "imbue" ? null :
          <MembershipApprovalBadgeImbue
            containerStyle={{
              marginTop: 10,
              // marginBottom: 10,
            }}
            data={gym}
          />}
          {hasMembership !== "gym" ? null :
          <MembershipApprovalBadge
            containerStyle={{
              marginTop: 10,
              // marginBottom: 10,
            }}
            data={gym}
          />}
          {hasMembership !== "class" ? null :
          <ClassApprovalBadge
            containerStyle={{
              marginTop: 10,
              // marginBottom: 10,
            }}
          />}
        </View>}
      </GymLayout>
    </>
  )
}

const styles = StyleSheet.create({
  container: {},
  innerContainerStyle: {
    paddingBottom: 10,
  },
  cardSelectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 30,
  },
  contentContainer: {
    marginTop: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  // nameContainer: {
  //   marginTop: 20,
  //   borderRadius: 40,
  //   borderWidth: 1,
  //   borderColor: colors.gray,
  // },
  nameText: {
    textAlign: "center",
    fontSize: 27,
    fontFamily: fonts.default,
  },
  instructorText: {
    textAlign: "center",
    fontSize: 22,
    fontFamily: fonts.default,
  },
  // timeContainer: {
  //   marginTop: 20,
  //   marginRight: 5,
  //   paddingHorizontal: 10,
  //   paddingVertical: 5,
  //   borderRadius: 40,
  //   borderWidth: 1,
  //   borderColor: colors.gray,
  // },
  timeText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: fonts.default,
  },
  descContainer: {
    // marginTop: 10,
    // paddingHorizontal: 15,
    width: "88%",
    alignSelf: "center",
    paddingVertical: 10,
    // borderRadius: 40,
    // borderWidth: 1,
    // borderColor: colors.gray,
  },
  descText: {
    fontSize: 16,
    textAlign: "justify",
    fontFamily: fonts.default,
  },
})