import React, {useState} from 'react'
import { View } from 'react-native'
import {TouchableOpacity } from 'react-native-gesture-handler'
import Icon from '../Icon'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment';
import RNCalendarEvents from "react-native-calendar-events";
import functions from '@react-native-firebase/functions'
import firestore from '@react-native-firebase/firestore';


export default function CalendarSyncButton(props) {
  const classDoc = props.classDoc
  const calendarData = props.calendarData
  const type = props.type

  const addSingleClassToCalendar = async () => {
      if (await RNCalendarEvents.checkPermissions() != "authorized"){
          RNCalendarEvents.requestPermissions();
      }

      let date = classDoc.dateString 
      let formattedTime = classDoc.formattedTime 

      let beg_time
      let end_time

      if (formattedTime.length == 17) { //00:00 - 00:00
        beg_time = formattedTime.substring(0,5)
        end_time = formattedTime.substring(10,15)

        console.log("if")  
        // account for military time beg_time
        let begin_time_pmOrAm = formattedTime.substring(6,6)
        if (begin_time_pmOrAm == "p"){
          let number = parseInt(formattedTime.substring(0,1))
          let total_beg_time = number + 12
          beg_time = total_beg_time.toString()
        }

        // account for military time end_time
        let end_time_pmOrAm = formattedTime.substring(16,16)
        if (end_time_pmOrAm == "p"){
          let number = parseInt(formattedTime.substring(10,10))
          let total_end_time = number + 12
          end_time = total_end_time.toString()
        }  
      } else if (formattedTime.length == 15) { //0:00 - 0:00

        beg_time = formattedTime.substring(0,4)
        end_time = formattedTime.substring(9,13)

        // account for military time beg_time
        let begin_time_pmOrAm = formattedTime.substring(4,5)
        if (begin_time_pmOrAm == "p"){
          let number = parseInt(formattedTime.substring(0,1))
          let total_beg_time = number + 12
          beg_time = total_beg_time.toString() + ':' + formattedTime.substring(2,4)
        }

        // account for military time end_time
        let end_time_pmOrAm = formattedTime.substring(13,14)
        if (end_time_pmOrAm == "p"){
          let number = parseInt(formattedTime.substring(9,10))
          let total_end_time = number + 12
          end_time = total_end_time.toString() + ':' + formattedTime.substring(11,13)
        }  
      } else if (formattedTime.length == 16) { //0:00 - 00:00 or 00:00 - 0:00
        console.log("else iff")

      
        if (formattedTime.substring(4,5) == "p" || formattedTime.substring(4,5) == "a"){ //then 0:00 - 00:00
          beg_time = formattedTime.substring(0,4)
          end_time = formattedTime.substring(9,14)

          let begin_time_pmOrAm = formattedTime.substring(4,5)
          if (begin_time_pmOrAm == "p"){
            let number = parseInt(formattedTime.substring(0,1))
            let total_beg_time = number + 12
            beg_time = total_beg_time.toString() + ':' + formattedTime.substring(2,4)
          }

          let end_time_pmOrAm = formattedTime.substring(13,14)
          if (end_time_pmOrAm == "p"){
            let number = parseInt(formattedTime.substring(9,10))
            let total_end_time = number + 12
            end_time = total_end_time.toString() + ':' + formattedTime.substring(11,13)
          }

        } else { //then 00:00 - 0:00
          beg_time = formattedTime.substring(0,5)
          end_time = formattedTime.substring(9,14)

          let begin_time_pmOrAm = formattedTime.substring(6,6)
          if (begin_time_pmOrAm == "p"){
            let number = parseInt(formattedTime.substring(0,1))
            let total_beg_time = number + 12
            beg_time = total_beg_time.toString()
          }

          // account for military time end_time
          let end_time_pmOrAm = formattedTime.substring(16,16)
          if (end_time_pmOrAm == "p"){
            let number = parseInt(formattedTime.substring(10,10))
            let total_end_time = number + 12
            end_time = total_end_time.toString()
          }  
        }
      }

      let start_time_formatted = date + ' ' + beg_time
      let end_time_formatted = date + ' ' + end_time

      console.log("end_time_formatted: ", end_time_formatted)


      let st = moment.utc(start_time_formatted).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      let et = moment.utc(start_time_formatted).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

      console.log("st: ", st)
      console.log("et: ", et)

      console.log("classDoc.id: ", classDoc.id)

      // Get event ID from firestore
      const updatedClass = await firestore()
        .collection('classes')
        .doc(classDoc.id)
        .get()

      console.log("updatedClass: ", updatedClass.data().calendarId)
      let calendarId =  updatedClass.data().calendarId
      console.log("calendarId: ", calendarId)

      // Take care of duplicate entries
      if (calendarId) {
        RNCalendarEvents.removeEvent(calendarId);
      }



      // add to calendar
      let response = await RNCalendarEvents.saveEvent(classDoc.name + ' Imbue Class',
        {
          startDate: st,
          endDate: et,
        }) 

      console.log("RESPONSE: ", response)

      // update firestore
      firestore()
        .collection('classes')
        .doc(classDoc.id)
        .update({
          calendarId: response,
        })
        
  }

  const addAllClassesToCalendar = () => {
    calendarData.forEach(doc => {
      let active_times = doc.active_times
      active_times.forEach(doc => {

        setClassDoc({dateString: doc.dateString, formattedTime: doc.formattedTime, id: doc.id})
        addSingleClassToCalendar()

      })
    })
  }

  const {
    containerStyle={},
    imageContainerStyle={},
    imageStyle={},
    //
    onPress = async() => {


      if (type == "singleSync") {
        addSingleClassToCalendar()
      } else {
        addAllClassesToCalendar()
      }

    } 
  } = props



  
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