import React, { useState } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'

import AppBackground from "../components/AppBackground"

import CustomTextInput from "../components/CustomTextInput"

import ToastExample from "../native-to-js-modules/ToastExample"
import AndroidLivestream from "../native-to-js-modules/AndroidLivestream"



export default function PartnerLivestreamDashboard(props) {
    const [streamKeyField, setStreamKeyField] = useState("")
    const [streamKeyField2, setStreamKeyField2] = useState("")

    ToastExample.show("Awesome", ToastExample.SHORT)
    const streamKey = "a3c6b4e3-a477-7174-05e0-2be62275f3cf"
    AndroidLivestream.setStreamKey(streamKey, console.log, console.log)
    AndroidLivestream.startRecording(console.log, console.log)
    setTimeout(() => {AndroidLivestream.stopRecording(console.log, console.log)}, 3000)
    // setTimeout(() => {AndroidLivestream.stopRecording(console.log, console.log)}, 10 * 1000)

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <View style={styles.container}>
                <CustomTextInput
                    placeholder="Stream Secret Key"
                    value={streamKeyField}
                    onChangeText={setStreamKeyField}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {},
})