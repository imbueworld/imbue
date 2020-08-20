import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

// import GymIcon from "./GymIcon"
import UserIcon from "./UserIcon"

import CustomCapsule from "./CustomCapsule"
import { colors } from '../contexts/Colors'
import Icon from './Icon'
import CloseButton from './CloseButton'
import { fonts } from '../contexts/Styles'



export default function GymBadge(props) {
    return (
        <View style={[ styles.container, props.containerStyle ]}>

            <View
                style={{
                    padding: 12,
                    backgroundColor: "#FFFFFF80",
                    borderRadius: 40,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                }}
            >
                <View style={styles.infoContainer}>

                    <UserIcon
                        style={{
                            width: 75,
                            height: 75,
                        }}
                        data={{ uri: props.iconUri }}
                    />
                    <View style={styles.desc}>
                        <Text style={styles.name} numberOfLines={1}>{props.name}</Text>
                        <Text style={styles.slogan} numberOfLines={4}>{props.desc}</Text>
                    </View>
                    
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.font}>
                        {props.rating}
                    </Text>
                    <Text style={styles.font}>
                        {props.relativeDistance}
                    </Text>
                </View>

            </View>

            <TouchableOpacity
                style={styles.moreInfoContainer}
                onPress={props.onMoreInfo}
            >
                <Text
                    style={{
                        ...styles.moreInfoText,
                        ...styles.font,
                    }}
                >
                    More Info
                </Text>
            </TouchableOpacity>

            <CloseButton
                containerStyle={styles.X}
                onPress={props.onX}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "88%",
        position: "absolute",
        alignSelf: "center",
    },
    infoContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    desc: {
        flex: 1,
        marginHorizontal: 20,
        alignItems: "center",
        textAlign: "justify", // Android reqs: Android Oreo (8.0) or above (API level >= 26)
    },
    name: {
        fontSize: 20,
        fontFamily: fonts.default,
    },
    slogan: {
        fontSize: 15,
        fontFamily: fonts.default,
    },
    // subInfoContainer: {},
    moreInfoContainer: {
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: "#FFFFFFD0",
        borderColor: `${colors.gray}80`,
        borderTopWidth: 1,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    moreInfoText: {
        fontSize: 13,
    },
    font: {
        fontFamily: fonts.default,
    },
    X: {
        width: 35,
        height: 35,
        position: "absolute",
        right: 0,
        marginTop: 10,
        marginRight: 10,
    },
})