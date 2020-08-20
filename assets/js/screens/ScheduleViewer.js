import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"

import CalendarView from "../components/CalendarView"
import ClassList from "../components/ClassList"

import {
    datestringFromTimestamp,
    clockFromTimestamp,
    shortDateFromTimestamp,
    addFormattingToClassData,
    addFunctionalityToClassData
} from "../backend/HelperFunctions"
import { TouchableOpacity } from 'react-native-gesture-handler'
import { retrieveClassesByIds, retrieveClassesByGymIds } from '../backend/CacheFunctions'
import { fonts } from '../contexts/Styles'



// function addFormattingToData(docs) {
//     if (!(docs instanceof Array)) return

//     return docs.map(doc => {
//         let formatting = {
//             dateString: datestringFromTimestamp(doc.begin_time),
//             formattedDate:
//                 `${shortDateFromTimestamp(doc.begin_time)}`,
//             formattedTime:
//                 `${clockFromTimestamp(doc.begin_time)} – ${clockFromTimestamp(doc.end_time)}`,
//         }

//         return Object.assign(doc, formatting)
//     })
// }

// function addFunctionality({ navigation }, docs) {
//     if (!(docs instanceof Array)) return

//     docs.forEach(doc => {
//         doc.onPress = () => {
//             navigation.navigate("ClassDescription", { data: doc })
//         }
//     })
//     return docs
// }



export default function ScheduleViewer(props) {
    let cache = props.route.params.cache
    let params = props.route.params

    const [cacheIsWorking, setCacheIsWorking] = useState(true)

    const [calendarData, setCalendarData] = useState(null)
    const [dataIsFormatted, setDataIsFormatted] = useState(false)
    
    const [slctdDate, setSlctdDate] = useState(datestringFromTimestamp( Date.now() ))

    const [Calendar, CalendarCreate] = useState(null)
    const [CalendarItemList, CalendarItemListCreate] = useState(null)

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
            // Determine which classes to display:
            // based on the provided gymId or classIds
            if (params.classIds) {
                setCalendarData( await retrieveClassesByIds(cache, { classIds: params.classIds }) )
            } else if (params.gymId) {
                setCalendarData( await retrieveClassesByGymIds(cache, { gymIds: [params.gymId] }) )
            } else console.warn("Calendar is missing data. It most likely was not provided.")
        }
        init()
    }, [cacheIsWorking])

    useEffect(() => {
        if (!calendarData) return

        calendarData.forEach(({ active_times }) => {
            addFormattingToClassData(active_times)
        })

        addFunctionalityToClassData(calendarData)

        console.log("calendarData", calendarData)

        setCalendarData(calendarData)
        setDataIsFormatted(true)


        // calendarData = addFormattingToData(calendarData)
        // calendarData = addFunctionality(props, calendarData)
        // setCalendarData(addFormattingToData(calendarData))
        // setCalendarData(addFunctionality(props, calendarData))
        // setDataIsFormatted(true)
    }, [calendarData])

    useEffect(() => {
        if (!dataIsFormatted) return

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

    }, [dataIsFormatted, slctdDate])

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>

            <AppBackground />

            {/* {cache.user.account_type === "user" ? <View/> :
            <MenuPanel>
                <AddNewClass
                    cache={cache}
                />
            </MenuPanel>} */}
            <View style={{
                width: 60,
                height: 60,
                position: "absolute",
                zIndex: 110,
            }}>
                <TouchableOpacity
                    style={{
                        width: "100%",
                        height: "100%",
                        top: 10,
                        left: 30,
                        zIndex: 110,
                    }}
                    onPress={() => props.navigation.navigate("SchedulePopulate")}
                >
                    <Text style={{
                        width: "100%",
                        height: "100%",
                        textAlign: "center",
                        textAlignVertical: "center",
                        backgroundColor: "white",
                        borderRadius: 999,
                        fontSize: 40,
                        fontFamily: fonts.default,
                    }}>{"+"}</Text>
                </TouchableOpacity>
            </View>

            <Text style={{
                marginVertical: 20,
                textAlign: "center",
                fontSize: 30,
                fontFamily: fonts.default,
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