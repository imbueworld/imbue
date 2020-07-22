import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated } from 'react-native'

import UserIcon from "../components/UserIcon"



export default function UserDashboard(props) {
    const [expanded, setExpanded] = useState(false)
    const slidingAnim = useRef(new Animated.Value(-450)).current

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
            toValue: -450,
            duration: 500,
        }).start()
    }

    function sidePanelSlideOut() {
        Animated.timing(slidingAnim, {
            toValue: 0,
            duration: 500,
        }).start()
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[
                styles.sidePanel,
                {
                    left: slidingAnim,
                }
            ]}>
                <TouchableOpacity
                    style={styles.sidePanelButton}
                    onPress={sidePanelToggle}
                >
                    {/* <Text style={{fontSize: 30}}>{expanded ? "<" : ">"}</Text> */}
                    <UserIcon />
                </TouchableOpacity>
                <View>
                    <Text>(Profile Representation)</Text>
                </View>
                <View>
                    <Text>My Classes</Text>
                    <Text>Manage Memberships</Text>
                    <Text>Profile Settings</Text>
                    <Text>Payment Settings</Text>
                </View>
            </Animated.View>
            <ScrollView style={styles.scrollView}>
                <View style={styles.content}>
                    <Text>content goes here. content goes here. content goes here. content goes here. content goes here.</Text>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        // flex: 1,
    },
    scrollView: {
        backgroundColor: "pink",
        left: 50,
    },
    sidePanel: {
        width: 500,
        height: "inherit",
        position: "absolute",
        // left: 0,
        backgroundColor: "gray",
        zIndex: 1,
    },
    sidePanelButton: {
        width: 50,
        height: 50,
        position: "absolute",
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    content: {},
})