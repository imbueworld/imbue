import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'

import CustomButton from "../components/CustomButton"
import CustomPopup from "../components/CustomPopup"
import MembershipApprovalBadge from '../components/MembershipApprovalBadge'
import MembershipApprovalBadgeImbue from '../components/MembershipApprovalBadgeImbue'
import ClassApprovalBadge from '../components/ClassApprovalBadge'

import GymLayout from '../layouts/GymLayout'
import { colors } from "../contexts/Colors"
import { fonts, FONTS } from '../contexts/Styles'
import CreditCardSelectionV2 from '../components/CreditCardSelectionV2'
import { classType, currencyFromZeroDecimal } from '../backend/HelperFunctions'
import User from '../backend/storage/User'
import Gym from '../backend/storage/Gym'



export default function ClassDescription(props) {
  const classData = props.route.params.data

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
      const { gym_id: classGymId } = classData

      const user = new User()
      setUser(await user.retrieveUser())

      const gym = new Gym()
      setGym(await gym.retrieveGym(classGymId))
    }
    init()
  }, [])
  
  let activeClassesCount = user
    ? user.active_classes
        ? user.active_classes.length
        : null
    : null
  useEffect(() => {
    if (!gym) return
    if (!user) return
    if (user.account_type != 'user') {
      setHasMembership(true)
      return
    }

    const init = async () => {
      const imbue = new Gym()

      const {
        id: imbueId,
      } = await imbue.retrieveGym('imbue')

      let activeTimeIds = user.active_classes.map(active => active.time_id)

      let hasMembership =
        user.active_memberships.includes(imbueId)
          ? 'imbue'
          : user.active_memberships.includes(gym.id)
              ? 'gym'
              : activeTimeIds.includes(classData.time_id)
                  ? 'class'
                  : false

      setHasMembership(hasMembership)
    }
    init()
  }, [activeClassesCount, gym, popup])

  useEffect(() => {
    if (hasMembership === null) return

    const Bar = <View style={{
      width: "88%",
      height: 1,
      alignSelf: "center",
      borderBottomWidth: 1,
      borderColor: `${colors.gray}40`,
    }}/>

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
          {"\n"}
          {classType(classData.type)}
        </Text>

        { Bar }

        <View style={styles.descContainer}>
          <Text style={styles.descText}>
            {classData.description}
          </Text>

          {hasMembership
          ? null
          : <Text style={{
              ...styles.descText,
              alignSelf: "flex-end",
            }}>
              {`$${currencyFromZeroDecimal(classData.price)}`}
            </Text>}
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
  }, [hasMembership])



  if (!gym || !user) return <View />

  // helper variable
  const classIsAddedToCalendar =
    user.account_type == 'user'
    ? user.scheduled_classes
        .map(active => active.time_id)
        .includes(classData.time_id)
    : null
  
  function getGoToLivestreamButton() {
    let options = {
      show: false,
      state: "normal",
    }
    if (classData.livestreamState === "live") {
      options.show = true
    }
    if (classData.livestreamState === "soon") {
      options.show = true
      options.state = "inactive"
    }
    return options
  }

  return (
    <GymLayout
      containerStyle={styles.container}
      innerContainerStyle={styles.innerContainerStyle}
      data={gym}
      buttonOptions={{
        goToLivestream: getGoToLivestreamButton(),
        addToCalendar: {
          show: hasMembership && user.account_type == 'user',
          state: classIsAddedToCalendar ? 'fulfilled' : 'opportunity',
          onPress: async () => {
            const {
              id: classId,
              time_id: timeId,
            } = classData

            const user = new User()
            await user.scheduleClass({
              classId,
              timeId,
            })

            refresh(r + 1)
          }
        },
        viewAttendees: {
          show: user.account_type === "partner" ? true : false,
          data: {
            classId: classData.id,
            timeId: classData.time_id,
          },
        },
        goToCalendar: { show: true },
      }}
    >
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
                title={
                  <Text>
                    {`Confirm payment for ${gym.name}, ${classData.name} — `}
                    <Text style={{
                      textDecorationLine: "underline",
                    }}>One Time Online Class</Text>
                  </Text>
                }
                onX={() => setPopup(null)}
                onCardSelect={async creditCardId => {
                  try {
                    setErrorMsg('')
                    setSuccessMsg('')

                    const {
                      id: classId,
                      time_id: timeId,
                      price,
                      partner_id: partnerId,
                      name: className,
                    } = classData

                    const {
                      id: gymId,
                      name: gymName,
                    } = gym

                    const user = new User()
                    await user.purchaseClass({
                      classId,
                      timeId,
                      creditCardId,
                      price,
                      description: `One Time Class purchase – ${gymName}, ${className}`,
                      partnerId,
                      gymId,
                      purchaseType: 'class',
                    })

                    refresh(r + 1)

                  } catch(err) {
                    switch (err.code) {
                      case "busy":
                        setErrorMsg(err.message)
                        break
                      case "class-already-bought":
                        setSuccessMsg(err.message)
                        break
                      default:
                        setErrorMsg("Something prevented the action.")
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
    // ...FONTS.title,
    // ...FONTS.luloClean,
  },
  instructorText: {
    textAlign: "center",
    fontSize: 22,
    fontFamily: fonts.default,
    // ...FONTS.subtitle,
    // ...FONTS.luloClean,
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
    // ...FONTS.subtitle,
    // ...FONTS.luloClean,
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
    // ...FONTS.body,
    // ...FONTS.luloClean,
  },
})