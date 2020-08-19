import React from 'react'
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native'

import CustomCapsule from "./CustomCapsule"
import { publicStorage } from "../backend/HelperFunctions"
import { colors } from '../contexts/Colors'



export default function ParticipantList(props) {
    const Participant = (props) => 
        <View style={styles.ptcContainer}>
            <Image
                style={styles.ptcIcon}
                source={{ uri: props.iconUri }}
            />
            <Text style={styles.ptcName}>{props.name}</Text>
        </View>
    
    const participants = props.data.map(({ name, icon_uri, uid }) => 
        <Participant
            name={name}
            iconUri={publicStorage(icon_uri)}
            key={uid}
        />
    )

    return (
        <CustomCapsule
            containerStyle={[
                styles.container,
                props.containerStyle,
            ]}
            innerContainerStyle={{
                height: "100%",
            }}
        >
            <ScrollView>
                <View style={{
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
    },
    ptcContainer: {
        marginVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "lightgray",
        borderWidth: 1,
        borderColor: colors.gray,
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