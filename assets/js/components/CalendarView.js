import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Calendar } from "react-native-calendars"



export default function CalendarView(props) {
    /**
     * props
     * .data -- data
     * .slctdDate -- selected DateString (parent's state obj), can be empty
     * .setSlctdDate -- (parent's setState func), must be provided
     */

    function dateStringFromDate(dateObj = new Date()) {
        let year = dateObj.getFullYear()
        let month = dateObj.getMonth() + 1
        if (month < 10) month = `0${month}`
        let day = dateObj.getDate()
        const curDateString =
            `${year}-${month}-${day}`

        return curDateString
    }

    const [slctdDateString, setSlctdDateString] =
        useState(dateStringFromDate())
    
    useEffect(() => {
        if (!props.slctdDate) props.setSlctdDate(slctdDateString)
    })

    const workout = {color: "red"}
    const markedDates = {}
    
    // Responsible for meshing together the data provided (props.data)
    // into date-sorted object used by <Calendar />
    props.data.forEach(({dateString}) => {
        if (!markedDates[dateString])
            markedDates[dateString] = {dots: [workout]}
        else
            markedDates[dateString].dots.push(workout)
    })

    // Responsible for meshing together the options for current selected date
    // with {selected: "true"}
    markedDates[slctdDateString] =
        markedDates[slctdDateString]
        ? Object.assign(markedDates[slctdDateString], {selected: "true"})
        : {selected: "true"}

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
    calendarContainer: {
        width: "100%",
        alignSelf: "center",
        padding: 12,
        backgroundColor: "white",
        borderRadius: 30,
    },
})

const calendarStyle = {
    // <Calendar /> can be styled following react-native-calendars properties
}