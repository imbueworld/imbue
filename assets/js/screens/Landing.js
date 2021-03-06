import React from 'react'
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native'

import { colors } from "../contexts/Colors"

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"
import CustomButton from "../components/CustomButton"
import CustomCapsule from '../components/CustomCapsule'
import { FONTS } from '../contexts/Styles'
import functions from '@react-native-firebase/functions'



export default function Landing(props) {
    function signUp() {
        props.navigation.navigate("SignUp")
    }

    function partnerSignUp() {
        props.navigation.navigate("PartnerSignUp")
    }

    // User home
    function memberHome() {
        props.navigation.navigate("MemberHome")
    }

    function partnerHome() {
        props.navigation.navigate("PartnerHome")
    }

    async function sendGridTest() {
        let acct_id = "acct_1I5i0OPXzRLgWwwY"

        const sendGridEmailPayoutPaid = functions().httpsCallable('sendGridEmailPayoutPaid')
        await sendGridEmailPayoutPaid(acct_id)
    }


    return (
        <ScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <CompanyLogo
                containerStyle={{
                    top: 0,
                    position: "absolute",
                    alignSelf: "center",
                }}
            />

            <CustomCapsule
                containerStyle={{
                    width: "88%",
                    alignSelf: "center",
                    marginBottom: 50,
                }}
            >

                {/* <CustomButton
                    style={{
                        marginTop: 10,
                        marginBottom: 0,
                    }}
                    onPress={sendGridTest}
                    title="test sendgrid"
                /> */}

                <Text style={{
                    marginTop: 0,
                    marginBottom: 0,
                    color: colors.gray,
                    textAlign: "center",
                    fontSize: 18,
                    ...FONTS.body

                }}>I'm:</Text>

                <CustomButton
                    style={{
                        marginTop: 10,
                        marginBottom: 0,
                    }}
                    onPress={memberHome}
                    title="member"
                />
                <Text style={{
                    marginTop: 5,
                    marginBottom: 0,
                    color: colors.gray,
                    textAlign: "center",
                    fontSize: 12,
                    ...FONTS.body

                }}>someone who loves taking fitness classes</Text>

                <CustomButton
                    styleIsInverted
                    style={{
                        marginTop: 10,
                        marginBottom: 0,
                    }}
                    title="influencer"
                    onPress={partnerHome}
                />
                <Text style={{
                    marginTop: 5,
                    marginBottom: 0,
                    color: colors.gray,
                    textAlign: "center",
                    fontSize: 12,
                    ...FONTS.body

                }}>someone who loves creating fitness content</Text>
            </CustomCapsule>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
        flexDirection: "column-reverse",
        backgroundColor: "#F9F9F9",
        // alignItems: "center",
    },
    container: {
        width: "80%",
        marginBottom: 50,
        backgroundColor: "#F9F9F9",
    },
})
