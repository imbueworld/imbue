import React from 'react'
import {SafeAreaView,  StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native'

import { colors } from "../contexts/Colors"

import AppBackground from "../components/AppBackground"

import CompanyLogo from "../components/CompanyLogo"
import CustomButton from "../components/CustomButton"
import CustomCapsule from '../components/CustomCapsule'
import { FONTS } from '../contexts/Styles'
import GoBackButton from '../components/buttons/GoBackButton'
import config from '../../../App.config'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function MemberHome(props) {
    function signUp() {
        props.navigation.navigate("SignUp")
    }

    function partnerSignUp() {
        props.navigation.navigate("PartnerSignUp")
    }

    return (
        <ScrollView alwaysBounceVertical={false} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
            <GoBackButton containerStyle={styles.GoBackButton} />
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
                 }}>Member</Text>
                <CustomButton
                    style={{
                        marginTop: 20,
                        marginBottom: 0,
                    }}
                    onPress={signUp}
                    title="Sign Up"
                />
                <CustomButton
                    styleIsInverted
                    style={{
                        marginTop: 20,
                        marginBottom: 0,
                    }}
                    title="Login"
                    onPress={() => props.navigation.navigate("Login")}
                />
            </CustomCapsule>

            </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        // minHeight: "100%",
        backgroundColor: "#F9F9F9",
        // alignItems: "center",
    },
    GoBackButton: {
        ...config.styles.GoBackButton_screenDefault,
    },
    container: {
        width: "80%",
        marginBottom: 50,
        backgroundColor: "#F9F9F9",
    },
})