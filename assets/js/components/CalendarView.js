import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Calendar } from "react-native-calendars"



export default function CalendarView(props) {
    function dateStringFromDate(dateObj = new Date()) {
        const options = {month: "2-digit", day: "2-digit", year: "numeric"}
        const [month, day, year] =
            ( dateObj ).toLocaleDateString("en-US", options).split("/")
        const curDateString =
            `${year}-${month}-${day}`
        
        return curDateString
    }

    const [slctdDateString, setSlctdDateString] =
        useState(dateStringFromDate())
    // const slctdDateString = props.slctdDateString || dateStringFromDate()

    const workout = {color: "red"}
    const markedDates = {}
    
    props.data.forEach(({dateString}) => {
        if (!markedDates[dateString])
            markedDates[dateString] = {dots: [workout]}
        else
            markedDates[dateString].dots.push(workout)
    })

    // Responsible for meshing together the options for current selected date
    markedDates[slctdDateString] =
        markedDates[slctdDateString]
        ? Object.assign(markedDates[slctdDateString], {selected: "true"})
        : {selected: "true"}

    // props.chosenDate[0] = slctdDateString
    // props.slctdDate[0] = slctdDateString

    return (
        <View style={styles.calendarContainer}>
            <Calendar
                markedDates={markedDates}
                markingType={"multi-dot"}
                theme={calendarStyle}
                // onDayPress={day => props.setDate(day.dateString)}
                onDayPress={day => {
                    setSlctdDateString(day.dateString)
                    props.setSlctdDate(day.dateString)
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {},
    container: {},
    calendarContainer: {
        width: "100%",
        alignSelf: "center",
        padding: 12,
        backgroundColor: "white",
        borderRadius: 30,
    },
})

const calendarStyle = {}