import React, { useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"

import CalendarView from "../components/CalendarView"

import CustomCapsule from "../components/CustomCapsule"
import CustomButton from "../components/CustomButton"
import CustomSelectButton from "../components/CustomSelectButton"



export default function UserClasses(props) {
    const [slctdDate, setSlctdDate] = useState("")
    
    const options = {
        allStudio: "All Studio Classes",
        inStudio: "In Studio",
        livestream: "Livestream",
        all: "My Classes",
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <CustomCapsule style={{
                width: "85%",
                alignSelf: "center",
                marginVertical: 50,
                paddingTop: 0,
                paddingHorizontal: 0,
            }}>
                
                <CalendarView
                    data={[]}
                    slctdDate={slctdDate}
                    setSlctdDate={setSlctdDate}
                />

                <CustomSelectButton
                    containerStyle={{
                        marginTop: 15,
                        marginBottom: 0,
                        width: "90%",
                        alignSelf: "center"
                    }}
                    textStyle={{
                        fontSize: 14,
                    }}
                    options={options}
                />

            </CustomCapsule>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
})