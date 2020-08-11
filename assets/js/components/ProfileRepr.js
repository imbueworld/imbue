import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import UserIcon from "./UserIcon"



export default function ProfileRepr(props) {
    return (
        <View style={[
            styles.container,
            props.style
        ]}>
            <UserIcon
                data={{ uri: props.data.iconUri }}
            />
            <Text
                style={styles.profileName}
                numberOfLines={1}
            >
                {/* Corepower Yoga */}
                {props.data.name}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    profileName: {
        marginTop: 15,
        fontSize: 22,
    },
})