import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"
import CompanyLogo from "../components/CompanyLogo"

import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"

import { colors } from '../contexts/Colors'
import MembershipApprovalBadgeImbue from '../components/MembershipApprovalBadgeImbue'
import CreditCardSelectionV2 from '../components/CreditCardSelectionV2'
import { currencyFromZeroDecimal } from '../backend/HelperFunctions'
import { FONTS } from '../contexts/Styles'
import User from '../backend/storage/User'
import Gym from '../backend/storage/Gym'
import GoBackButton from '../components/buttons/GoBackButton'
import config from '../../../App.config'




export default function PurchaseUnlimited(props) {
  const [r, refresh] = useState(0)
  const [errorMsg, setErrorMsg] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const [user, setUser] = useState(null)
  const [imbueMembership, setImbueMembership] = useState(null)

  const [hasImbueMembership, setHasImbueMembership] = useState(null)
  const [popup, setPopup] = useState(null)

  useEffect(() => {
    const init = async () => {
      const user = new User()
      setUser(await user.retrieveUser())

      const gym = new Gym()
      setImbueMembership(await gym.retrieveGym('imbue'))
    }; init()
  }, [])

  let activeMembershipsCount = user
    ? user.active_memberships
        ? user.active_memberships.length
        : null
    : null
  useEffect(() => {
    if (!user) return
    if (!imbueMembership) return

    setHasImbueMembership(
      user.active_memberships.includes(imbueMembership.id)
    )
  }, [activeMembershipsCount, imbueMembership, popup])



  if (!imbueMembership) return <View />

  // helper variable
  const membershipPrice = `$${currencyFromZeroDecimal(imbueMembership.membership_price)}`

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
      <AppBackground />

      <GoBackButton
            containerStyle={{
              position: "absolute",
              left: 15,
              top: 40
            }}
            imageContainerStyle={{
              width: 48,
              height: 48,
            }}
          />

      


      <CustomCapsule
        containerStyle={styles.container}
        innerContainerStyle={{
          paddingBottom: 10,
        }}
      >

        <CompanyLogo
          style={{
            width: 300,
            height: 200,
          }}
        />

        <View style={styles.textContainer}>
          <Text style={{
            ...FONTS.body,
            textAlign: "justify",
            fontSize: 18,
          }}>
            {imbueMembership.description}
          </Text>
          <Text style={{
            ...FONTS.body,
            alignSelf: "flex-end",
            fontSize: 18,
          }}>
            {membershipPrice}
          </Text>
        </View>

        {errorMsg
        ? <Text style={{ color: "red" }}>{errorMsg}</Text>
        : null}
        {successMsg
        ? <Text style={{ color: "green" }}>{successMsg}</Text>
        : null}

        {/* if null, it means it hasn't been initialized yet. */}
        {hasImbueMembership === null ? <View /> :
          hasImbueMembership ? null :
            <>
            {popup === "buy"
            ? <CreditCardSelectionV2
                containerStyle={styles.cardSelectionContainer}
                title={
                  <Text>
                    {`Confirm payment for Imbue — `}
                    <Text style={{
                      textDecorationLine: "underline",
                    }}>{imbueMembership.name}</Text>
                  </Text>
                }
                onX={() => setPopup(null)}
                onCardSelect={async paymentMethodId => {
                  try {
                    setErrorMsg('')
                    setSuccessMsg('')

                    const user = new User()
                    await user.purchaseImbueMembership({ paymentMethodId })
                    
                    // After success with purchase
                    setHasImbueMembership(true)
                  } catch(err) {
                    if (config.DEBUG) console.error(err)
                    switch (err.code) {
                      case "busy":
                        setErrorMsg(err.message)
                        break
                      case "membership-already-bought":
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
                title="Purchase"
                onPress={() => {
                  setPopup("buy")
                }}
              />}
            </>}

        {hasImbueMembership ?
        <MembershipApprovalBadgeImbue
          containerStyle={{
            marginTop: 10,
          }}
        /> : null}

        {/* <CreditCardInput /> */}

        {/* <TouchableOpacity style={[{
                  marginBottom: 10,
                  alignSelf: "center",
              }, styles.buttonSmall]}>
                  <Text style={{
                      textDecorationLine: "underline"
                  }}>Make a one time purchase</Text>
              </TouchableOpacity> */}

      </CustomCapsule>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
  },
  container: {
    width: "94%",
    marginVertical: 30,
    alignSelf: "center",
  },
  cardSelectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 30,
  },
  buttonSmall: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  textContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.gray,
    overflow: "hidden",
  },
})