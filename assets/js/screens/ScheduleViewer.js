import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"

import CustomCapsule from "../components/CustomCapsule"

import CalendarView from "../components/CalendarView"
import ClassList from "../components/ClassList"
import MenuPanel from "../components/MenuPanel"
import AddNewClass from "../components/AddNewClass"

import {
    datestringFromTimestamp,
    clockFromTimestamp,
    shortDateFromTimestamp
} from "../backend/HelperFunctions"



function addFormattingToData(docs) {
    return docs.map(doc => {
        let formatting = {
            dateString: datestringFromTimestamp(doc.begin_time),
            formattedDate:
                `${shortDateFromTimestamp(doc.begin_time)}`,
            formattedTime:
                `${clockFromTimestamp(doc.begin_time)} – ${clockFromTimestamp(doc.end_time)}`,
        }

        return Object.assign(doc, formatting)
    })
}

function addFunctionality({ navigation }, docs) {
    docs.forEach(doc => {
        doc.onPress = () => {
            navigation.navigate("ClassDescription", { data: doc })
        }
    })
    return docs
}



export default function ScheduleViewer(props) {
    let cache = props.route.params.cache
    let calendarData = props.route.params.data
    // let calendarData
    // let calendarType = props.route.params.calendarType

    const [r, refresh] = useState(0)
    
    const [slctdDate, setSlctdDate] = useState(datestringFromTimestamp( Date.now() ))

    const [Calendar, CalendarCreate] = useState(null)
    const [CalendarItemList, CalendarItemListCreate] = useState(null)

    useEffect(() => {
        let limit = 5 * (1000 / 200)
        let initCheck = setInterval(() => {
            limit--
            console.log("Checking...")
            // DO NOT PUT HERE ANYTHING COMPUTATIONALLY INTENSIVE
            // ...

            if (!cache.working || !limit) {
                console.log("cache.working", cache.working) //
                cache.working = 0 // reset it for good messure
                // And immediately clear the interval,
                // upon receiving desired outcome
                clearInterval(initCheck)
                console.log("Interval cleared.")
                refresh(r + 1)
            }
        }, /*25*/200)
    }, [])

    useEffect(() => {
        if (!r) return

        // switch(calendarType) {
        //     case "user":
        //         calendarData = cache.classes
        //         break
        //     case "partner":
        //         calendarData = cache.classes
        //         break
        //     case "gym":
        //         calendarData = cache.gymClasses[gymId]
        // }

        calendarData = addFormattingToData(calendarData)
        calendarData = addFunctionality(props, calendarData)
    }, [r])

    useEffect(() => {
        if (!r) return

        CalendarCreate(
            <CalendarView
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

    }, [r, slctdDate])

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>

            <AppBackground />

            {cache.user.account_type === "user" ? <View/> :
            <MenuPanel>
                <AddNewClass
                    navigation={props.navigation}
                />
            </MenuPanel>}

            <Text style={{
                marginVertical: 20,
                textAlign: "center",
                fontSize: 30,
            }}>Schedule</Text>
            
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
        backgroundColor: "#FFFFFF80",
        borderRadius: 40,
    },
    classListContainer: {
        marginTop: 10,
    },
})