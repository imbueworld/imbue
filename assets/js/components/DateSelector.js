import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Calendar } from 'react-native-calendars'



export default function DateSelector(props) {
    const [dates, setDates] = useState({})
    // const [dateStringList, setDateStringList] = useState(props.value || [])

    function processTapOnDay(date) {
        // Must create a new object, in order to not provide the same reference,
        // otherwise neither this React component will update, nor <Calendar />
        let newDates = {...dates}
        if (!newDates[date.dateString]) newDates[date.dateString] = {}
        newDates[date.dateString] = Object.keys(newDates[date.dateString]).length
        ?   {}
        :   { selected: true }

        setDates(newDates)
        
        let dateStringList = []
        Object.entries(newDates).forEach(([ dateString, info ]) => {
            if (info.selected) dateStringList.push(dateString)
        })
        // setDateStringList(dateStringList)
        if (props.onDayPress) props.onDayPress(dateStringList)
    }

    return (
        <View style={{...props.containerStyle}}>
            <View style={{...props.innerContainerStyle}}>
                <Calendar
                    markedDates={dates}
                    onDayPress={processTapOnDay}
                    onDayLongPress={processTapOnDay}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})