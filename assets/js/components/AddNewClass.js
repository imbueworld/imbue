import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "./CustomButton"
import CustomTextInput from "./CustomTextInput"
import CustomSelectButton from "./CustomSelectButton"
import CustomOptionSelector from "./CustomOptionSelector"
import CustomCapsule from "./CustomCapsule"



export default function AddNewClass(props) {
    const profileData = {}

    return (
        <ProfileLayout capsuleStyle={styles.container}>

            <CustomTextInput
                placeholder="Class Time"
            />
            <CustomTextInput
                placeholder="Class Name"
            />
            <CustomTextInput
                placeholder="Instructor"
            />
            <CustomTextInput
                placeholder="Description of the Class"
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
        
        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
    weekdaySelector: {
    },
})