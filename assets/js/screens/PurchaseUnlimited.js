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
import { colors } from '../contexts/Colors'
import PopupPurchase from '../components/popups/PopupPurchase'
import MembershipApprovalBadgeImbue from '../components/MembershipApprovalBadgeImbue'



export default function PurchaseUnlimited(props) {
    let cache = props.route.params.cache
    console.log(cache.user.active_memberships)

    const [CCData, setCCData] = useState([])
    const [imbueMembership, setImbueMembership] = useState(null)

    const [hasMembership, setHasMembership] = useState(null)
    const [selectedCard, selectCard] = useState(null)
    const [popup, setPopup] = useState(null)

    useEffect(() => {
        const init = async() => {
            let userData = await retrieveUserData(cache)
            let memberships = await retrieveMemberships(cache, {
                membershipIds: ["imbue"]
            })
            let imbueMembership = memberships[0]

            setImbueMembership(imbueMembership)
            setHasMembership(userData.active_memberships.includes(imbueMembership.id))
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
        {/* { popup !== "purchase" ? null :
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
        </CustomPopup>} */}
        
        {popup === "buy" && imbueMembership ?
        <PopupPurchase
            cache={cache}
            popupText={``}
            selectedCard={selectedCard}
            selectCard={selectCard}
            onProceed={async () => {
                if (selectedCard) {
                    console.log("tap", imbueMembership.id)
                    await purchaseMemberships(cache, {
                        membershipIds: [imbueMembership.id],
                        creditCardId: selectedCard,
                        price: imbueMembership.price,
                        description: `Imbue Universal Gym Membership`,
                    })
                    setPopup(false)
                }
            }}
            onX={() => setPopup(false)}
        /> : null}

        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />

            <CustomCapsule style={styles.container}>
            
                <CompanyLogo
                    style={{
                        width: 300,
                        height: 200,
                    }}
                />

                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        {`$199\n`+
                        `Unlimited access to all facilities in our network. ` +
                        `Unlimited access to both online content & in studio classes.`}
                    </Text>
                </View>

                {/* <CustomBar /> */}


                { !hasMembership
                ?   <>
                    {/* <CreditCardSelection
                        data={CCData}
                        selectedCard={selectedCard}
                        selectCard={selectCard}
                    /> */}

                    <CustomButton
                        style={{
                            marginTop: 20,
                            marginBottom: 20,
                        }}
                        title="Purchase"
                        onPress={() => setPopup("buy")}
                    />
                    </>

                :   <MembershipApprovalBadgeImbue
                        containerStyle={{
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                    />}
                
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
        width: "88%",
        marginVertical: 30,
        alignSelf: "center",
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
    text: {
        textAlign: "justify",
        fontSize: 16,
    },
})