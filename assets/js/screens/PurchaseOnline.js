import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"
import ProfileRepr from "../components/ProfileRepr"

import CustomSelectButton from "../components/CustomSelectButton"
import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"

import CreditCardInput from "../components/CreditCardInput"



export default function PurchaseOnline(props) {
    const Bar =
        <View style={{
            marginVertical: 15,
            borderColor: "gray",
            borderTopWidth: 1,
        }}/>
    
    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <AppBackground />
            <View style={{
                top: 50,
            }}>
                <ProfileRepr
                    style={{
                        position: "absolute",
                        alignSelf: "center",
                        zIndex: 100,
                    }}
                />
                
                <View style={styles.container}>
                    <CustomCapsule
                        style={{
                            paddingTop: 100,
                            top: 150,
                        }}
                    >

                        <CustomSelectButton
                            options={{single: "Single Class\n$9", membership: "Membership\n$50"}}
                        />

                        {Bar}

                        <CreditCardInput />
                        <CustomButton
                            title="Purchase"
                        />

                    </CustomCapsule>
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
})