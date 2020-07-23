import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import CustomButton from "./CustomButton"
import CustomTextInput from "./CustomTextInput"
import CustomSelectButton from "./CustomSelectButton"
import CustomOptionSelector from "./CustomOptionSelector"
import ProfileRepr from "./ProfileRepr"



export default function Component(props) {
    const profileData = {}

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
                <ProfileRepr
                    data={profileData}
                />
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
                        height: 40,
                        marginVertical: 10,
                    }}
                />
                <CustomSelectButton
                    options={{oneTime: "One Time", selectDays: "Select Days"}}
                    style={{
                        height: 40,
                        marginVertical: 10,
                    }}
                />
                <CustomOptionSelector
                    options={{sun: "S", mon:"M", tue:"T", wed:"W", thu: "Th", fri:"F", sat:"Sa"}}
                />
                <CustomButton
                    title="Save"
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {},
    container: {},
})