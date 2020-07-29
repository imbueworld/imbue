import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import Video from 'react-native-video'

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
            iconUri: require("../components/img/png/pfp-yoga.png"),
        },
        {
            profileId: "2",
            name: "Participant 2",
            iconUri: require("../components/img/png/pfp-fitness.png"),
        },
        {
            profileId: "3",
            name: "Participant 3",
            iconUri: require("../components/img/png/pfp-man.png"),
        },
        {
            profileId: "4",
            name: "Participant 4",
            iconUri: require("../components/img/png/pfp-woman.png"),
        },
        {
            profileId: "5",
            name: "Participant 1",
            iconUri: require("../components/img/png/pfp-man-2.png"),
        },
        {
            profileId: "6",
            name: "Participant 2",
            iconUri: require("../components/img/png/pfp-man-3.png"),
        },
        {
            profileId: "7",
            name: "Participant 3",
            iconUri: require("../components/img/png/pfp-man.png"),
        },
        {
            profileId: "8",
            name: "Participant 4",
            iconUri: require("../components/img/png/pfp-woman.png"),
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
        iconUri: require("../components/img/png/pfp-man.png"),
        profileId: "7",
    }

    const [chat, setChat] = useState(false)
    const [ptcList, setPtcList] = useState(false)

    function goBack() {
        props.navigation.navigate(props.route.params.referrer)
        // perhaps some connection close logic
        // ...
    }


    // All these links work with <Video /> (m3u8, webm, mp4)
    const uriNymn = "https://video-weaver.arn03.hls.ttvnw.net/v1/playlist/CssEB1smDectDepLEonZHtPJvDc59VQBWAmeLlCt05AiejkvIKMxZQM0A4lRXvre43u-okk6sN_8ZTn975I9pjekF0USVydBRdutzhihLmnMwlI4aO3TZkYgl2CWSSTQeYscPaUctZA75coO8Hw_MufFYJU6YlDxa5FMTGJjz-NjfyqrxT5L6uPJGEAGvdVg1MVEsUQa6IYzeHv6AIqL30-pV--WU2RaIsphNRTZOrtrIA9tPMKEREu9qCPIeB9XZyHAWgJVlldhcMhvcmI4OCOPahMkAwuLIiYzHNfl77OdPTwtI3jSoNuq6HYDKGFeo-nkp8Jrjkt3QLItfu0LaTAAQ0H8xKBTLFWX4EYrewW4cLL7zQ7-qncWy69GMju247UKFu0421CJLmOx5OBXS3joDnlBw9vWmw8rqE1kktCQi4vnM3QNXiCqZwOOAS9N5KczXhqMa4iY1yYk5aW8LMYHdGYg82vDpyMUM3Z-xWM939vD4b5PRA_Sb1d_WZ6rgiQJps0sbAzX_jvOAH5mxq1rf9YwazbxHffikn9TT4dTB7usoOYR7-cyxovv9c621ARnrYvwU1hSLMBCOdYhw-u1VzVWHXJlDUtAX44uccoLBc4_dkwM23EMALKFGSMt9AruGOVVWI2j5ztiyleUVOHjD4Ju9Yqcsj2BOUsPeiWlzLb6IHmQjVi9xzAhKjD1o_hQXzDiXkP3MI-UgsuvZnqmLuOylUeZnv-cC-rQW02UCWGUZ6q7VWP68lD6553L7KMP-w9TKbhSNLMvk14SEPIOzIhbu8lmuY_OcBFei7saDLGZGIBkE4i6tYDeHw.m3u8"
    const leagueOne = "https://lolstatic-a.akamaihd.net/frontpage/apps/prod/harbinger-l10-website/en-gb/production/en-gb/static/hero-0632cbf2872c5cc0dffa93d2ae8a29e8.webm"
    const leagueTwo = "https://lolstatic-a.akamaihd.net/frontpage/apps/prod/harbinger-l10-website/en-gb/production/en-gb/static/hero-de0ba45b1d0959277d12545fbb645722.mp4"

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />

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

            <Video
                style={styles.video}
                source={{uri: uriNymn}}
                onBuffer={() => {console.log("Buffering video...")}}
                onError={() => {console.log("Error on video!")}}
                paused={false}
                resizeMode={"contain"}
                // repeat={true}
            />

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
    video: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: -100,
    },
})