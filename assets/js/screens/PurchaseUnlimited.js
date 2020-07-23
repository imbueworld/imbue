import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"
import CompanyLogo from "../components/CompanyLogo"

import CustomText from "../components/CustomText"
import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"

import CreditCardInput from "../components/CreditCardInput"



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

                <CustomCapsule
                    style={{
                        paddingTop: 0,
                    }}
                >
                
                    <CompanyLogo
                        style={{
                            width: 300,
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
                    
                    <CreditCardInput />
                    <CustomButton
                        title="Purchase"
                    />

                </CustomCapsule>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        height: "110%",
    },
    container: {
        width: "85%",
        alignSelf: "center",
    },
})