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
                    position: "static",
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
                        <Text>{"✰✰✰✰✰ (54)"}</Text>
                        <Text>2.1 miles</Text>
                    </View>
                </View>
            
            </CustomCapsule>

            <TouchableOpacity
                style={styles.moreInfoContainer}
            >
                <Text
                    style={styles.moreInfoText}
                >
                    More Info
                </Text>
            </TouchableOpacity>
        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        top: 500, // TEMP ADJUSTMENT
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
        alignItems: "center",
        backgroundColor: "#FFFFFFC0",
        borderColor: "gray",
        borderTopWidth: 1,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    moreInfoText: {
        paddingVertical: 10,
        fontSize: 13,
    },
})