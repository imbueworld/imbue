import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import CustomButton from "../components/CustomButton"
import MembershipPopup from '../components/popups/MembershipPopup'
import PopupPurchase from '../components/popups/PopupPurchase'
import MembershipApprovalBadge from '../components/MembershipApprovalBadge'
import MembershipApprovalBadgeImbue from '../components/MembershipApprovalBadgeImbue'

import { retrieveUserData, retrieveMemberships, retrieveGymsByIds } from '../backend/CacheFunctions'
import { purchaseMemberships } from "../backend/BackendFunctions"
import { colors } from '../contexts/Colors'
import GymLayout from '../layouts/GymLayout'
import { setWaiter } from "../backend/HelperFunctions"



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
    let cache = props.route.params.cache
    let gymId = props.route.params.gymId

    const [gym, setGym] = useState(null)

    const [Genres, GenresCreate] = useState(null)
    const [Desc, DescCreate] = useState(null)
    const [Name, NameCreate] = useState(null)

    const [popup, setPopup] = useState(false)

    const [hasMembership, setHasMembership] = useState(null)
    // const [imbueMembership, setImbueMembership] = useState(null)
    const [selectedCard, selectCard] = useState(null)

    useEffect(() => {
        const init = async () => {
            setWaiter(async () => {
                let gyms = await retrieveGymsByIds(cache, { gymIds: [gymId] })
                setGym(gyms[0])
            }, cache, 10000)
        }
        init()
    }, [popup])

    useEffect(() => {
        if (!gym) return

        const init = async () => {
            const user = await retrieveUserData(cache)

            let imbueMembership = ( await retrieveGymsByIds(cache, {
                gymIds: ["imbue"]
            }) )[0]
            // setImbueMembership(imbueMembership)
            
            let membership =
                user.active_memberships.includes(imbueMembership.id)
                    ? "imbue"
                    : user.active_memberships.includes(gym.id)
                        ? "gym"
                        : false
            setHasMembership(membership)
        }
        init()
    }, [gym])

    useEffect(() => {
        if (!gym) return

        GenresCreate(
            <View style={styles.genreContainer}>
                { gym.genres.map((txt, idx) =>
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
                    {gym.description}
                </Text>
            </View>
        )
        NameCreate(
            <View style={styles.nameContainer}>
                <Text style={styles.nameText}>{gym.name}</Text>
            </View>
        )
    }, [gym])

    function openClassesSchedule() {
        props.navigation.navigate(
            "ScheduleViewer", { gymId })
    }

    if (!gym) return <View><Text style={{fontSize: 50}}>Loading!</Text></View>

    return (
        <>
        { popup !== "membership" ? null :
        <MembershipPopup
            data={{
                name: gym.name
            }}
            onProceed={() => setPopup("buy")}
            onX={() => setPopup(false)}
        />}

        { popup !== "buy" ? null :
        <PopupPurchase
            cache={cache}
            // data={{ id: gymData.id , price: gymData.membership_price }}
            popupText={`If you would like to confirm your purchase of ${gym.membership_price}, select your payment method.`}
            selectedCard={selectedCard}
            selectCard={selectCard}
            onProceed={async() => {
                if (selectedCard) {
                    await purchaseMemberships(cache, {
                        membershipIds: [gym.id],
                        creditCardId: selectedCard,
                        price: gym.membership_price,
                        description: `Gym Online Membership for ${gym.name}`,
                    })
                    setPopup(false)
                }
            }}
            onX={() => setPopup(false)}
        />}

        {/* <View style={{ height: "100%" }}> */}
        <GymLayout
            data={gym}
        >
        {/* <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground /> */}

            {/* <CustomCapsule
                style={styles.container}
                innerContainerStyle={styles.innerContainer}
            > */}

                {/* <Image
                    style={styles.gymImg}
                    source={require("../components/img/yoga.png")}
                /> */}
                
                {/* <View style={{
                    paddingHorizontal: 10,
                }}> */}
                    {Name}
                    {Genres}
                    {Desc}

                    <CustomButton
                        style={styles.button}
                        title="Visit Classes"
                        onPress={openClassesSchedule}
                    />

                    { hasMembership ? null :
                    <>
                    <CustomButton
                        style={styles.button}
                        title="Get Membership"
                        onPress={() => setPopup("membership")}
                    />
                    <CustomButton
                        style={[styles.button, {
                            marginBottom: 10,
                        }]}
                        title="Get Imbue Universal Membership"
                        onPress={() => props.navigation.navigate("PurchaseUnlimited")}
                    />
                    </>}
                    
                    { hasMembership !== "gym" ? null :
                    <MembershipApprovalBadge
                        containerStyle={{
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                        data={gym}
                    />}

                    { hasMembership !== "imbue" ? null :
                    <MembershipApprovalBadgeImbue
                        containerStyle={{
                            marginTop: 10,
                            marginBottom: 10,
                        }}
                        data={gym}
                    />}
                {/* </View> */}

            {/* </CustomCapsule>
        </ScrollView> */}
        </GymLayout>
        {/* </View> */}
        </>
    )
}

const styles = StyleSheet.create({
    // scrollView: {
    //     minHeight: "100%",
    // },
    // container: {
    //     width: "88%",
    //     marginVertical: 30,
    //     alignSelf: "center",
    // },
    // innerContainer: {
    //     paddingHorizontal: 0,
    // },
    // gymImg: {
    //     width: "100%",
    //     height: "100%",
    //     height: 300,
    //     borderRadius: 30,
    //     borderBottomLeftRadius: 0,
    //     borderBottomRightRadius: 0,
    // },
    button: {
        // marginVertical: 20,
        marginTop: 10,
        marginBottom: 0,
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
})