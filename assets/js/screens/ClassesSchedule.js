import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import CalendarView from "../components/CalendarView"
import ClassList from "../components/ClassList"



export default function ClassesSchedule(props) {
    function dateStringFromDate(dateObj = new Date()) {
        const options = {month: "2-digit", day: "2-digit", year: "numeric"}
        const [month, day, year] =
            ( dateObj ).toLocaleDateString("en-US", options).split("/")
        const curDateString =
            `${year}-${month}-${day}`
        
        return curDateString
    }
    
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
            trainer: "Oskar Yogamaster",
        },
        {
            key: "CDF",
            dateString: "2020-08-01",
            time: "Aug 01 5:00 PM",
            title: "A20",
            trainer: "Steve Martin",
        },
    ]

    const curDateString = dateStringFromDate()
    const [slcDateString, setSlcDateString] = useState(curDateString)

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <Text>Schedule</Text>
            <View style={styles.calendarContainer}>
                <CalendarView
                    data={data}
                    setDate={dateString => setSlcDateString(dateString)}
                    slcDateString={slcDateString}
                />
            </View>
            <ClassList
                data={data}
                dateString={slcDateString}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {},
    calendarContainer: {
        width: "85%",
        alignSelf: "center",
        padding: 12,
        backgroundColor: "white",
        borderRadius: 30,
        // borderColor: "red",
        // borderWidth: 1,
    },
})