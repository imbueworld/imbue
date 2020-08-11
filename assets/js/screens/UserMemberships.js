import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "../components/CustomButton"
import CustomPopup from "../components/CustomPopup"
import CustomBar from "../components/CustomBar"
import ActiveMembershipBadge from "../components/ActiveMembershipsBadge"
import { cancelMemberships } from '../backend/BackendFunctions'
import { retrievePastTransactions, retrieveMemberships, retrieveUserData } from '../backend/CacheFunctions'



export default function UserMemberships(props) {
    console.log("[USER MEMBERSHIPS]")
    let cache = props.route.params.cache

    const [r, refresh] = useState(0)
    const [errorMsg, setErrorMsg] = useState("")
    const [popup, setPopup] = useState(null)
    const [memberships, setMemberships] = useState(null)

    const [Memberships, MembershipsCreate] = useState(null)
    const [PastTransactions, PastTransactionsCreate] = useState(null)

    useEffect(() => {
        console.log("\n\n\n")
        const init = async() => {
            let user = await retrieveUserData(cache)
            setMemberships(
                await retrieveMemberships(cache, {
                    membershipIds: user.active_memberships
                })
            )
            console.log("done!")
            refresh(r + 1)
        }
        init()
    }, [])

    console.log("memberships", memberships)

    useEffect(() => {
        if (!r) return

        MembershipsCreate(memberships.map(membership =>
            <ActiveMembershipBadge
                data={membership}
                key={membership.id}
                onAction={async() => {
                    // Popup ...
                    try {
                        await cancelMemberships(cache, { membershipIds: [membership.id] })
                        setErrorMsg("")
                    } catch(err) {
                        setErrorMsg(err.message)
                    }
                }}
            />
        ))
    }, [r])

    return (
        <>
        { popup !== "transactions" ? null :
        <CustomPopup
            onX={() => setPopup(false)}
        >
            <ScrollView style={{
                height: "90%",
            }}>
                {PastTransactions}
            </ScrollView>
        </CustomPopup>}

        <ProfileLayout>

            <Text style={{ color: "red" }}>{errorMsg}</Text>
            {Memberships}

            {/* <CustomBar /> */}

            <CustomButton
                style={styles.button}
                textStyle={styles.buttonText}
                title="View Past Transactions"
                onPress={async() => {
                    setPopup("transactions")
                    PastTransactionsCreate(
                        ( await retrievePastTransactions(cache) ).map((transaction, idx) =>
                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                                key={idx}
                            >
                                <Text style={{ flex: 2 }}>{transaction.description}</Text>
                                <Text style={{ flex: 1 }}>{transaction.amount}</Text>
                            </View>
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
})