import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'

import AppBackground from "../components/AppBackground"

import CalendarView from "../components/CalendarView"

import CustomCapsule from "../components/CustomCapsule"
import CustomButton from "../components/CustomButton"



export default function Component(props) {
    const [slctdDate, setSlctdDate] = useState("")
    const textRef = useRef()

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
                    slctdDate={slctdDate}
                    setSlctdDate={setSlctdDate}
                />

                <Text ref={textRef}><Image /></Text>

                <CustomButton
                    title="Access Ref"
                    onPress={() => {
                        console.log(textRef.current)
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