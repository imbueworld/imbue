import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Calendar } from "react-native-calendars"



/**
 * props
 * .data -- data
 * .slctdDate -- selected DateString (parent's state obj)
 * .setSlctdDate -- (parent's setState func), must be provided
 */
export default function CalendarView(props) {
    let calendarData = props.data
    if (!calendarData) return <View />

    useEffect(() => {
        calendarData.forEach(doc => {
            if (!(doc.active_times instanceof Array)) return
        })

        // Responsible for meshing together the data provided (props.data)
        // into date-sorted object used by <Calendar />
        let markedDates = {}
        calendarData.forEach(({ active_times }) => {
            active_times.forEach(({ dateString }) => {
                if (!markedDates[dateString]) markedDates[dateString] = { dots: [] }
                markedDates[dateString].dots.push(workout)
            })
        })

        // Responsible for meshing together the options for current selected date
        markedDates[props.slctdDate] =
            markedDates[props.slctdDate]
            ? Object.assign(markedDates[props.slctdDate], {selected: "true"})
            : { selected: "true" }

        setMarkedDates(markedDates)
    }, [props.slctdDate])

    const [markedDates, setMarkedDates] = useState({})
    const workout = { color: "lightgreen" }

    return (
        <View style={{
            ...styles.calendarContainer,
            ...props.containerStyle
        }}>
            <Calendar
                markedDates={markedDates}
                markingType={"multi-dot"}
                theme={calendarStyle}
                onDayPress={day => {
                    props.setSlctdDate(day.dateString)
                }}
                // [uncomment upon start DEBUG]
                onDayLongPress={day => {
                    props.setSlctdDate(day.dateString)
                }}
                // [comment upon stop DEBUG]
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