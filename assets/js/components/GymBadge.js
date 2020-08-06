import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

// import GymIcon from "./GymIcon"
import UserIcon from "./UserIcon"

import CustomCapsule from "./CustomCapsule"



export default function GymBadge(props) {
    return (
        <View style={styles.container}>

            <CustomCapsule
                style={{
                    backgroundColor: "#FFFFFF80",
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                }}
            >
                
                <View>
                    <View style={styles.infoContainer}>
                        <UserIcon style={{
                            width: 75,
                            height: 75,
                        }}/>
                        <View style={styles.desc}>
                            <Text style={styles.name}>Corepower Yoga</Text>
                            <Text style={styles.slogan}>Yoga classes for all!</Text>
                        </View>
                    </View>
                    <View style={styles.infoContainer}>
                        <Text>{props.rating}</Text>
                        <Text>{props.relativeDistance}</Text>
                    </View>
                </View>
            
            </CustomCapsule>

            <TouchableOpacity
                style={styles.moreInfoContainer}
                onPress={props.onMoreInfo}
            >
                <Text
                    style={styles.moreInfoText}
                >
                    More Info
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.X}
                onPress={props.onX}
            >
                <Text stlye={{fontSize: 20}}>X</Text>
            </TouchableOpacity>
        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        top: 450, // TEMP ADJUSTMENT
        width: "85%",
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
        alignItems: "center",
    },
    name: {
        fontSize: 20,
    },
    slogan: {
        fontSize: 15,
    },
    // subInfoContainer: {},
    moreInfoContainer: {
        paddingVertical: 10,
        alignItems: "center",
        backgroundColor: "#FFFFFFC0",
        borderColor: "gray",
        borderTopWidth: 1,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    moreInfoText: {
        fontSize: 13,
    },
    X: {
        width: 35,
        height: 35,
        position: "absolute",
        right: 0,
        marginTop: 10,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: 999,
    },
})