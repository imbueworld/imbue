import React from 'react'
import { StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native'

import { colors } from "../contexts/Colors"

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"
import CustomButton from "../components/CustomButton"
import CustomCapsule from '../components/CustomCapsule'
import { FONTS } from '../contexts/Styles'
import GoBackButton from '../components/buttons/GoBackButton'
import config from '../../../App.config'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function PartnerHome(props) {
    function signUp() {
        props.navigation.navigate("SignUp")
    }

    function partnerSignUp() {
        props.navigation.navigate("PartnerSignUp")
    }


    function login() {
        props.navigation.navigate("LoginPartner")
    }

    return (
        <ScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
            <GoBackButton containerStyle={styles.GoBackButton} />
            <AppBackground />
            <CompanyLogo
                containerStyle={{
                    top: 10, 
                    position: "absolute",
                    alignSelf: "center",
                }}
            /> 
        
            <CustomCapsule
                containerStyle={{
                    width: "88%",
                    alignSelf: "center",
                    marginBottom: 50,
                    marginTop: hp('68%'),
                }}
            >
                <Text style={{
                        marginTop: 0,
                        marginBottom: 0,
                        color: colors.gray,
                        textAlign: "center",
                        fontSize: 18,
                        ...FONTS.body
                 }}>Influencer</Text>
                <CustomButton
                    style={{
                        marginTop: 20,
                        marginBottom: 0,
                    }}
                    onPress={() => props.navigation.navigate("PartnerApply")}
                    title="Apply"
                />
                <CustomButton
                    styleIsInverted
                    style={{
                        marginTop: 20,
                        marginBottom: 0,
                    }}
                    title="Login"
                    onPress={login}
                />
            </CustomCapsule>

            </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
        backgroundColor: "#F9F9F9",
        // alignItems: "center",
    },
    GoBackButton: {
        ...config.styles.GoBackButton_screenDefault,
        marginTop: 10
    },
    container: {
        width: "80%",
        marginBottom: 50,
        backgroundColor: "#F9F9F9",
    },
})