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
                paddingVertical: 50,
            }}>
                <ProfileRepr
                    style={{
                        position: "absolute",
                        alignSelf: "center",
                        zIndex: 100,
                    }}
                />
                
                <View style={[
                    props.style, // should probably be removed and not used
                    {
                        width: "85%",
                        alignSelf: "center",
                    },
                ]}>
                    <CustomCapsule style={[
                        {
                            marginTop: 150,
                            paddingTop: 100,
                        },
                        props.capsuleStyle
                    ]}>
                    
                        {props.children}

                    </CustomCapsule>
                </View>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        flex: 1,
        // height: "100%",
    },
    // container: {},
})