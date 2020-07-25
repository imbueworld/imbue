import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomTextInput from "../components/CustomTextInput"
import CustomText from "../components/CustomText"
import CustomButton from "../components/CustomButton"



export default function PartnerUpdateMemberships(props) {
    const [priceUnlimited, setPriceUnlimited] = useState("$99")
    const [priceSingle, setPriceSingle] = useState("$99")

    return (
        <ProfileLayout capsuleStyle={styles.container}>
                
            <Text style={{
                fontSize: 20,
                alignSelf: "center",
                paddingBottom: 10,
            }}>{"Memberships & Pricing"}</Text>

            <View style={styles.row}>
                <CustomText containerStyle={styles.label}>
                    Unlimited Membership
                </CustomText>
                <CustomTextInput
                    style={styles.price}
                    containerStyle={styles.priceContainer}
                    placeholder="Enter price..."
                    value={priceUnlimited}
                    onChangeText={text => setPriceUnlimited(text)}
                />
            </View>

            <View style={styles.row}>
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
            </View>

            <CustomButton
                title="Save"
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
        borderRadius: 40,
    },
    label: {
        flex: 1,
        paddingVertical: 20,
        paddingLeft: 20,
        alignSelf: "center",
    },
    priceContainer: {
        flex: 1,
        paddingRight: 10,
        alignSelf: "center",
    },
    price: {
        fontSize: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        
        elevation: 5,
    },
})