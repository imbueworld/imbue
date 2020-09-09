import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomText from "../components/CustomText"
import CustomButton from "../components/CustomButton"
import { retrieveUserData, retrieveGymsByIds } from '../backend/CacheFunctions'
import { currencyFromZeroDecimal } from '../backend/HelperFunctions'
import { fonts, FONTS } from '../contexts/Styles'



export default function PartnerRevenueInfo(props) {
    let cache = props.route.params.cache

    const [user, setUser] = useState(null)
    const [gym, setGym] = useState(null)

    useEffect(() => {
        const init = async() => {
            let user = await retrieveUserData(cache)
            setUser(user)
            // Currently operates on the premise that each partner has only one gym
            let gym = await retrieveGymsByIds(cache, { gymIds: [user.associated_gyms[0]] })
            gym = gym[0]
            setGym(gym)
        }
        init()
    }, [])

    if (!user || !gym) return <View />

    return (
        <ProfileLayout
            innerContainerStyle={{
                paddingBottom: 10,
            }}
            data={{ name: user.name, iconUri: user.icon_uri_full }}
        >
            <CustomText
                style={styles.text}
                containerStyle={styles.textContainer}
                label="Revenue"
            >
                {`$${currencyFromZeroDecimal(user.revenue)}`}
            </CustomText>
            <CustomText
                style={styles.text}
                containerStyle={styles.textContainer}
                label="Member Count"
            >
                {gym.active_clients_memberships &&
                    gym.active_clients_memberships.length}
            </CustomText>

            <Text style={{
                paddingTop: 15,
                paddingBottom: 10,
                textAlign: "center",
                fontSize: 22,
                // fontFamily: fonts.default,
                ...FONTS.subtitle,
            }}>Payouts</Text>
            <CustomButton
                title="Bank Account"
            />
            <CustomButton
                title="Plaid"
            />
            
        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    text: {
        paddingVertical: 8,
        alignSelf: "center",
        fontSize: 22,
    },
    textContainer: {
        marginVertical: 10,
    },
})