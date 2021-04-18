import React, { useState } from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from '../Icon'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment';
import RNCalendarEvents from "react-native-calendar-events";
import functions from '@react-native-firebase/functions'
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native'


export default function CalendarSyncButton(props) {
  const classDoc = props.classDoc
  const calendarData = props.calendarData
  const type = props.type

  const checkForPermissions = async () => {
    if (await RNCalendarEvents.checkPermissions() != "authorized") {
      RNCalendarEvents.requestPermissions();
    }
  }

  const addAllClassesToCalendar = async () => {
    calendarData.forEach(doc => {
      let active_times = doc.active_times

      let classId = doc.id
      let className = doc.name
      active_times.forEach(async (doc) => {

        let beg_time = doc.begin_time
        let end_time = doc.end_time

        // Get event ID from firestore
        const updatedClass = await firestore()
          .collection('classes')
          .doc(classId)
          .get()

        let calendarId = updatedClass.data().calendarId
        console.log("calendarId: ", calendarId)

        // Take care of duplicate entries
        if (calendarId) {
          console.log("CAL: ", calendarId)
          let res = await RNCalendarEvents.removeEvent(calendarId)
          console.log("RES:", res)
          if (res == false) { //stop if failing to delete
            return
          }
        }

        // add to calendar
        let response = await RNCalendarEvents.saveEvent(className + ' Imbue Class', {
          startDate: beg_time,
          endDate: end_time,
          notes: 'Open the Imbue app at class time to join'

        })

        // update firestore
        firestore()
          .collection('classes')
          .doc(classId)
          .update({
            calendarId: response,
          })
      })
    })
  }


  const addSingleClassToCalendar = async () => {
    let beg_time = classDoc.begin_time
    let end_time = classDoc.end_time

    // Get event ID from firestore
    const updatedClass = await firestore()
      .collection('classes')
      .doc(classDoc.id)
      .get()

    let calendarId = updatedClass.data().calendarId

    // Take care of duplicate entries
    if (calendarId) {
      RNCalendarEvents.removeEvent(calendarId);
    }

    // add to calendar
    let response = await RNCalendarEvents.saveEvent(classDoc.name + ' Imbue Class', {
      startDate: beg_time,
      endDate: end_time,
      notes: 'Open the Imbue app at class time to join'
    })

    // update firestore
    firestore()
      .collection('classes')
      .doc(classDoc.id)
      .update({
        calendarId: response,
      })
  }

  const {
    containerStyle = {},
    imageContainerStyle = {},
    imageStyle = {},
    //
    onPress = async () => {
      checkForPermissions()

      if (type == "singleSync") {
        addSingleClassToCalendar()
      } else {
        addAllClassesToCalendar()
      }

      showSuccess()

    }
  } = props



  const showSuccess = () => {
    Alert.alert(
      'Success!',
      'Your class has been added to your phone calendar',
      [
        {
          text: 'Ok',
          style: 'cancel',
        },
      ],
      { cancelable: false },
    )
  }



  return (
    <View style={{
      backgroundColor: "white",
      borderRadius: 999,
      zIndex: 110,
      // ...simpleShadow,
      ...containerStyle,
    }}>
      <TouchableOpacity
        style={{
          borderRadius: 999,
        }}
        // underlayColor="#00000020"
        onPress={onPress}
      >
        <Icon
          containerStyle={{
            width: 50,
            height: 50,
            ...imageContainerStyle,
          }}
          imageStyle={imageStyle}
          source={require("../img/png/calendar-sync.png")}
        />
      </TouchableOpacity>
    </View>
  )
}