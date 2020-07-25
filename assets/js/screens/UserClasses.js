import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"

import CalendarView from "../components/CalendarView"

import CustomCapsule from "../components/CustomCapsule"
import CustomButton from "../components/CustomButton"



export default function Component(props) {
    const chosenDate = []
    setTimeout(()=>{console.log(chosenDate)}, 1)

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <CustomCapsule style={{
                width: "85%",
                marginVertical: 50,
                paddingHorizontal: 0,
                paddingTop: 0,
                alignSelf: "center",
            }}>
                
                <CalendarView
                    data={[]}
                    chosenDate={chosenDate}
                />

                <CustomButton
                    title="Access Ref"
                    onPress={() => {
                        console.log(chosenDate)
                    }}
                />

            </CustomCapsule>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
})