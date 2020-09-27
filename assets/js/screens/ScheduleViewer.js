import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native'

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
  retrieveClassesByUser,
  filterUserClasses,
  retrieveGymsByIds
} from '../backend/CacheFunctions'
import { fonts } from '../contexts/Styles'
import { colors } from '../contexts/Colors'
import CustomCapsule from '../components/CustomCapsule'
import GoBackButton from '../components/buttons/GoBackButton'
import PlusButton from '../components/buttons/PlusButton'



export default function ScheduleViewer(props) {
  let cache = props.route.params.cache
  let params = props.route.params

  const [calendarData, setCalendarData] = useState(null)
  const [dataIsFormatted, setDataIsFormatted] = useState(false)

  const [slctdDate, setSlctdDate] = useState(datestringFromTimestamp(Date.now()))

  const [user, setUser] = useState(null)

  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")

  useEffect(() => {
    const init = async () => {
      let user = await retrieveUserData(cache)
      setUser(user)

      // Determine which classes to display:
      // based on the provided gymId or classIds
      let classes
      if (params.classIds) {
        setTitle("My Classes")
        classes = await retrieveClassesByIds(cache, { classIds: params.classIds })
      } else if (params.gymId) {
        let gyms = await retrieveGymsByIds(cache, { gymIds: [params.gymId] })
        let gym = gyms[0]
        setTitle(gym.name)
        setSubtitle("Schedule")

        classes = await retrieveClassesByGymIds(cache, { gymIds: [params.gymId] })
      } else {
        setTitle("My Classes")

        classes = await retrieveClassesByUser(cache)
        classes = await filterUserClasses(cache)
      }

      setCalendarData(classes)
    }
    init()
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