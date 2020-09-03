import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "./CustomButton"
import CustomTextInput from "./CustomTextInput"
import CustomSelectButton from "./CustomSelectButton"
import CustomOptionSelector from "./CustomOptionSelector"
import CustomCapsule from "./CustomCapsule"

import firebase from "firebase/app"
import "firebase/functions"
import "firebase/auth"
import { retrieveUserData } from '../backend/CacheFunctions'
import { useNavigation } from '@react-navigation/native'
import { fullTimeToTimestamp } from "../backend/HelperFunctions"





function validateTime(time) {
    return true
    ////////

    let [hh, mm] = time.split(":")

    if (parseInt(hh) < 0 || parseInt(hh) > 23) return false
    if (parseInt(mm) < 0 || parseInt(mm) > 59) return false
    return true
}



/**
 * props
 *  .cache -- needs
 */
export default function AddNewClass(props) {
    let cache = props.cache
    let navigation = useNavigation()

    const [user, setUser] = useState(null)

    useEffect(() => {
        const init = async() => {
            let user = await retrieveUserData(cache)
            setUser(user)
        }
        init()
    }, [])

    // const [form, setForm] = useState("ok")
    const [errorText, setErrorText] = useState("")
    const [applyOnlyOneDay, setApplyOnlyOneDay] = useState(true)

    const [beginClock, setBeginClock] = useState("")
    const [endClock, setEndClock] = useState("")
    
    const [beginTime, setBeginTime] = useState("2020-08-08 07:00")
    const [endTime, setEndTime] = useState("2020-08-08 10:00")
    const [name, setName] = useState("Fitness training")
    const [desc, setDesc] = useState("In this class you will be taught how to ...")
    const [instructor, setInstructor] = useState("Oskar Birch")

    const slctdType = [""]
    const slctdDays = [""]

    function enterTime(text, setField) {
        let colons = text.match(/:/g)
        let letters = text.match(/[a-zA-Z]/g)
        console.log(colons)
        if (colons || letters) {
            if (colons && colons.length > 1) {
                // setForm("error/invalid_time_format")
                setErrorText("Time format must be as follows: HH:MM")
                }
            if (letters) setErrorText("Time format must be as follows: HH:MM")
        } else setErrorText("")
        setField(text)
    }

    async function validateAndSubmit() {
        if (!( beginTime.length !== 0
            && endTime.length !== 0
            && name.length !== 0
            && desc.length !== 0
            && instructor.length !== 0
        )) {
            setErrorText("All fields must be filled.")
            return
        }

        if (!validateTime(beginTime)) {
            // setForm("error/invalid_time_format_begin_time")
            setErrorText("Begin time format must be as follows: YYYY-MM-DD HH-MM")
            return
        }
        if (!validateTime(endTime)) {
            // setForm("error/invalid_time_format_end_time")
            setErrorText("End time format must be as follows: YYYY-MM-DD HH:MM")
            return
        }

        let bT = fullTimeToTimestamp(beginTime)
        let eT = fullTimeToTimestamp(endTime)

        if (bT > eT) {
            setErrorText("Class ending time must be later than its starting time.")
            return
        }

        const doc = {
            partner_id: firebase.auth().currentUser.uid,
            begin_time: bT,
            end_time: eT,
            dates: "ERR_NOT_IMPL",// dates,
            type: slctdType[0],
            instructor: instructor,
            name: name,
            description: desc,
        }

        try {
            const addClass = firebase.functions().httpsCallable("addClass")
            await addClass(doc)
            // setForm("success")
            setErrorText("")
            // props.onX()
            navigation.goBack()
        } catch(err) {
            setErrorText(err.message || err)
            // setForm("fail")
        }
    }

    if (!user) return <View />

    return (
        <ProfileLayout
            innerContainerStyle={{
                paddingBottom: 10,
            }}
            data={{ name: user.name, iconUri: user.icon_uri }}
        >

            <View stlye={styles.errorContainer}>
                <Text style={styles.errorText}>{errorText}</Text>
            </View>

            <CustomTextInput
                placeholder="Class Begin Time (HH:MM)"
                // keyboardType="numeric"
                onChangeText={text => enterTime(text, setBeginTime)}
                value={beginTime}
            />
            <CustomTextInput
                placeholder="Class End Time (HH:MM)"
                // keyboardType="numeric"
                onChangeText={text => enterTime(text, setEndTime)}
                value={endTime}
            />
            <CustomTextInput
                placeholder="Class Name"
                onChangeText={setName}
                value={name}
            />
            <CustomTextInput
                placeholder="Instructor"
                onChangeText={setInstructor}
                value={instructor}
            />
            <CustomTextInput
                containerStyle={{ height: undefined, maxHeight: 400 }}
                multiline
                numberOfLines={5}
                placeholder="Description of the Class"
                onChangeText={setDesc}
                value={desc}
            />

            {/* <CustomSelectButton
                style={{
                    // height: 40,
                    // marginVertical: 10,
                }}
                options={{studio: "In Studio", online: "Online"}}
                info={slctdType}
            /> */}

            {/* <CustomSelectButton
                style={{
                    // height: 40,
                    // marginVertical: 10,
                }}
                options={{oneTime: "One Time", selectDays: "Select Days"}}
                onPress={() => {setApplyOnlyOneDay(!applyOnlyOneDay)}}
            /> */}

            {/* <CustomOptionSelector
                style={styles.weekdaySelector}
                options={{sun: "S", mon:"M", tue:"T", wed:"W", thu: "Th", fri:"F", sat:"Sa"}}
                info={slctdDays}
            /> */}

            {/* <CustomTextInput
                placeholder="End Date"
                // onChangeText={}
                // value={}
            /> */}

            <CustomButton
                title="Save"
                onPress={validateAndSubmit}
            />
        
        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    weekdaySelector: {
    },
    errorContainer: {},
    errorText: {
        color: "red",
    },
})