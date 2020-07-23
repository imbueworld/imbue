import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "./AppBackground"
import ProfileRepr from "./ProfileRepr"

import CustomButton from "./CustomButton"
import CustomTextInput from "./CustomTextInput"
import CustomSelectButton from "./CustomSelectButton"
import CustomOptionSelector from "./CustomOptionSelector"
import CustomCapsule from "./CustomCapsule"



export default function Component(props) {
    const profileData = {}

    return (
        // <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View>
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
                    data={profileData}
                />

                <View style={styles.container}>
                
                    <CustomCapsule
                        style={{
                            paddingTop: 100,
                            top: 150,
                        }}
                    >

                        <CustomTextInput
                        />
                        <CustomTextInput
                        />
                        <CustomTextInput
                        />
                        <CustomTextInput
                        />

                        <CustomSelectButton
                            options={{studio: "In Studio", online: "Online"}}
                            style={{
                                // height: 40,
                                // marginVertical: 10,
                            }}
                        />

                        <CustomSelectButton
                            options={{oneTime: "One Time", selectDays: "Select Days"}}
                            style={{
                                // height: 40,
                                // marginVertical: 10,
                            }}
                        />

                        <CustomOptionSelector
                            style={styles.weekdaySelector}
                            options={{sun: "S", mon:"M", tue:"T", wed:"W", thu: "Th", fri:"F", sat:"Sa"}}
                        />

                        <CustomButton
                            title="Save"
                        />
                    
                    </CustomCapsule>
                
                </View>

            </View>
        </View>
        // </ScrollView>
    )
}

const styles = StyleSheet.create({
    // scrollViewContainer: {},
    container: {
        width: "85%",
        alignSelf: "center",
    },
    weekdaySelector: {
    },
})