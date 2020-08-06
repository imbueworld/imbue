import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated } from 'react-native'

import { useDimensions } from '@react-native-community/hooks'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import { mapStyle } from "../contexts/MapStyle"
import ProfileLayout from "../layouts/ProfileLayout"
// import AppBackground from "../components/AppBackground"

import UserIcon from "../components/UserIcon"
// import UserMenu from "../components/UserMenu"

import CustomButton from "../components/CustomButton"

import GymBadge from "../components/GymBadge"
import LogOut from "../components/LogOut"

import Firebase from "firebase/app"
import 'firebase/auth'



export default function UserDashboard(props) {
    // let expanded = false
    const [expanded, setExpanded] = useState(false)

    const { width, height } = useDimensions().window
    const slidingAnim = useRef(new Animated.Value(-1 * width)).current

    function sidePanelToggle() {
        if (expanded) {
            sidePanelSlideIn()
            // expanded = false
            setExpanded(false)
        }
        else {
            sidePanelSlideOut()
            // expanded = true
            setExpanded(true)
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

    const [currentMarkerId, setCurrentMarkerId] = useState(null)

    const markers = [
        {
            latlng: {
                latitude: 37.78825,
                longitude: -122.4324,
            },
            rating: "✰✰✰✰✰ (54)",
            relativeDistance: "2.1 miles",
            id: "999",
        },
    ]

    const currentlyShownGymBadge = markers.filter((marker) => marker.id === currentMarkerId).map((marker) =>
        <GymBadge
            rating={marker.rating}
            relativeDistance={marker.relativeDistance}
            onMoreInfo={() => props.navigation.navigate("GymDescription", {gymId: currentMarkerId})}
            onX={() => setCurrentMarkerId(null)}
        />
    )

    return (
        <View /*contentContainerStyle={styles.container}*/>

            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                // showsPointsOfInterest={false}
                // showsCompass={false}
                // showsBuildings={false}
                // showsTraffic={false}
                // showsIndoors={false}
                // showsIndoorLevelPicker={false}
                customMapStyle={mapStyle}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                {markers.map(marker =>
                    <Marker
                        coordinate={marker.latlng}
                        // title={marker.title}
                        // description={marker.description}
                        key={marker.id}
                        onPress={(e) => setCurrentMarkerId(marker.id)}
                    />
                )}
            </MapView>

            {currentlyShownGymBadge}

            <TouchableOpacity
                style={[
                    styles.sidePanelButtonContainer,
                    // {
                    //     display: expanded ? "none" : "flex",
                    // }
                ]}
                onPress={sidePanelToggle}
            >
                <UserIcon style={{
                    width: 64,
                    height: 64,
                    display: expanded ? "none" : "flex",
                }}/>
            </TouchableOpacity>

            {/* The Side Panel */}
            <Animated.View style={[
                styles.sidePanel,
                {
                    left: slidingAnim,
                }
            ]}>

                <ScrollView>

                    <TouchableOpacity
                        style={[
                            styles.sidePanelButtonContainer,
                            {
                                display: expanded ? "flex" : "none",
                            }
                        ]}
                        onPress={sidePanelToggle}
                    >
                        <UserIcon style={{
                            width: 64,
                            height: 64,
                            display: expanded ? "flex" : "none",
                        }}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logOutButtonContainer}
                        onPress={() => console.log("To-Do: Intuitively shows what the button does")}
                        onLongPress={() => {
                            Firebase.auth().signOut()
                            props.navigation.navigate("Home")
                            if (expanded) sidePanelToggle()
                        }}
                    >
                        <LogOut
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                            containerStyle={{
                                left: 1.35, // Make-up for the icon's flaw regarding centering
                                padding: 10,
                            }}
                        />
                    </TouchableOpacity>

                    <ProfileLayout capsuleStyle={{
                        paddingBottom: 0,
                    }}>

                        <CustomButton
                            title="My Classes"
                            onPress={() => props.navigation.navigate("UserClasses", {referrer: "UserDashboard"})}
                            />
                        <CustomButton
                            title="Manage Memberships"
                            onPress={() => props.navigation.navigate("UserMemberships", {referrer: "UserDashboard"})}
                        />
                        <CustomButton
                            title="Profile Settings"
                            onPress={() => props.navigation.navigate("ProfileSettings", {referrer: "UserDashboard"})}
                        />
                        <CustomButton
                            title="Payment Settings"
                            onPress={() => props.navigation.navigate("PaymentSettings", {referrer: "UserDashboard"})}
                        />

                    </ProfileLayout>

                </ScrollView>

            </Animated.View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // minHeight: "100%", // This breaks sidePanel within <Anmimated.View>; minHeight does not synergize well with child position: "absolute" 's ? ; Unless it's used for ScrollView containerStyle?
        // flex: 1,
        // width: "100%",
        // height: "100%",
    },
    sidePanel: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 100,
    },
    sidePanelButtonContainer: {
        marginTop: 10,
        marginLeft: 10,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 110,
    },
    logOutButtonContainer: {
        width: 64,
        height: 64,
        marginTop: 10,
        marginRight: 10,
        position: "absolute",
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 999,
        zIndex: 110,
    },
    map: {
        width: "100%",
        height: "100%",
        backgroundColor: "#addbff", // water fill before map loads
    },
})