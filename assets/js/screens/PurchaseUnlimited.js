import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"
import CompanyLogo from "../components/CompanyLogo"

import CustomText from "../components/CustomText"
import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"



export default function Component(props) {
    const Bar = 
        <View style={{
            marginTop: 15,
            borderColor: "gray",
            borderTopWidth: 1,
        }}/>
    
    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <AppBackground />
            <View style={styles.container}>
                <CompanyLogo
                    style={{
                        height: 200,
                    }}
                />

                <CustomText>
                    {`$199\n`+
                    `Unlimited access to all facilities in our network.\n`+
                    `Unlimited access to online & in studio.`}
                </CustomText>

                {Bar}

                <CustomButton
                    title="Past Credit Cards"
                />

                {Bar}
                
                <CustomTextInput
                    placeholder="Credit Card Number"
                />
                <CustomTextInput
                    placeholder="CCV"
                />
                <CustomTextInput
                    placeholder="Expire Date"
                />
                <CustomTextInput
                    placeholder="ZIP Code"
                />
                <CustomButton
                    title="Purchase"
                />
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
})