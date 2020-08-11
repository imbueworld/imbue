import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'

import AppBackground from "../components/AppBackground"

import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"
import MembershipPopup from '../components/popups/MembershipPopup'
import PopupPurchase from '../components/popups/PopupPurchase'

import firebase from "firebase/app"
import "firebase/functions"
import { retrieveUserData, retrieveMemberships } from '../backend/CacheFunctions'
import { purchaseMemberships } from "../backend/BackendFunctions"
import { colors } from '../contexts/Colors'



// /**
//  * 1.   Charges user
//  * 2.   adds gymIds to active_memberships for user in users collection
//  */
// async function purchaseMembership(gymIds, creditCardId, price) {
//     console.log("gymIds", gymIds)
//     try {
//         await firebase.functions().httpsCallable("chargeCustomer")({ cardId: creditCardId, amount: price })
//         await firebase.functions().httpsCallable("registerMemberships")({ gymIds })
//     } catch(err) {
//         console.log(err.message)
//         throw new Error("Something prevented the action.")
//     }
// }



export default function GymDescription(props) {
    console.log("[GYM DESCRIPTION]")
    let cache = props.route.params.cache
    let gymData = props.route.params.data

    const [Genres, GenresCreate] = useState(null)
    const [Desc, DescCreate] = useState(null)
    const [Name, NameCreate] = useState(null)

    const [popup, setPopup] = useState(false)

    const [hasMembership, setHasMembership] = useState(null)
    const [imbueMembership, setImbueMembership] = useState(null)
    const [selectedCard, selectCard] = useState(null)

    useEffect(() => {
        const init = async() => {
            let user = await retrieveUserData(cache)
            let imbueMembership = await retrieveMemberships(cache, {
                membershipIds: ["imbue"]
            })
            setImbueMembership(imbueMembership)

            let membership =
                user.active_memberships.includes(imbueMembership.id)
                    ? "imbue"
                    : user.active_memberships.includes(gymData.id)
                        ? "gym"
                        : false
            setHasMembership(membership)
        }
        init()
    }, [popup])

    useEffect(() => {

        GenresCreate(
            <View style={styles.genreContainer}>
                { gymData.genres.map((txt, idx) =>
                    <View
                        style={styles.genre}
                        key={idx}
                    >
                        <Text style={styles.genreText}>{txt}</Text>
                    </View>) }
            </View>
        )
    
        DescCreate(
            <View style={styles.descContainer}>
                <Text style={styles.descText}>
                    {gymData.description}
                </Text>
            </View>
        )

        NameCreate(
            <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{gymData.name}</Text>
            </View>
        )
    }, [])

    function openClassesSchedule() {
        props.navigation.navigate(
            "ScheduleViewer", { data: cache.gymClasses[gymData.id] })
    }

    return (
        <>
        { popup !== "membership" ? null :
        <MembershipPopup
            data={{
                name: gymData.name
            }}
            onProceed={() => setPopup("buy")}
            onX={() => setPopup(false)}
        />}

        { popup !== "buy" ? null :
        <PopupPurchase
            cache={cache}
            // data={{ id: gymData.id , price: gymData.membership_price }}
            popupText={`If you would like to confirm your purchase of ${gymData.membership_price}, select your payment method.`}
            selectedCard={selectedCard}
            selectCard={selectCard}
            onProceed={async() => {
                if (selectedCard) {
                    await purchaseMemberships(cache, {
                        membershipIds: [gymData.id],
                        creditCardId: selectedCard,
                        price: gymData.membership_price,
                        description: `Gym Online Membership for ${gymData.name}`,
                    })
                    setPopup(false)
                }
            }}
            onX={() => setPopup(false)}
        />}

        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />

            <CustomCapsule
                style={styles.container}
                innerContainerStyle={styles.innerContainer}
            >

                <Image
                    style={styles.gymImg}
                    source={require("../components/img/yoga.png")}
                />
                
                <View style={{
                    paddingHorizontal: 10,
                }}>
                    {Name}
                    {Genres}
                    {Desc}

                    <CustomButton
                        style={{
                            marginVertical: 20,
                        }}
                        title="Visit Classes"
                        onPress={openClassesSchedule}
                    />

                    { hasMembership ? null :
                    <>
                    <CustomButton
                        title="Get Membership"
                        onPress={() => setPopup("membership")}
                    />
                    <CustomButton
                        title="Get Imbue Universal Membership"
                        onPress={() => props.navigation.navigate("PurchaseUnlimited")}
                    />
                    </>}
                    
                    { hasMembership !== "gym" ? null :
                    <Text style={{ color: "green" }}>
                        [V] You have a membership for this gym!
                    </Text>}

                    { hasMembership !== "imbue" ? null :
                    <Text style={{ color: "purple" }}>
                        [V] You have the Imbue Universal Gym Membership!
                    </Text>}
                </View>

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
    innerContainer: {
        paddingHorizontal: 0,
    },
    nameContainer: {},
    nameText: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 24,
    },
    genreContainer: {
        marginTop: 20,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    genre: {
        marginRight: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    genreText: {
        fontSize: 14,
    },
    descContainer: {
        marginTop: 10,
        paddingHorizontal: 15,
        paddingVertical : 10,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    descText: {
        fontSize: 16,
        textAlign: "justify",
    },
    gymImg: {
        width: "100%",
        height: "100%",
        minHeight: 300,
        maxHeight: 300,
        borderRadius: 40,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    }
})