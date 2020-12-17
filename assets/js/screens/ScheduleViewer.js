import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Platform } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import AppBackground from "../components/AppBackground"

import CalendarView from "../components/CalendarView"
import ClassList from "../components/ClassList"
import Icon from '../components/Icon'

import {
  dateStringFromTimestamp,
} from "../backend/HelperFunctions"
import {
  filterUserClasses,
} from '../backend/HelperFunctions'
import { FONTS } from '../contexts/Styles' 
import { colors, simpleShadow } from '../contexts/Colors'
import CustomCapsule from '../components/CustomCapsule'
import GoBackButton from '../components/buttons/GoBackButton'
import CustomButton from "../components/CustomButton"
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

  const [openDropdown, setOpenDropdown] = useState(false)
  const [btnSelection, setBtnSelection] = useState("createClass")

  const [slctdDate, setSlctdDate] = useState(dateStringFromTimestamp(Date.now()))

  const [user, setUser] = useState(null)

  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")


  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      console.log("focused")

      const init = async () => {
        console.log("it worked!")
        const user = new User()
        setUser(await user.retrieveUser())
  
        const classes = new ClassesCollection() 
  
        console.log("classes: ", JSON.stringify(classes))
  
        // Determine which classes to display:
        // based on the provided gymId or classIds
        let classData
        if (classIds) {
          console.log(1111)
  
          classData = (await classes
            .retrieveWhere('id', 'in', classIds)
          ).map(it => it.getFormatted())
  
          setTitle('My Classes')
        
        } else if (gymId) {
          console.log(2222)
  
          const gym = new Gym()
          const {
            name,
          } = await gym.retrieveGym(gymId)
  
          console.log("gymId: ", gymId)
  
          classData = (await classes
            .retrieveWhere('gym_id', 'in', [ gymId ])
          ).map(it => it.getFormatted())
  
          console.log("classData: ", classData)
  
          setTitle(name)
          setSubtitle('Schedule')
        
        } else {
          console.log(3333)
  
          classData = ( await user.retrieveScheduledClasses() )
            .map(it => it.getFormatted())
          // if (user.accountType == 'user') classData = await filterUserClasses()
  
          console.log("classData", classData) // DEBUG
  
          setTitle('My Classes')
        }
  
        setCalendarData(classData)
      }; init()
      

      return () => {
        console.log("blurred")
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  useEffect(() => {
    console.log("props.route.params ", props.route.params[0])
    const init = async () => {
      const user = new User()
      setUser(await user.retrieveUser())

      const classes = new ClassesCollection() 

      console.log("classes: ", JSON.stringify(classes))

      // Determine which classes to display:
      // based on the provided gymId or classIds
      let classData
      if (classIds) {
        console.log(1111)

        classData = (await classes
          .retrieveWhere('id', 'in', classIds)
        ).map(it => it.getFormatted())

        setTitle('My Classes')
      
      } else if (gymId) {
        console.log(2222)

        const gym = new Gym()
        const {
          name,
        } = await gym.retrieveGym(gymId)

        console.log("gymId: ", gymId)

        classData = (await classes
          .retrieveWhere('gym_id', 'in', [ gymId ])
        ).map(it => it.getFormatted())

        console.log("classData: ", classData)

        setTitle(name)
        setSubtitle('Schedule')
      
      } else {
        console.log(3333)

        classData = ( await user.retrieveScheduledClasses() )
          .map(it => it.getFormatted())
        // if (user.accountType == 'user') classData = await filterUserClasses()

        console.log("classData", classData) // DEBUG

        setTitle('My Classes')
      }

      setCalendarData(classData)
    }; init()
  }, [])

  useEffect(() => {
    if (!calendarData) return

    // calendarData.forEach(({ active_times }) => {
    //   addFormattingToClassData(active_times)
    // })

    // addFunctionalityToClassData(calendarData, props.navigation)

    setCalendarData(calendarData)
    setDataIsFormatted(true)
  }, [calendarData])

  console.log("gymId: (scheduleViewer): ", gymId)
    console.log("classIds: (scheduleViewer): ", classIds)

  if (!user || !dataIsFormatted) return <View />

  return (
    <SafeAreaView style={{paddingTop: Platform.OS === 'android' ? 25 : 0, flex: 1, backgroundColor: colors.bg}}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollView} alwaysBounceVertical={false} >

      <AppBackground />

      <CustomCapsule
        containerStyle={{
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          paddingTop: 0,
          marginTop: 40,
          marginBottom: 0,
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
            position: "absolute"
          }}>
          <Text style={{
            width: "100%",
            textAlign: "center",
            marginBottom: 70,
            ...FONTS.body,
            fontSize: 30,
          }}>{title}</Text>
          {subtitle ?
          <Text style={{
            width: "100%",
            ...FONTS.body,
            textAlign: "center",
            fontSize: 18,
            marginBottom: -10
          }}>{subtitle}</Text> : null}
          </View>
        {/*           
          {user.account_type === "partner" ?
            // {/* 
            //   <PlusButton
            //       containerStyle={{
            //         position: "absolute",
            //         right: 15,
            //       }}
            //       imageContainerStyle={{
            //         width: 48,
            //         height: 48,
            //       }}
            //       onPress={() => props.navigation.navigate(
            //         "SchedulePopulate")} 
            //   >
           : null} */}
        </View>
      </CustomCapsule>

      {user.account_type === "partner" ?
        <View style={styles.capsule }>
              <CustomButton
                icon={
                  <Icon
                    source={require("../components/img/png/my-classes-2.png")}
                  />
                }
                style = {{marginBottom: 0}}
                title="Create Class"
                onPress={() => props.navigation.navigate(
                  "PartnerUpdateClasses"
                )}
              />
              <CustomButton
                icon={
                  <Icon
                    source={require("../components/img/png/my-classes-2.png")}
                  />
                }
                title="Schedule Class"
                onPress={() => props.navigation.navigate(
                  "SchedulePopulate"
                )}
              />
            </View>
          : null}
      


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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
  },
  capsule: {
    paddingRight: 10,
    paddingLeft: 10
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
  picker: {
    width: 110,
    height: 72,
    marginVertical: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    // borderColor: colors.gray,
    borderColor: colors.buttonFill,
    backgroundColor: "#333",
    color: "#f9f9f9"

  },
  pickerDropDown: {
    ...simpleShadow,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,

  },
  pickerItem: {
    paddingHorizontal: 20,

  },
  pickerLabel: {
    textAlign: "center",
    color: "#f9f9f9"

  }
})
