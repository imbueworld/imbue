import React from 'react'
import { View, Text } from 'react-native'
import { colors } from '../contexts/Colors'
import { publicStorage } from '../backend/HelperFunctions'
import Icon from './Icon'
import { fonts } from '../contexts/Styles'



export default function AttendeeCard({ icon_uri, first, last }) {
    return (
        <View style={{
            flexDirection: "row",
            flexWrap: "nowrap",
            height: 72,
            paddingLeft: 9,
            paddingRight: "6%",
            // paddingHorizontal: "6%",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#00000012",
            borderColor: colors.gray,
            borderWidth: 1,
            borderRadius: 40,
        }}>
            <Icon
                containerStyle={{
                    width: 54,
                    height: 54,
                    borderRadius: 999,
                    overflow: "hidden",
                }}
                source={{ uri: publicStorage(icon_uri) }}
            />
            <Text style={{
                flex: 1,
                textAlign: "center",
                fontSize: 18,
                fontFamily: fonts.default,
            }}>{`${first || ""}${last ? " " : ""}${last || ""}`}</Text>
        </View>
    )
}