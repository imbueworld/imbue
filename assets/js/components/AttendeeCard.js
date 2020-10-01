import React, { useState, useEffect } from 'react'
import { View, Text } from 'react-native'
import { colors } from '../contexts/Colors'
import { publicStorage } from '../backend/BackendFunctions'
import Icon from './Icon'
import { FONTS } from '../contexts/Styles'



export default function AttendeeCard({ icon_uri, first, last }) {
    // const [iconUri, setIconUri] = useState("")

    // useEffect(() => {
    //     const init = async () => {
    //         let iconUri = await publicStorage(icon_uri)
    //         setIconUri(iconUri)
    //     }
    //     init()
    // }, [])

    return (
        <View style={{
            flexDirection: "row",
            flexWrap: "nowrap",
            height: 72,
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.buttonFill,
            borderWidth: 1,
            borderRadius: 40,
        }}>
            <Icon
                containerStyle={{
                    width: 54,
                    height: 54,
                    position: "absolute",
                    left: 9,
                    alignSelf: "center",
                    borderRadius: 999,
                    overflow: "hidden",
                }}
                source={{ uri: icon_uri/*iconUri*/ }}
            />
            <Text style={{
                position: "absolute",
                width: "100%",
                flexShrink: 1,
                color: colors.buttonAccent,
                textAlign: "center",
                fontSize: 18,
                ...FONTS.body,
            }}>{`${first || ""}${last ? " " : ""}${last || ""}`}</Text>
        </View>
    )
}