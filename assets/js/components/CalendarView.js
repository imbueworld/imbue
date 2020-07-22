import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Calendar } from "react-native-calendars"



export default function CalendarView(props) {
    const slcDateString = props.slcDateString

    const workout = {color: "red"}
    const markedDates = {}
    props.data.forEach(({dateString}) => {
        if (!markedDates[dateString])
            markedDates[dateString] = {dots: [workout]}
        else
            markedDates[dateString].dots.push(workout)
    })

    // Responsible for meshing together the options for current selected date
    markedDates[slcDateString] =
        markedDates[slcDateString]
        ? Object.assign(markedDates[slcDateString], {selected: "true"})
        : {selected: "true"}

    return (
        <Calendar
            markedDates={markedDates}
            markingType={"multi-dot"}
            theme={calendarStyle}
            onDayPress={day => props.setDate(day.dateString)}
        />
    )
}

const styles = StyleSheet.create({
    scrollViewContainer: {},
    container: {},
})

const calendarStyle = {}