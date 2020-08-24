import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "../components/CustomButton"
import CustomPopup from "../components/CustomPopup"
import CustomBar from "../components/CustomBar"
import ActiveMembershipBadge from "../components/ActiveMembershipsBadge"
import { cancelMemberships, deleteSubscription } from '../backend/BackendFunctions'
import { retrievePastTransactions, retrieveUserData, retrieveGymsByIds } from '../backend/CacheFunctions'
import TransactionView from '../components/TransactionView'
import CloseButton from '../components/CloseButton'
import TouchableMenu from '../components/TouchableMenu'
import { highShadow } from '../contexts/Colors'



export default function UserMemberships(props) {
  let cache = props.route.params.cache

  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [popup, setPopup] = useState(null)

  const [user, setUser] = useState(null)
  const [memberships, setMemberships] = useState(null)

  const [Memberships, MembershipsCreate] = useState(null)
  const [PastTransactions, PastTransactionsCreate] = useState(null)

  useEffect(() => {
    const init = async () => {
      let user = await retrieveUserData(cache)
      setUser(user)
      let memberships = await retrieveGymsByIds(cache, {
        gymIds: user.active_memberships
      })
      setMemberships(memberships)
    }
    init()
  }, [successMsg])

  useEffect(() => {
    if (!memberships) return

    MembershipsCreate(memberships.map(membership =>
      <TouchableMenu
        containerStyle={{
          marginBottom: 15,
        }}
        style={{
          borderRadius: 30,
        }}
        onProceed={async () => {
          setErrorMsg("")
          setSuccessMsg("")

          try {
            console.log("delete!")
            await deleteSubscription(cache, { gymIds: [membership.id] })
            setSuccessMsg("Subscription canceled!")
          } catch (err) {
            setErrorMsg(err.message)
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
          <CloseButton
            containerStyle={styles.X}
            onPress={() => setPopup(false)}
          />
          <View style={{ paddingHorizontal: 10 }}>
            <ScrollView>
              {PastTransactions}
              <View style={{ height: 10 }} />
            </ScrollView>
          </View>
        </CustomPopup>}

      <ProfileLayout
        data={{ name: user.name, iconUri: user.icon_uri }}
      >
        {errorMsg
          ? <Text style={{ color: "red" }}>{errorMsg}</Text>
          : null}
        {successMsg
          ? <Text style={{ color: "green" }}>{successMsg}</Text>
          : null}

        {Memberships}

        <CustomButton
          style={styles.button}
          textStyle={styles.buttonText}
          title="View Past Transactions"
          onPress={async () => {
            setPopup("transactions")
            let pastTransactions = await retrievePastTransactions(cache)
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

      </ProfileLayout>
    </>
  )
}

const styles = StyleSheet.create({
  container: {},
  button: {
    paddingVertical: 10,
    marginTop: 0,
    marginBottom: 20,
    marginHorizontal: 30,
  },
  buttonText: {
    fontSize: 14,
  },
  X: {
    width: 35,
    height: 35,
    position: "absolute",
    right: 0,
    marginTop: 10,
    marginRight: 10,
  },
})