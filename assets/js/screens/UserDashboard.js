import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Button } from 'react-native'

import { useDimensions } from '@react-native-community/hooks'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

import AppBackground from "../components/AppBackground"

import UserIcon from "../components/UserIcon"
import UserMenu from "../components/UserMenu"

import GymBadge from "../components/GymBadge"



export default function UserDashboard(props) {
    const [expanded, setExpanded] = useState(false)
    const { width, height } = useDimensions().window
    const slidingAnim = useRef(new Animated.Value(-1 * width)).current

    function sidePanelToggle() {
        if (expanded) {
            setExpanded(false)
            sidePanelSlideIn()
        }
        else {
            setExpanded(true)
            sidePanelSlideOut()
        }
    }

    function sidePanelSlideIn() {
        Animated.timing(slidingAnim, {
            toValue: -1 * width,
            duration: 500,
            useNativeDriver: false,
        }).start()
    }

    function sidePanelSlideOut() {
        Animated.timing(slidingAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
        }).start()
    }

    return (
        <View style={styles.container}>

            <TouchableOpacity
                    style={styles.sidePanelButton}
                    onPress={sidePanelToggle}
                >
                    {/* <Text style={{fontSize: 30}}>{expanded ? "<" : ">"}</Text> */}
                    <UserIcon style={{
                        marginTop: 32,
                        marginLeft: 32,
                        width: 64,
                        height: 64,
                    }}/>
            </TouchableOpacity>

            <Animated.View style={[
                styles.sidePanel,
                {
                    // width: width,
                    // height: height,
                    width: "100%",
                    height: "100%",
                    left: slidingAnim,
                }
            ]}>
                <UserMenu navigation={props.navigation} />
            </Animated.View>

            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />

            <GymBadge
                onPress={() => props.navigation.navigate("GymDescription")}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // minHeight: "100%", // This breaks sidePanel within <Anmimated.View>; minHeight does not synergize well with child position: "absolute" 's ?
        // flex: 1,
        // width: "100%",
        // height: "100%",
    },
    sidePanel: {
        position: "absolute",
        zIndex: 100,
    },
    sidePanelButton: {
        width: 50,
        height: 50,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 110,
    },
    map: {
        width: "100%",
        height: "100%",
        backgroundColor: "#addbff", // water fill before map loads
    },
})