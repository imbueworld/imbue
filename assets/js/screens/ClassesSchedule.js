import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"

import CustomCapsule from "../components/CustomCapsule"

import CalendarView from "../components/CalendarView"
import ClassList from "../components/ClassList"
import MenuPanel from "../components/MenuPanel"
import AddNewClass from "../components/AddNewClass"



export default function ClassesSchedule(props) {
    const data = [
        {
            key: "ABCDF",
            dateString: "2020-07-12",
            time: "Jul 12 9:00 AM",
            title: "Yoga flow",
            trainer: "Daniele Jokenin",
        },
        {
            key: "BCDF",
            dateString: "2020-07-15",
            time: "Jul 15 12:00 PM",
            title: "A30",
            trainer: "Lexi Johnson",
        },
        {
            key: "DF",
            dateString: "2020-07-15",
            time: "Jul 15 11:00 PM",
            title: "Super Yoga",
            trainer: "Oskar Birch",
        },
        {
            key: "CDF",
            dateString: "2020-08-01",
            time: "Aug 01 5:00 PM",
            title: "A20",
            trainer: "Steve Martin",
        },
    ]

    // const curDateString = dateStringFromDate()
    // const [slctdDateString, setslctdDateString] = useState(curDateString)

    const [slctdDate, setSlctdDate] = useState([])

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>

            <AppBackground />

            <MenuPanel>
                <AddNewClass />
            </MenuPanel>

            <Text style={{
                marginVertical: 20,
                textAlign: "center",
                fontSize: 30,
            }}>Schedule</Text>
            
            <View
                style={styles.capsule}
            >

                <CalendarView
                    data={data}
                    // setDate={dateString => setslctdDateString(dateString)}
                    // slctdDateString={slctdDateString}
                    setSlctdDate={setSlctdDate}
                />

                <ClassList
                    containerStyle={styles.classListContainer}
                    data={data}
                    // dateString={slctdDateString}
                    dateString={slctdDate}
                />
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    capsule: {
        width: "85%",
        paddingBottom: 10,
        alignSelf: "center",
        backgroundColor: "#FFFFFF80",
        borderRadius: 40,
    },
    classListContainer: {
        marginTop: 10,
    },
})