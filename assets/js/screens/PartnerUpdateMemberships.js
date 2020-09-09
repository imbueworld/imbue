import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomText from "../components/CustomText"
import CustomButton from "../components/CustomButton"
import { retrieveUserData, retrieveGyms, retrieveGymsByIds } from '../backend/CacheFunctions'
import { currencyFromZeroDecimal } from '../backend/HelperFunctions'
import { addDataToGym, updateGym } from '../backend/BackendFunctions'
import { colors } from '../contexts/Colors'
import { fonts, FONTS } from '../contexts/Styles'



function validateInput(inp) {
    const err = new Error("Check price formatting.")

    if (inp[0] !== "$") throw err
    else inp = inp.slice(1)

    let split = inp.split(".")
    let [a, b] = split
    if (b) {
        b = b.slice(0, 2)
        if (b.length < 2) b = `${b}0`
    }
    else b = "00"

    return Number.parseInt(`${a}${b}`)
}



export default function PartnerUpdateMemberships(props) {
    let cache = props.route.params.cache
    // let gymId = props.route.params.gymId

    const [r, refresh] = useState(0)
    const [errorMsg, setErrorMsg] = useState("")
    const [successMsg, setSuccessMsg] = useState("")

    const [user, setUser] = useState(null)
    const [gym, setGym] = useState(null)
    const [priceUnlimited, setPriceUnlimited] = useState(null)

    useEffect(() => {
        const init = async() => {
            let user = await retrieveUserData(cache)
            setUser(user)
            // Currently operates on the premise, that there is no more than ONE gym per partner
            let gym = ( await retrieveGymsByIds(cache, { gymIds: [user.associated_gyms[0]] }) )[0]
            setGym(gym)
            setPriceUnlimited(`$${currencyFromZeroDecimal(gym.membership_price)}`)
        }
        init()
    }, [r])

    if (!user) return <View />

    return (
        <ProfileLayout
            innerContainerStyle={{
                paddingBottom: 10,
            }}
            data={{ name: user.name, iconUri: user.icon_uri_full }}
        >
            
            <Text style={{
                alignSelf: "center",
                paddingBottom: 10,
                fontSize: 20,
                // fontFamily: fonts.default,
                ...FONTS.subtitle,
            }}>{"Memberships & Pricing"}</Text>

            {errorMsg
            ? <Text style={{ color: "red" }}>{errorMsg}</Text>
            : <Text style={{ color: "green" }}>{successMsg}</Text>}

            <View style={styles.row}>
                <Text style={styles.label}>
                    Online Membership
                </Text>
                <CustomTextInput
                    style={styles.price}
                    containerStyle={styles.priceContainer}
                    // placeholder="Enter price..."
                    value={priceUnlimited}
                    onChangeText={text => {
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
                    setErrorMsg("")

                    try {
                        let price = validateInput(priceUnlimited)
                        await updateGym(cache, {
                            gymId: gym.id,
                            doc: { membership_price: price }
                        })
                        setSuccessMsg("Membership updated.")
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
    row: {
        marginVertical: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 30,
    },
    label: {
        flex: 1,
        paddingVertical: 20,
        paddingLeft: 20,
        alignSelf: "center",
        // fontFamily: fonts.default,
        ...FONTS.body,
    },
    priceContainer: {
        flex: 1,
        marginRight: 10,
        alignSelf: "center",
        borderRadius: 30,
    },
    price: {
        fontSize: 20,
    },
})