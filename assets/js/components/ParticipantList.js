import React from 'react'
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native'

import CustomCapsule from "./CustomCapsule"



export default function ParticipantList(props) {
    const Participant = (props) => 
        <View style={styles.ptcContainer}>
            <Image
                style={styles.ptcIcon}
                source={props.iconUri}
            />
            <Text style={styles.ptcName}>{props.name}</Text>
        </View>
    

    const participants = props.data.map(({name, iconUri, profileId}) => 
        <Participant
            name={name}
            iconUri={iconUri}
            key={profileId}
        />
    )

    return (
        <CustomCapsule style={[
            styles.container,
            props.containerStyle,
        ]}>
            <ScrollView>
                <View /* First child, last child padding */ style={{
                    paddingVertical: 10,
                }}>
                    {participants}
                </View>
            </ScrollView>
        </CustomCapsule>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 0,
        overflow: "hidden",
    },
    ptcContainer: {
        marginVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "lightgray",
        borderRadius: 999,
    },
    ptcIcon: {
        width: 75,
        height: 75,
        margin: 10,
        borderRadius: 999,
    },
    ptcName: {
        flex: 1,
        textAlign: "center",
        fontSize: 20,
    },
})