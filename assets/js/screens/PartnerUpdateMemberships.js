import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import CustomTextInput from "../components/CustomTextInput"
import CustomText from "../components/CustomText"



export default function PartnerUpdateMemberships(props) {
    const [priceUnlimited, setPriceUnlimited] = useState("$99")
    const [priceSingle, setPriceSingle] = useState("$99")

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
                <Text style={styles.sectionLabel}>{"Memberships & Pricing"}</Text>
                <View style={styles.row}>
                    <CustomText style={styles.rowLabel}>
                        Unlimited Membership
                    </CustomText>
                    <CustomTextInput style={styles.rowPrice}
                        placeholder="Enter price..."
                        value={priceUnlimited}
                        onChangeText={text => setPriceUnlimited(text)}
                    />
                </View>
                <View style={styles.row}>
                    <CustomText style={styles.rowLabel}>
                        Single Class
                    </CustomText>
                    <CustomTextInput style={styles.rowPrice}
                        placeholder="Enter price..."
                        value={priceSingle}
                        onChangeText={text => setPriceSingle(text)}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        height: "100%",
    },
    container: {
        width: "85%",
        alignSelf: "center",
    },
    sectionLabel: {
        fontSize: 20,
        alignSelf: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "lightgray",
        borderRadius: 999,
        marginVertical: 8,
    },
    rowLabel: {
        paddingVertical: 15,
        paddingLeft: 15,
        fontSize: 20,
    },
    rowPrice: {
        paddingVertical: 15,
        marginVertical: 0, // This should be eventually removed, when margin is removed from <CustomTextField/>
        borderLeftWidth: 1,
        borderColor: "black",
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        fontSize: 20,
    },
})