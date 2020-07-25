import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"
import CompanyLogo from "../components/CompanyLogo"

import CustomText from "../components/CustomText"
import CustomTextInput from "../components/CustomTextInput"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"
import CustomBar from "../components/CustomBar"

import CreditCardInput from "../components/CreditCardInput"



export default function Component(props) {
    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />

            <CustomCapsule style={styles.container}>
            
                <CompanyLogo
                    style={{
                        width: 300,
                        height: 200,
                    }}
                />

                <CustomText containerStyle={{marginBottom: 10}}>
                    {`$199\n`+
                    `Unlimited access to all facilities in our network.\n`+
                    `Unlimited access to online & in studio.`}
                </CustomText>

                <CustomBar />

                <CustomButton
                    title="Past Credit Cards"
                />

                <CustomBar />
                
                <CreditCardInput />
                <CustomButton
                    title="Purchase"
                />

            </CustomCapsule>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        width: "85%",
        marginVertical: 50,
        paddingTop: 0,
        paddingBottom: 0,
        alignSelf: "center",
    },
})