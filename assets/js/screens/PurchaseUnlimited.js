import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'

import AppBackground from "../components/AppBackground"
import CompanyLogo from "../components/CompanyLogo"

import CustomText from "../components/CustomText"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"
import CustomBar from "../components/CustomBar"
import CustomPopup from '../components/CustomPopup'

import CreditCardSelection from '../components/CreditCardSelection'

import { retrievePaymentMethods, retrieveMemberships, retrieveUserData } from '../backend/CacheFunctions'
import { purchaseMemberships } from '../backend/BackendFunctions'



export default function PurchaseUnlimited(props) {
    let cache = props.route.params.cache
    console.log(cache.user.active_memberships)

    const [CCData, setCCData] = useState([])
    const [membershipData, setMembershipData] = useState(null)

    const [hasMembership, setHasMembership] = useState(null)
    const [selectedCard, selectCard] = useState(null)
    const [popup, setPopup] = useState(null)

    useEffect(() => {
        const init = async() => {
            let userData = await retrieveUserData(cache)
            let membershipData = await retrieveMemberships(cache, {
                membershipIds: ["imbue"]
            })

            setMembershipData(membershipData)
            setHasMembership(userData.active_memberships.includes(membershipData.id))
        }
        init()
    }, [])

    useEffect(() => {
        const init = async() => {
            setCCData( await retrievePaymentMethods(cache) )
        }
        init()
    }, [selectedCard])

    return (
        <>
        { popup !== "purchase" ? null :
        <CustomPopup
            onX={() => setPopup(null)}
        >
            <Text>Please confirm your purchase of ${membershipData.price}</Text>
            <View style={{
                flexDirection: "row",
            }}>
                <CustomButton
                    style={{
                        flex: 1,
                    }}
                    title="Confirm"
                    onPress={async() => {
                        console.log(`${membershipData.id} == ${selectedCard} == ${membershipData.price}`)
                        await purchaseMemberships(cache, {
                            membershipIds: [membershipData.id],
                            creditCardId: selectedCard,
                            price: membershipData.price,
                            description: `Imbue Universal Gym Membership`,
                        })
                        setHasMembership(true)
                        setPopup(null)
                    }}
                />
                <CustomButton
                    style={{
                        flex: 1,
                    }}
                    title="Cancel"
                    onPress={() => setPopup(null)}
                />
            </View>
        </CustomPopup>}

        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />

            <CustomCapsule style={styles.container}>
            
                <CompanyLogo
                    style={{
                        width: 300,
                        height: 200,
                    }}
                />

                <CustomText containerStyle={{marginBottom: 10}}>
                    {`$199\n`+
                    `Unlimited access to all facilities in our network.\n`+
                    `Unlimited access to online & in studio.`}
                </CustomText>

                <CustomBar />


                { !hasMembership
                ?   <>
                    <CustomCapsule style={{
                        paddingTop: 5,
                        paddingBottom: 15,
                    }}>
                        <CreditCardSelection
                            data={CCData}
                            selectedCard={selectedCard}
                            selectCard={selectCard}
                        />
                    </CustomCapsule>

                    <CustomButton
                        style={{
                            opacity: selectedCard ? 1 : 0.5,
                        }}
                        title="Purchase"
                        onPress={() => {
                            if (selectedCard) setPopup("purchase")
                        }}
                    />
                    </>

                :   <Text style={{ color: "green" }}>[V] You have the Imbue Universal Gym Membership!</Text>}
                
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
        </>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {
        width: "85%",
        marginVertical: 50,
        paddingTop: 0,
        paddingBottom: 0,
        alignSelf: "center",
    },
    buttonSmall: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 999,
    }
})