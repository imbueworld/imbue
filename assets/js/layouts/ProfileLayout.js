import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"
import ProfileRepr from "../components/ProfileRepr"

import CustomCapsule from "../components/CustomCapsule"



export default function Component(props) {
    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <AppBackground />
            <View style={{
                top: 50,
            }}>
                <ProfileRepr
                    style={{
                        position: "absolute",
                        alignSelf: "center",
                        zIndex: 100,
                    }}
                />
                
                <View style={props.style}>
                    <CustomCapsule
                        style={{
                            paddingTop: 100,
                            top: 150,
                        }}
                    >
                    
                    {props.children}

                    </CustomCapsule>
                </View>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        height: "100%",
    },
    // container: {},
})