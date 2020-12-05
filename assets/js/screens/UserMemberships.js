import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "../components/CustomButton"
import CustomPopup from "../components/CustomPopup"
import ActiveMembershipBadge from "../components/ActiveMembershipsBadge"
import TransactionView from '../components/TransactionView'
import TouchableMenu from '../components/TouchableMenu'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'
import User from '../backend/storage/User'
import GymsCollection from '../backend/storage/GymsCollection'



export default function UserMemberships(props) {
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [popup, setPopup] = useState(null)

  const [user, setUser] = useState(null)
  const [memberships, setMemberships] = useState(null)

  const [Memberships, MembershipsCreate] = useState(null)
  const [PastTransactions, PastTransactionsCreate] = useState(null)

  useEffect(() => {
    const init = async () => {
      const user = new User()
      const userDoc = await user.retrieveUser()

      const { active_memberships=[] } = userDoc

      const gyms = new GymsCollection()
      const gymDocs = ( await gyms.retrieveWhere('id', 'in', active_memberships) )
        .map(it => it.getAll())
      
      // console.log("gymDocs", gymDocs) // DEBUG

      setUser(userDoc)
      setMemberships(gymDocs)
      console.log("memberships: ", memberships)
    }; init()
  }, [successMsg])

  useEffect(() => {
    if (!memberships) return

    // console.log("memberships", memberships) // DEBUG


    MembershipsCreate(memberships.map(membership =>
      <TouchableMenu 
        key={membership.name}
        name={membership.description}
        containerStyle={{
          marginBottom: 15,
          height: 70,
          marginTop: 20,
          marginBottom: 40
        }}
        style={{
          borderRadius: 30,

        }}
        confirmColor='black'
        confirmText='X'
        onProceed={async () => {
          setErrorMsg('')
          setSuccessMsg('')

          try {
            const {
              id: gymId,
            } = membership

            const user = new User()
            await user.cancelMembership({ gymId })

            setSuccessMsg('Subscription canceled!')
          } catch (err) {
            switch (err.code) {
              case "busy":
                setErrorMsg(err.message)
                break
              default:
                setErrorMsg("Something prevented the action.")
                // setErrorMsg(err.message) // DEBUG
                break
            }
          }
        }}
      >
        <ActiveMembershipBadge
          data={membership}
          key={membership.id}
        />
      </TouchableMenu>
    ))
  }, [memberships, successMsg])



  if (!user) return <View />

  return (
    <>
      {popup !== "transactions" ? null :
        <CustomPopup
          innerContainerStyle={{
            paddingHorizontal: 0,
          }}
          onX={() => setPopup(false)}
        >
          <View style={{
            paddingHorizontal: 10,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: colors.textInputBorder,
            borderRadius: 30,
            backgroundColor: colors.buttonAccent,
          }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              { PastTransactions }
              <View style={{ height: 10 }} />
            </ScrollView>
          </View>
        </CustomPopup>}

      <ProfileLayout>
        {errorMsg
          ? <Text style={{ color: "red" }}>{errorMsg}</Text>
          : null}
        {successMsg
          ? <Text style={{ color: "green" }}>{successMsg}</Text>
          : null}

        {/* Membership list */}
        <View style={{marginTop: 40, marginBottom: 20}}>
          <Text style={{ flex: 1, textAlign: "center", fontSize: 16, color: "black", ...FONTS.luloClean, }}>Memberships: </Text>
          { Memberships }
        </View>

        <CustomButton
          style={styles.button}
          textStyle={styles.buttonText}
          title="View Past Transactions"
          onPress={async () => {
            setPopup('transactions')
            const user = new User()
            const pastTransactions = await user.retrievePastTransactions()

            // console.log("pastTransactions", pastTransactions) // DEBUG

            PastTransactionsCreate(
              pastTransactions.map((transaction, idx) =>
                <TransactionView
                  data={transaction}
                  key={idx}
                />
              )
            )
          }}
        />

        <Text style={{
          width: "88%",
          alignSelf: "center",
          ...FONTS.body,
          textAlign: "justify",
        }}>In order to cancel a membership, tap and hold it's respective card and tap remove.</Text>

      </ProfileLayout>
    </>
  )
}

const styles = StyleSheet.create({
  container: {},
  button: {
    marginTop: 0,
    marginBottom: 20,
    marginHorizontal: 30,
    paddingVertical: 10,
    paddingHorizontal: 24,
    flexShrink: 1,
  },
  buttonText: {
    fontSize: 14,
  },
})