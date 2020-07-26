// import adapter from 'webrtc-adapter'

import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
// import Video from 'react-native-video'

import AppBackground from "../components/AppBackground"

import ChatButton from "../components/ChatButton"
import ListButton from "../components/ListButton"
import CancelButton from "../components/CancelButton"

import Chat from "../components/Chat"
import ParticipantList from "../components/ParticipantList"



export default function Livestream(props) {
    // const fetchReponsePromise = fetch("https://video-weaver.arn03.hls.ttvnw.net/v1/playlist/CsoE3IyQ8InuK3lCSaJK0ZN7w3ymyfLlOiBuSLfxIVugN_JsGGzg4jfB2NfVBDhSSNYICeFtGBEwUeREhWRMqVDhQKcH620J0-JxCDWVSLH2xn_vZ6d3UrkNCx3CHeEVlYyY_PIOnUtlKTqSciEWQQIhZsLVeaYKs_n4gik1r70bsgiOtdX_AiEiYIpIcjivThqpk3wpsPSKX4LU6brO_ip0ZgYAecKe8R7C2KBKtCpVHsQsSWgGUUHG1iClAfKa_oBdx6Un67U3MKyvyPxeAeGAVqnD_rW8emyIUMRtRXdkQTb9iypts3l4HGN1XdqbhZV89ce9G_gAY3CBeUKAoMFwcCmyuQCC_BsvnXPYEq8x29NCPlM3AgyJJO48jNOLDqaMKvsNBpccdeGeWMzWr0VIUTyZodzmS5RFKAakNFYQYUiITmbAXnRtbaYyF-zpgsJ9abEt6M24C4KSUejX8XE9iYH4LXbCsIrQv-qqCBBWJbTUmcPNvQSQj4-CLwDBFGYySNP4mJCU81JUIq5t_jNhaDCFvQCRtx9Tpr5m6Z4UghPOqgc9cNjyjuwKbV0Lc3RFFxHFFh2jBBprEc0jJrM8cfh_4pclPzcgCJC5wO-M5UAp9d0-GfxxQq2rMfEG4mhVSJfLHkBe05Ws8-Q1CeNigeS22X7UceMft9ASj0vZtPuybTQWeWWjKecqg9A8xaUjj8KhTA_1AdwLtAVUqeMVzqcrORB0iympO238wmkwWHIpVKxU1j4wyn-8soYpC-MCahLKHDkf-nmwLhIQcMA0mJ9ca0lqb6n04DE3PBoMKMYOnhhI5Fg9g7Rg.m3u8")
    // fetchReponsePromise.then((response) => {
    //     console.log(`Fetch:`)

    //     const reader = response.body.getReader()

    //     reader.read().then(({ done, value }) => {
    //         console.log("Done: ", done)
    //         console.log("Value: ", value)
    //     })
    // })
    const ptcListData = [
        {
            profileId: "1",
            name: "Participant 1",
            iconUri: require("../components/img/profile-icon-yoga.svg"),
        },
        {
            profileId: "2",
            name: "Participant 2",
            iconUri: require("../components/img/profile-icon-fitness.svg"),
        },
        {
            profileId: "3",
            name: "Participant 3",
            iconUri: require("../components/img/profile-icon-man.svg"),
        },
        {
            profileId: "4",
            name: "Participant 4",
            iconUri: require("../components/img/profile-icon-woman.svg"),
        },
        {
            profileId: "5",
            name: "Participant 1",
            iconUri: require("../components/img/profile-icon-yoga.svg"),
        },
        {
            profileId: "6",
            name: "Participant 2",
            iconUri: require("../components/img/profile-icon-fitness.svg"),
        },
        {
            profileId: "7",
            name: "Participant 3",
            iconUri: require("../components/img/profile-icon-man.svg"),
        },
        {
            profileId: "8",
            name: "Participant 4",
            iconUri: require("../components/img/profile-icon-woman.svg"),
        },
    ]

    const chatData = [
        {
            profileId: "8",
            name: "Participant 4",
            msgId: "-ABCDEF-",
            msg: "Let's goooo!",
        },
        {
            profileId: "7",
            name: "Participant 3",
            msgId: "-ZXCVB-",
            msg: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Habitant morbi tristique senectus et netus. Augue mauris augue neque gravida in. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis.",
        },
        {
            profileId: "1",
            name: "Participant 1",
            msgId: "-BNM-",
            msg: "Risus sed vulputate odio ut enim blandit volutpat. In tellus integer feugiat scelerisque varius. Nisl vel pretium lectus quam id leo in vitae turpis. Ultricies mi quis hendrerit dolor magna. Lectus arcu bibendum at varius vel.",
        },
        {
            profileId: "7",
            name: "Participant 3",
            msgId: "-FEDCBA-",
            msg: "Nice!",
        },
    ]

    const selfProfileData = {
        name: "Participant 3",
        iconUri: require("../components/img/profile-icon-man.svg"),
        profileId: "7",
    }

    const [chat, setChat] = useState(false)
    const [ptcList, setPtcList] = useState(false)

    function goBack() {
        props.navigation.navigate(props.route.params.referrer)
        // perhaps some connection close logic
        // ...
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />

            {/* <View style={styles.container}> */}

            <View style={styles.controlPanelContainer}>
                <ChatButton
                    onPress={() => {
                        setChat(!chat)
                        if (ptcList) setPtcList(false)
                    }}
                />
                <CancelButton
                    title="Leave Workout"
                    onLongPress={goBack}
                />
                <ListButton
                    onPress={() => {
                        setPtcList(!ptcList)
                        if (chat) setChat(false)
                    }}
                />
            </View>

            { chat
            ?   <Chat
                    containerStyle={styles.chatContainer}
                    data={chatData}
                    profileData={selfProfileData}
                />
            :   <View />}

            { ptcList
            ?   <ParticipantList
                    containerStyle={styles.ptcListContainer}
                    data={ptcListData}
                />
            :   <View />}

            {/* </View> */}

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    // container: {},
    controlPanelContainer: {
        width: "100%",
        paddingHorizontal: 15,
        paddingBottom: 15,
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    chatContainer: {
        width: "85%",
        height: 500,
        marginVertical: 50,
        position: "absolute",
        alignSelf: "center",
    },
    ptcListContainer: {
        width: "85%",
        height: 500,
        marginVertical: 50,
        position: "absolute",
        alignSelf: "center",
    },
})