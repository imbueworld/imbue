import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'

import CustomCapsule from "./CustomCapsule"
import AttendeeCard from './AttendeeCard'
import { publicStorage } from '../backend/BackendFunctions'
import cache from '../backend/storage/cache'
import { FONTS } from '../contexts/Styles'
import { colors } from '../contexts/Colors'



export default function ParticipantList(props) {
    const [ptcs, setPtcs] = useState([])
    const [filteredPtcs, setFilteredPtcs] = useState([])

    useEffect(() => {
        cache("livestream/functions/setParticipantsList").set(setPtcs)
    }, [])

    useEffect(() => {
        let ptcs = cache("livestream/participants").get()
        setPtcs(ptcs)
    }, [])

    useEffect(() => {
        if (!ptcs.length) return

        const init = async () => {
            let filteredPtcs = ptcs.filter(ptc => ptc.here)

            let iconUriPromises = filteredPtcs.map(ptc => publicStorage(ptc.uid))
            let iconUris = await Promise.all(iconUriPromises)
            
            let iconUriPromises2 = iconUris.map(uri => uri === "" ? publicStorage("imbueProfileLogoBlack.png") : uri)
            iconUris = await Promise.all(iconUriPromises2)

            filteredPtcs.forEach((ptc, idx) => {
                ptc.icon_uri_full = iconUris[ idx ]
            })
            
            setFilteredPtcs(filteredPtcs)
        }
        init()
    }, [ptcs])

    const Participants = filteredPtcs.map(({ name, icon_uri_full, uid }, idx) =>
        <View key={idx} style={{
            marginTop: idx !== 0 ? 10 : 0,
        }}>
            <AttendeeCard key={uid} {...{
                first: name,
                icon_uri: icon_uri_full,
            }}/>
        </View>
    )

    return (
        <CustomCapsule
            containerStyle={{
                paddingHorizontal: 20,
                backgroundColor: colors.buttonAccent,
                borderRadius: 30,
                borderWidth: 1,
                borderColor: colors.buttonFill,
                overflow: "hidden",
                ...props.containerStyle,
            }}
            innerContainerStyle={{
                height: "100%",
            }}
        >
            <Text style={{
                marginTop: 20,
                marginBottom: 10,
                alignSelf: "center",
                ...FONTS.body,
                fontSize: 16,
            }}>People Participating</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{
                    paddingVertical: 15,
                }}>
                    { Participants }
                </View>
            </ScrollView>
        </CustomCapsule>
    )
}