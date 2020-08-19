import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import UserIcon from "./UserIcon"



export default function ProfileRepr(props) {
    let user = props.data

    return (
        <View style={[
            styles.container,
            props.style
        ]}>
            {/* <UserIcon
                data={{ uri: user.iconUri }}
            /> */}
            {/* <Text
                style={styles.profileName}
                numberOfLines={1}
            >
                {user.name}
            </Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        borderRadius: 999,
    },
    profileName: {
        marginTop: 15,
        fontSize: 22,
    },
})