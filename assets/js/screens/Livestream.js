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
import LivestreamLayout from '../layouts/LivestreamLayout'



// const ptcListData = [
//     {
//         profileId: "1",
//         name: "Participant 1",
//         iconUri: require("../components/img/png/pfp-yoga.png"),
//     },
//     {
//         profileId: "2",
//         name: "Participant 2",
//         iconUri: require("../components/img/png/pfp-fitness.png"),
//     },
//     {
//         profileId: "3",
//         name: "Participant 3",
//         iconUri: require("../components/img/png/pfp-man.png"),
//     },
//     {
//         profileId: "4",
//         name: "Participant 4",
//         iconUri: require("../components/img/png/pfp-woman.png"),
//     },
//     {
//         profileId: "5",
//         name: "Participant 1",
//         iconUri: require("../components/img/png/pfp-man-2.png"),
//     },
//     {
//         profileId: "6",
//         name: "Participant 2",
//         iconUri: require("../components/img/png/pfp-man-3.png"),
//     },
//     {
//         profileId: "7",
//         name: "Participant 3",
//         iconUri: require("../components/img/png/pfp-man.png"),
//     },
//     {
//         profileId: "8",
//         name: "Participant 4",
//         iconUri: require("../components/img/png/pfp-woman.png"),
//     },
// ]

// const chatData = [
//     {
//         profileId: "8",
//         name: "Participant 4",
//         msgId: "-ABCDEF-",
//         message: "Let's goooo!",
//     },
//     {
//         profileId: "7",
//         name: "Participant 3",
//         msgId: "-ZXCVB-",
//         message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Habitant morbi tristique senectus et netus. Augue mauris augue neque gravida in. Ipsum nunc aliquet bibendum enim facilisis gravida neque convallis.",
//     },
//     {
//         profileId: "1",
//         name: "Participant 1",
//         msgId: "-BNM-",
//         message: "Risus sed vulputate odio ut enim blandit volutpat. In tellus integer feugiat scelerisque varius. Nisl vel pretium lectus quam id leo in vitae turpis. Ultricies mi quis hendrerit dolor magna. Lectus arcu bibendum at varius vel.",
//     },
//     {
//         profileId: "7",
//         name: "Participant 3",
//         msgId: "-FEDCBA-",
//         message: "Nice!",
//     },
// ]

// const selfProfileData = {
//     name: "Participant 3",
//     iconUri: require("../components/img/png/pfp-man.png"),
//     profileId: "7",
// }


  
function getPlaybackLink(playbackId) {
    return `https://stream.mux.com/${playbackId}.m3u8`
}



export default function Livestream(props) {
    let cache = props.route.params.cache
    // let gym = props.route.params.gym
    const gymId = props.route.params.gymId

    const [playbackLink, setPlaybackLink] = useState(null)
    console.log("playbackLink", playbackLink)

    const activePtcDbRef = database().ref(`livestreams/active_participants/${gymId}`)

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
            let res = await Promise.all([
                retrieveUserData(cache),
                retrievePlaybackId(cache, { gymId }),
            ])
            setUser(res[0])
            setPlaybackLink(getPlaybackLink(res[1]))
        }
        init()
    }, [])

    // (m3u8, webm, mp4) are guarantted to work with <Video />
    // const leagueOne = "https://lolstatic-a.akamaihd.net/frontpage/apps/prod/harbinger-l10-website/en-gb/production/en-gb/static/hero-0632cbf2872c5cc0dffa93d2ae8a29e8.webm"
    // const leagueTwo = "https://lolstatic-a.akamaihd.net/frontpage/apps/prod/harbinger-l10-website/en-gb/production/en-gb/static/hero-de0ba45b1d0959277d12545fbb645722.mp4"

    if (!user) return <View />

    return (
        <LivestreamLayout
            gymId={gymId}
            user={user}
        >
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
        </LivestreamLayout>
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