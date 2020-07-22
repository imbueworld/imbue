import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated, Button } from 'react-native'
import { useDimensions } from '@react-native-community/hooks'

import AppBackground from "../components/AppBackground"

import UserIcon from "../components/UserIcon"
import UserMenu from "../components/UserMenu"



export default function UserDashboard(props) {
    const { width, height } = useDimensions().window
    console.log(width)
    console.log(height)
    const [expanded, setExpanded] = useState(false)
    const slidingAnim = useRef(new Animated.Value(-1 * width)).current

    // const window = useWindowDimensions()
    // const windowWidth = window.width
    // const windowHeight = window.height
    // console.log(windowWidth)
    // console.log(windowHeight)

    // const maxWidth = width
    // const maxHeight = height
    // console.log(maxWidth, maxHeight)

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
                    <UserIcon />
            </TouchableOpacity>
            <Animated.View style={[
                styles.sidePanel,
                {
                    width: width,
                    height: height,
                    left: slidingAnim,
                }
            ]}>
                <AppBackground />
                <UserMenu navigation={props.navigation} />
            </Animated.View>
            <ScrollView style={styles.content}>
                <Text>content goes here. content goes here. content goes here. content goes here. content goes here.</Text>
                <Button
                    title="map piece, that takes you to gym description screen"
                    onPress={() => props.navigation.navigate("GymDescription")}
                />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
    },
    sidePanel: {
        position: "absolute",
        zIndex: 1,
    },
    sidePanelButton: {
        width: 50,
        height: 50,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
    },
    content: {
        backgroundColor: "pink",
    },
})