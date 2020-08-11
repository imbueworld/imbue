import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"
import ProfileRepr from "../components/ProfileRepr"

import CustomCapsule from "../components/CustomCapsule"

import firebase from "firebase/app"
import "firebase/auth"
import { colors } from '../contexts/Colors'



export default function ProfileLayout(props) {
    const user = firebase.auth().currentUser
    const profileData = {
        name: user.displayName,
        iconUri: user.photoURL,
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <View style={{
                marginVertical: 50,
            }}>
                <ProfileRepr
                    style={{
                        position: "absolute",
                        width: "80%",
                        alignSelf: "center",
                        zIndex: 100,
                        overflow: "hidden",
                    }}
                    data={profileData}
                />
                
                <CustomCapsule
                    style={[
                        {
                            // marginTop: 150,
                            marginTop: 115,
                            width: "88%",
                            alignSelf: "center",
                        },
                        props.containerStyle,
                    ]}
                    innerContainerStyle={[
                        {
                            paddingTop: 135,
                        },
                        props.innerContainerStyle,
                    ]}
                >
                
                    {props.children}

                </CustomCapsule>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        minHeight: "100%",
    },
    scrollView: {
        minHeight: "100%",
    },
})