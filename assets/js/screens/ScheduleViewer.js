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
  filterUserClasses,
} from '../backend/CacheFunctions'
import { fonts } from '../contexts/Styles'
import { colors } from '../contexts/Colors'
import CustomCapsule from '../components/CustomCapsule'
import GoBackButton from '../components/buttons/GoBackButton'
import PlusButton from '../components/buttons/PlusButton'
import User from '../backend/storage/User'
import Gym from '../backend/storage/Gym'
import ClassesCollection from '../backend/storage/ClassesCollection'



export default function ScheduleViewer(props) {
  const {
    classIds,
    gymId,
  } = props.route.params

  const [calendarData, setCalendarData] = useState(null)
  const [dataIsFormatted, setDataIsFormatted] = useState(false)

  const [slctdDate, setSlctdDate] = useState(datestringFromTimestamp(Date.now()))

  const [user, setUser] = useState(null)

  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")

  useEffect(() => {
    const init = async () => {
      const user = new User()
      setUser(await user.retrieveUser())

      const classes = new ClassesCollection()

      // Determine which classes to display:
      // based on the provided gymId or classIds
      let classData
      if (classIds) {
        console.log(1111)

        classData = (await classes
          .retrieveWhere('id', 'in', classIds)
        ).map(it => it.getAll())

        setTitle('My Classes')
      
      } else if (gymId) {
        console.log(2222)

        const gym = new Gym()
        const {
          name,
        } = await gym.retrieveGym(gymId)

        classData = (await classes
          .retrieveWhere('gym_id', 'in', [ gymId ])
        ).map(it => it.getAll())

        setTitle(name)
        setSubtitle('Schedule')
      
      } else {
        console.log(3333)

        setTitle('My Classes')

        classData = (await user.retrieveClasses()).map(it => it.getAll())
        if (user.accountType == 'user') classData = await filterUserClasses()
      }

      setCalendarData(classData)
    }; init()
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



  if (!user || !dataIsFormatted) return <View />

  return (
    <ScrollView contentContainerStyle={styles.scrollView} alwaysBounceVertical={false} >

      <AppBackground />

      <CustomCapsule
        containerStyle={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          paddingTop: 0,
          marginTop: 40,
          marginBottom: 20,
        }}
        innerContainerStyle={{
          paddingHorizontal: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <View style={{
          flexDirection: "row",
          height: 80,
          alignItems: "center",
          justifyContent: "center",
        }}>
          <GoBackButton
            containerStyle={{
              position: "absolute",
              left: 15,
            }}
            imageContainerStyle={{
              width: 48,
              height: 48,
            }}
          />

          <View style={{
            position: "absolute",
          }}>
          <Text style={{
            width: "100%",
            textAlign: "center",
            fontSize: 30,
            fontFamily: fonts.default,
          }}>{title}</Text>
          {subtitle ?
          <Text style={{
            width: "100%",
            textAlign: "center",
            fontSize: 18,
            fontFamily: fonts.default,
          }}>{subtitle}</Text> : null}
          </View>

          {user.account_type === "partner" ?
          <PlusButton
            containerStyle={{
              position: "absolute",
              right: 15,
            }}
            imageContainerStyle={{
              width: 48,
              height: 48,
            }}
            onPress={() => props.navigation.navigate(
              "SchedulePopulate")}
          /> : null}
        </View>
      </CustomCapsule>

      <View style={styles.capsule}>
        <View style={styles.innerCapsule}>

          <CalendarView
            containerStyle={{
              borderWidth: 1,
              borderColor: colors.gray,
            }}
            data={calendarData}
            slctdDate={slctdDate}
            setSlctdDate={setSlctdDate}
          />

          <ClassList
            containerStyle={styles.classListContainer}
            data={calendarData}
            dateString={slctdDate}
          />

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
    backgroundColor: "#00000040",
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