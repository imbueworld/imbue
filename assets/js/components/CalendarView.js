import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import { Calendar } from "react-native-calendars"
import config from '../../../App.config'
import { FONTS } from "../contexts/Styles"


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
        ? Object.assign(markedDates[props.slctdDate], { selected: "true" })
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
        // theme={calendarStyle}
        onDayPress={day => {
          props.setSlctdDate(day.dateString)
        }}
        theme={{
          textSectionTitleColor: '#242429',
          dayTextColor: '#242429',
          textSectionTitleDisabledColor: '#242429',
          selectedDayBackgroundColor: '#242429',
          dotColor: '#242429',
          selectedDotColor: '#f9f9f9',
          arrowColor: '#242429',
          monthTextColor: '#242429', 
          indicatorColor: '#242429',
          textDayFontFamily: FONTS.cardBody.fontFamily,
          textMonthFontFamily: FONTS.cardBody.fontFamily,
          textDayHeaderFontFamily: FONTS.cardBody.fontFamily,
          
        }}
        // [v DEBUG ONLY v]
        onDayLongPress={config.DEBUG ? day => {
          props.setSlctdDate(day.dateString)
        } : undefined}
        // [^ DEBUG ONLY ^]
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

}
  // <Calendar /> can be styled following react-native-calendars properties