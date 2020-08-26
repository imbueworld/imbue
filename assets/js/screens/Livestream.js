import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import Video from 'react-native-video'

import ChatButton from "../components/ChatButton"
import ListButton from "../components/ListButton"
import CancelButton from "../components/CancelButton"

import Chat from "../components/Chat"
import ParticipantList from "../components/ParticipantList"

import database from "@react-native-firebase/database"
import { sendMessage, registerParticipant } from '../backend/LivestreamFunctions'
import { retrieveUserData, retrievePlaybackId } from '../backend/CacheFunctions'
import LivestreamMessages from '../components/LivestreamMessages'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'



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
        message: "Let's goooo!",
    },
    {
        profileId: "7",
        name: "Participant 3",
        msgId: "-ZXCVB-",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Habitant morbi tristique senectus et netus. Augue mauris augue neque gravida in. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis.",
    },
    {
        profileId: "1",
        name: "Participant 1",
        msgId: "-BNM-",
        message: "Risus sed vulputate odio ut enim blandit volutpat. In tellus integer feugiat scelerisque varius. Nisl vel pretium lectus quam id leo in vitae turpis. Ultricies mi quis hendrerit dolor magna. Lectus arcu bibendum at varius vel.",
    },
    {
        profileId: "7",
        name: "Participant 3",
        msgId: "-FEDCBA-",
        message: "Nice!",
    },
]

const selfProfileData = {
    name: "Participant 3",
    iconUri: require("../components/img/png/pfp-man.png"),
    profileId: "7",
}


  
function getPlaybackLink(playbackId) {
    return `https://stream.mux.com/${playbackId}.m3u8`
}

export default function Livestream(props) {
    let cache = props.route.params.cache
    // let gym = props.route.params.gym
    let gymId = props.route.params.gymId

    const [playbackLink, setPlaybackLink] = useState(null)
    console.log("playbackLink", playbackLink)

    const activePtcDbRef = database().ref(`livestreams/active_participants/${gymId}`)
    const chatDbRef = database().ref(`livestreams/messages/${gymId}`)
    const [ptcNodeRef, setPtcNodeRef] = useState(null)

    const [user, setUser] = useState(null)
    const [chat, setChat] = useState([])
    const [ptcList, setPtcList] = useState([])

    const [chatPopup, setChatPopup] = useState(false)
    const [ptcListPopup, setPtcListPopup] = useState(false)
    const [buttonPanelPopup, setButtonPanelPopup] = useState(null)
    const [buttonPanelTimeouts, setButtonPanelTimeouts] = useState([])

    // const [message, setMessage] = useState("")

    useEffect(() => {
        const init = async () => {
            let user = await retrieveUserData(cache)
            setUser(user)

            const ptcNodeRef = await registerParticipant({
                gymId,
                name: user.name,
                uid: user.id,
                icon_uri: user.icon_uri,
            })
            setPtcNodeRef(ptcNodeRef)
            // database().ref(`livestreams/active_participants/${gymId}/${user.id}`)
            ptcNodeRef
                .onDisconnect()
                .set(null)

            activePtcDbRef.on('value', snap => {
                setPtcList(Object.values(snap.val()))
            }, err => {
                console.log("[ERROR ptc]", err.message)
            })

            let playbackId = await retrievePlaybackId(cache, { gymId })
            setPlaybackLink(getPlaybackLink(playbackId))
        }
        init()
    }, [])

    useEffect(() => {
        const init = async () => {
            chatDbRef.on('value', snap => {
                setChat(Object.values(snap.val()))
            }, err => {
                console.log("[ERROR chat]", err.message)
            })
        }
        init()
    }, [])

    useEffect(() => {
        bringUpButton(1500 * 3)
    }, [])

    let buttonPanelTimeout
    async function bringUpButton(duration=4500 * 1.5) {
        setButtonPanelPopup(true)
        clearTimeout(buttonPanelTimeout)
        await new Promise(r => {
            buttonPanelTimeout = setTimeout(() => {
                setButtonPanelPopup(false)
                r()
            }, duration)
            // setButtonPanelTimeouts([
            //     ...buttonPanelTimeouts,
            //     timeout
            // ])
        })
    }

    // const chatRef = useRef(null)
    // function setChatMessages(component) {
    //     chatRef.current.setNativeProps({
    //         children: <Text>YEaaaa</Text>,//component,
    //         style: {
    //             height: 200,
    //             backgroundColor: "#00000010",
    //         },
    //     })
    // }



    // // All these links work with <Video /> (m3u8, webm, mp4)
    // const uriNymn = "https://video-weaver.arn03.hls.ttvnw.net/v1/playlist/CssEB1smDectDepLEonZHtPJvDc59VQBWAmeLlCt05AiejkvIKMxZQM0A4lRXvre43u-okk6sN_8ZTn975I9pjekF0USVydBRdutzhihLmnMwlI4aO3TZkYgl2CWSSTQeYscPaUctZA75coO8Hw_MufFYJU6YlDxa5FMTGJjz-NjfyqrxT5L6uPJGEAGvdVg1MVEsUQa6IYzeHv6AIqL30-pV--WU2RaIsphNRTZOrtrIA9tPMKEREu9qCPIeB9XZyHAWgJVlldhcMhvcmI4OCOPahMkAwuLIiYzHNfl77OdPTwtI3jSoNuq6HYDKGFeo-nkp8Jrjkt3QLItfu0LaTAAQ0H8xKBTLFWX4EYrewW4cLL7zQ7-qncWy69GMju247UKFu0421CJLmOx5OBXS3joDnlBw9vWmw8rqE1kktCQi4vnM3QNXiCqZwOOAS9N5KczXhqMa4iY1yYk5aW8LMYHdGYg82vDpyMUM3Z-xWM939vD4b5PRA_Sb1d_WZ6rgiQJps0sbAzX_jvOAH5mxq1rf9YwazbxHffikn9TT4dTB7usoOYR7-cyxovv9c621ARnrYvwU1hSLMBCOdYhw-u1VzVWHXJlDUtAX44uccoLBc4_dkwM23EMALKFGSMt9AruGOVVWI2j5ztiyleUVOHjD4Ju9Yqcsj2BOUsPeiWlzLb6IHmQjVi9xzAhKjD1o_hQXzDiXkP3MI-UgsuvZnqmLuOylUeZnv-cC-rQW02UCWGUZ6q7VWP68lD6553L7KMP-w9TKbhSNLMvk14SEPIOzIhbu8lmuY_OcBFei7saDLGZGIBkE4i6tYDeHw.m3u8"
    // const leagueOne = "https://lolstatic-a.akamaihd.net/frontpage/apps/prod/harbinger-l10-website/en-gb/production/en-gb/static/hero-0632cbf2872c5cc0dffa93d2ae8a29e8.webm"
    // const leagueTwo = "https://lolstatic-a.akamaihd.net/frontpage/apps/prod/harbinger-l10-website/en-gb/production/en-gb/static/hero-de0ba45b1d0959277d12545fbb645722.mp4"
    // const myMuxLivestream = "https://stream.mux.com/nnRviCVztVZ2oRRvLId81xO8MTQdrtjP6xJ902ymxGWE.m3u8"

    if (!user) return <View />

    return (
        <>
        {/* Some sort of background */}
        <View style={{
            position: "absolute",
            backgroundColor: "black",
            width: "100%",
            height: "100%",
        }}/>
        
        {/* <TouchableWithoutFeedback
            style={{
                zIndex: 101,
            }}
            onPress={bringUpButton}
        /> */}

        {buttonPanelPopup
        ?   <View style={{
                ...styles.controlPanelContainer,
                zIndex: 100,
            }}>
                <ChatButton
                    onPress={() => {
                        setChatPopup(!chatPopup)
                        if (ptcListPopup) setPtcListPopup(false)
                    }}
                />
                <CancelButton
                    title="Leave Workout"
                    onLongPress={() => {
                        if (ptcNodeRef) ptcNodeRef.set(null)
                        chatDbRef.off()
                        activePtcDbRef.off()
                        props.navigation.goBack()
                    }}
                />
                <ListButton
                    onPress={() => {
                        setPtcListPopup(!ptcListPopup)
                        if (chatPopup) setChatPopup(false)
                    }}
                />
            </View>
        :   <TouchableWithoutFeedback
                style={{
                    width: "100%",
                    height: "100%",
                }}
                onPress={bringUpButton}
            />}

        { chatPopup
        ?   <Chat
                containerStyle={styles.chatContainer}
                // data={chat}
                // profileData={selfProfileData}
                // value={message}
                // onChangeText={setMessage}
                // chatRef={chatRef}
                onPress={(message) => {
                    console.log("[Message]", message)
                    sendMessage({
                        gymId,
                        uid: user.id,
                        name: `${user.first} ${user.last}`,
                        message
                    })
                    // setChat([{ name: "lmao", message: "wow" }])

                    // setChatMessages(
                    //     <LivestreamMessages
                    //         chat={chat}
                    //         user={user}
                    //     />
                    // )
                    setChat([...chat, { name: user.name, message }])
                }}
            >
                <LivestreamMessages
                    chat={chat}
                    user={user}
                />
            </Chat>
        :   <View />}

        { ptcListPopup
        ?   <ParticipantList
                containerStyle={styles.ptcListContainer}
                data={ptcList}
            />
        :   <View />}

        {/* { !playbackLink ? null :
        <Video
            style={styles.video}
            source={{ uri: playbackLink }}
            onBuffer={() => {console.log("Buffering video...")}}
            onError={() => {console.log("Error on video!")}}
            paused={false}
            resizeMode={"contain"}
            // repeat={true}
        />} */}

        </>
    )
}

const styles = StyleSheet.create({
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
        width: "88%",
        height: "70%",
        // flex: 1,
        // marginVertical: 50,
        marginTop: 30,
        position: "absolute",
        alignSelf: "center",
    },

    ptcListContainer: {
        width: "88%",
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