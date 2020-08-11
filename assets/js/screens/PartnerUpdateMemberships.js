import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomText from "../components/CustomText"
import CustomButton from "../components/CustomButton"
import { retrieveUserData, retrieveGyms } from '../backend/CacheFunctions'
import { currencyFromZeroDecimal } from '../backend/HelperFunctions'
import { addDataToGym } from '../backend/BackendFunctions'



function validateInput(inp) {
    const err = new Error("Check price formatting.")

    if (inp[0] !== "$") throw err
    else inp = inp.slice(1)

    let split = inp.split(".")
    let [a, b] = split
    if (b) b = b.slice(0, 2)
    else b = "00"

    console.log(202, `${a}${b}`)
    return Number.parseInt(`${a}${b}`)
}



export default function PartnerUpdateMemberships(props) {
    let cache = props.route.params.cache
    let gymId = props.route.params.gymId

    const [r, refresh] = useState(0)
    const [errorMsg, setErrorMsg] = useState("")

    const [user, setUser] = useState(null)
    const [gym, setGym] = useState(null)
    const [priceUnlimited, setPriceUnlimited] = useState(null)

    useEffect(() => {
        const init = async() => {
            let user = await retrieveUserData(cache)
            // setUser(user)
            // Currently operates on the premise, that there is no more than ONE gym per partner
            let gym = ( await retrieveGyms(cache, { gymIds: [user.associated_gyms[0]] }) )[0]
            setGym(gym)
            setPriceUnlimited(`$${currencyFromZeroDecimal(gym.membership_price)}`)
        }
        init()
    }, [r])
    // const [priceSingle, setPriceSingle] = useState("$99")

    return (
        <ProfileLayout capsuleStyle={styles.container}>
            
            <Text style={{
                fontSize: 20,
                alignSelf: "center",
                paddingBottom: 10,
            }}>{"Memberships & Pricing"}</Text>

            <Text style={{ color: "red" }}>{errorMsg}</Text>

            <View style={styles.row}>
                <CustomText containerStyle={styles.label}>
                    Online Membership
                </CustomText>
                <CustomTextInput
                    style={styles.price}
                    containerStyle={styles.priceContainer}
                    // placeholder="Enter price..."
                    value={priceUnlimited}
                    onChangeText={text => {
                        console.log(text)
                        if (text.length <= 1) setPriceUnlimited("$")
                        if (!text.includes("$")) return
                        if (text.match(/[A-Za-z]/g)) return
                        let dots = text.match(/[.]/g)
                        if (dots) if (dots.length > 1) return
                        setPriceUnlimited(text)
                    }}
                />
            </View>

            {/* <View style={styles.row}>
                <CustomText containerStyle={styles.label}>
                    Single Class
                </CustomText>
                <CustomTextInput
                    style={styles.price}
                    containerStyle={styles.priceContainer}
                    placeholder="Enter price..."
                    value={priceSingle}
                    onChangeText={text => setPriceSingle(text)}
                />
            </View> */}

            <CustomButton
                title="Save"
                onPress={async() => {
                    try {
                        setErrorMsg("")
                        let price = validateInput(priceUnlimited)
                        await addDataToGym(cache, {
                            gymId: gym.id,
                            data: { membership_price: price }
                        })
                        refresh(r + 1)
                    } catch(err) {
                        setErrorMsg(err.message)
                    }
                }}
            />

        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        height: "100%",
    },
    container: {
        paddingBottom: 0,
    },
    row: {
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "lightgray",
        borderRadius: 30,
    },
    label: {
        flex: 1,
        paddingVertical: 20,
        paddingLeft: 20,
        alignSelf: "center",
    },
    priceContainer: {
        flex: 1,
        marginRight: 10,
        alignSelf: "center",
        borderRadius: 999,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        
        elevation: 5,
    },
    price: {
        fontSize: 20,
    },
})