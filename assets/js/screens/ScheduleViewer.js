import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"

import CalendarView from "../components/CalendarView"
import ClassList from "../components/ClassList"

import {
  datestringFromTimestamp,
  addFormattingToClassData,
  addFunctionalityToClassData
} from "../backend/HelperFunctions"
import {
  retrieveClassesByIds,
  retrieveClassesByGymIds,
  retrieveUserData,
  retrieveClassesByUser
} from '../backend/CacheFunctions'
import { fonts } from '../contexts/Styles'
import { colors } from '../contexts/Colors'
import CustomCapsule from '../components/CustomCapsule'
import GoBackButton from '../components/buttons/GoBackButton'
import PlusButton from '../components/buttons/PlusButton'



export default function ScheduleViewer(props) {
  let cache = props.route.params.cache
  let params = props.route.params

  // const [cacheIsWorking, setCacheIsWorking] = useState(true)

  const [calendarData, setCalendarData] = useState(null)
  const [dataIsFormatted, setDataIsFormatted] = useState(false)

  const [slctdDate, setSlctdDate] = useState(datestringFromTimestamp(Date.now()))

  const [Calendar, CalendarCreate] = useState(null)
  const [CalendarItemList, CalendarItemListCreate] = useState(null)

  const [user, setUser] = useState(null)

  // useEffect(() => {
  //     let limit = 20 * (1000 / 200) // seconds * intervals per second
  //     let initCheck = setInterval(() => {
  //         limit--
  //         console.log("Checking...")
  //         // DO NOT PUT HERE ANYTHING COMPUTATIONALLY INTENSIVE
  //         // ...

  //         if (!cache.working || !limit) {
  //             console.log("cache.working", cache.working) //
  //             cache.working = 0 // reset it for good messure
  //             // And immediately clear the interval,
  //             // upon receiving desired outcome
  //             clearInterval(initCheck)
  //             console.log("Interval cleared.")
  //             setCacheIsWorking(false)
  //         }
  //     }, /*25*/200)
  // }, [])

  useEffect(() => {
    // if (cacheIsWorking) return

    const init = async () => {
      let user = await retrieveUserData(cache)
      setUser(user)

      // Determine which classes to display:
      // based on the provided gymId or classIds
      let classes
      if (params.classIds) {
        classes = await retrieveClassesByIds(cache, { classIds: params.classIds })
      } else if (params.gymId) {
        classes = await retrieveClassesByGymIds(cache, { gymIds: [params.gymId] })
      // } else console.warn("Calendar is missing data. It most likely was not provided.")
      } else {
        classes = await retrieveClassesByUser(cache)
      }

      setCalendarData(classes)
    }
    init()
    // }, [cacheIsWorking])
  }, [])

  useEffect(() => {
    if (!calendarData) return

    calendarData.forEach(({ active_times }) => {
      addFormattingToClassData(active_times)
    })

    addFunctionalityToClassData(calendarData, props.navigation)

    setCalendarData(calendarData)
    setDataIsFormatted(true)
  }, [calendarData])

  useEffect(() => {
    if (!dataIsFormatted) return

    CalendarCreate(
      <CalendarView
        containerStyle={{
          borderWidth: 1,
          borderColor: colors.gray,
        }}
        data={calendarData}
        slctdDate={slctdDate}
        setSlctdDate={setSlctdDate}
      />
    )
    CalendarItemListCreate(
      <ClassList
        containerStyle={styles.classListContainer}
        data={calendarData}
        dateString={slctdDate}
      />
    )

  }, [dataIsFormatted, slctdDate])



  if (!user) return <View />

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>

      <AppBackground />

      <CustomCapsule
        containerStyle={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          paddingTop: 0,
          marginBottom: 20,
        }}
        innerContainerStyle={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <View style={{
          flexDirection: "row",
          height: 80,
          alignItems: "center",
        }}>
          <GoBackButton />

          <Text style={{
            width: "100%",
            position: "absolute",
            textAlign: "center",
            fontSize: 30,
            fontFamily: fonts.default,
          }}>Schedule</Text>

          {user.account_type === "partner" ?
          <PlusButton
            containerStyle={{
              position: "absolute",
              right: 0,//"6%",
            }}
            onPress={() => props.navigation.navigate(
              "SchedulePopulate")}
          /> : null}
        </View>
      </CustomCapsule>

      <View style={styles.capsule}>
        <View style={styles.innerCapsule}>
          {Calendar}
          {CalendarItemList}
        </View>
      </View>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
  },
  innerCapsule: {
    width: "100%",
    marginBottom: 50,
    paddingBottom: 10,
    alignSelf: "center",
    // backgroundColor: "#FFFFFF80",
    backgroundColor: "#00000008",
    // borderWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray,
    borderRadius: 40,
  },
  classListContainer: {
    marginTop: 10,
  },
})