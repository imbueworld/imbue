import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import AppBackground from "../components/AppBackground"

import CustomCapsule from "../components/CustomCapsule"

import CalendarView from "../components/CalendarView"
import ClassList from "../components/ClassList"
import MenuPanel from "../components/MenuPanel"
import AddNewClass from "../components/AddNewClass"

import firebase from "firebase/app"
import "firebase/functions"

import { clockFromTimestamp, shortDateFromTimestamp, datestringFromTimestamp} from "../backend/HelperFunctions"
import { retrieveUserClasses, retrievePartnerClasses } from '../backend/CacheFunctions'



export default function ClassesSchedule(props) {
    let cache = props.route.params.cache

    const [data, setData] = useState([])
    const [slctdDate, setSlctdDate] = useState(datestringFromTimestamp( Date.now() ))

    function addFormattingToData(data) {
        return data.map(doc => {
            let formatting = {
                dateString: datestringFromTimestamp(doc.begin_time),
                listFormattedDate:
                    `${shortDateFromTimestamp(doc.begin_time)}`,
                listFormattedTime:
                    `${clockFromTimestamp(doc.begin_time)} – ${clockFromTimestamp(doc.end_time)}`,
            }

            return Object.assign(doc, formatting)
        })
    }

    useEffect(() => {
        async function init() {
            if (cache.user.account_type === "partner") {
                setData( addFormattingToData( await retrievePartnerClasses(cache) ))
            } else if (cache.user.account_type === "user") {
                setData( addFormattingToData( await retrieveUserClasses(cache) ))
            }
        }
        init()
    }, [])

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
            
            <View
                style={styles.capsule}
            >

                <CalendarView
                    data={data}
                    slctdDate={slctdDate}
                    setSlctdDate={setSlctdDate}
                />

                <ClassList
                    containerStyle={styles.classListContainer}
                    data={data}
                    dateString={slctdDate}
                />

            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    capsule: {
        width: "85%",
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