import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import UserIcon from "./UserIcon"



export default function ProfileRepr(props) {
    return (
        <View style={[
            styles.container,
            props.style
        ]}>
            <UserIcon />
            <Text style={styles.profileName}>
                Corepower Yoga
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    profileName: {
        fontSize: 20,
    },
})