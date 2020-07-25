import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"
import ProfileRepr from "../components/ProfileRepr"

import CustomButton from "../components/CustomButton"
import CustomCapsule from "../components/CustomCapsule"
import CustomBar from "../components/CustomBar"
import ActiveMembershipBadge from "../components/ActiveMembershipsBadge"



export default function UserMemberships(props) {

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <AppBackground />
            <View style={{
                marginVertical: 50,
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
                            marginTop: 150,
                            paddingTop: 100,
                        }}
                    >

                        <ActiveMembershipBadge
                            name="Membership One"
                        />
                        <ActiveMembershipBadge
                            name="Membership Two"
                        />
                        <ActiveMembershipBadge
                            name="Membership Three"
                        />

                        <CustomBar />

                        <CustomButton
                            title="View Past Transactions"
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