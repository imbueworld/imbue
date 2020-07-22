import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import CustomButton from "./CustomButton"



export default function UserMenu(props) {
    function classes() {
        props.navigation.navigate("UserClasses")
    }
    function memberships() {
        props.navigation.navigate("UserMemberships")
    }
    function profileSettings() {
        props.navigation.navigate("ProfileSettings")
    }
    function paymentSettings() {
        props.navigation.navigate("PaymentSettings")
    }

    return (
        <View style={styles.container}>
            <View>
                <Text>(Profile Representation)</Text>
            </View>
            <View>
                <CustomButton onPress={classes}>My Classes</CustomButton>
                <CustomButton onPress={memberships}>Manage Memberships</CustomButton>
                <CustomButton onPress={profileSettings}>Profile Settings</CustomButton>
                <CustomButton onPress={paymentSettings}>Payment Settings</CustomButton>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})