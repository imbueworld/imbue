import React, { useEffect, useState } from 'react'
import { ScrollView, View, Text } from 'react-native'

import CustomCapsule from "./CustomCapsule"
import AttendeeCard from './AttendeeCard'
import { cache } from '../backend/CacheFunctions'
import { fonts } from '../contexts/Styles'



export default function ParticipantList(props) {
    const [ptcs, setPtcs] = useState([])

    useEffect(() => {
        cache("livestream/functions/setParticipantsList").set(setPtcs)
    }, [])

    useEffect(() => {
        let ptcs = cache("livestream/participants").get()
        setPtcs(ptcs)
    }, [])

    const filteredPtcs = ptcs.filter(ptc => ptc.here)

    const Participants = filteredPtcs.map(({ name, icon_uri, uid }, idx) =>
        <View key={idx} style={{
            marginTop: idx !== 0 ? 10 : 0,
        }}>
            <AttendeeCard key={uid} {...{
                first: name,
                icon_uri,
            }}/>
        </View>
    )

    return (
        <CustomCapsule
            containerStyle={props.containerStyle}
            innerContainerStyle={{
                height: "100%",
            }}
        >
            <Text style={{
                marginTop: 20,
                marginBottom: 10,
                alignSelf: "center",
                fontSize: 20,
                fontFamily: fonts.default,
            }}>Users Participating</Text>
            <ScrollView>
                <View style={{
                    paddingVertical: 15,
                }}>
                    { Participants }
                </View>
            </ScrollView>
        </CustomCapsule>
    )
}