import React, { useEffect, useState } from 'react'
import { View, Text, BackHandler, PanResponder, TouchableOpacity } from 'react-native'

import database from "@react-native-firebase/database"

import ChatButton from '../components/ChatButton'
import CancelButton from '../components/CancelButton'
import ListButton from '../components/ListButton'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useDimensions } from '@react-native-community/hooks'

import { useNavigation } from '@react-navigation/native'
import { registerParticipant, sendMessage } from '../backend/LivestreamFunctions'
import ParticipantList from '../components/ParticipantList'
import Chat from '../components/Chat'
import LiveViewerCountBadge from '../components/badges/LiveViewerCountBadge'
import cache from '../backend/storage/cache'
import GoLiveButton from '../components/buttons/GoLiveButton'
import GoBackButton from '../components/buttons/GoBackButton'
import config from '../../../App.config' 
import User from '../backend/storage/User'
import { simpleShadow } from '../contexts/Colors'
import Icon from '../components/Icon'
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler'
import { FONTS } from '../contexts/Styles'
import firestore from '@react-native-firebase/firestore';


const layoutOptions = {
  viewerCount: {
    show: true,
  },
}

const buttonOptions = {
  goBack: {
    show: false,
  },
  goLive: {
    show: false,
    state: "idle" || "streaming",
    onPress: () => {},
  },
  leaveLivestream: {
    show: true,
  },
  viewParticipants: {
    show: true,
    state: "closed" || "open",
  },
  viewChat: {
    show: true,
    state: "closed" || "open", 
  },
  viewButtonPanel: {
    show: true,
    state: "open" || "closed",
    data: null, // stores the timeout_id that is created upon show
  },
}



export default function LivestreamLayout(props) {
  // const [gymId, setGymId] = useState(null)
  // const [user, setUser] = useState(null)

  const gymId = props.gymId
  const user = props.user
  const isLive = props.isLive
  const gymImage = props.gymImageUri
  const gymName = props.gymName
  const liveStatus = props.liveStatus
  const { width, height } = useDimensions().window
  const cardIconLength = width / 4
  if (!gymId) throw new Error("prop gymId must be provided")
  if (!user) throw new Error("prop user must be provided")
  let navigation = useNavigation()


  const [r, refresh] = useState(0)

  const {
    containerStyle={},
    imageContainerStyle={},
    imageStyle={},
    //
    onPress=() => navigation.navigate("PartnerDashboard"),
  } = props

  // Apply props.buttonOptions to buttonOptions
  useEffect(() => {
    if (props.buttonOptions) {
      Object.entries(props.buttonOptions).forEach(([button, instructions]) => {
        Object.entries(instructions).forEach(([key, value]) => {
          buttonOptions[ button ][ key ] = value
        })
      })
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      await registerParticipant({
        gymId,
        name: user.name,
        uid: user.id,
        icon_uri: user.icon_uri,
      })

      const chatNodeRef = database().ref(`livestreams/messages/${gymId}`)
      // [COMMENTED OUT IN ORDER TO NOT SHOW PAST MESSAGES,
      // POSSIBLY FROM LAST LIVESTREAM]
      // await chatNodeRef.once('value', snap => {
      //   let data = snap.val()
      //   if (data) {
      //     const messages = Object.values(data)
      //     // Assumes existing data that may be in cache upon the very first
      //     // render of this component is irrelevant and to be overwritten
      //     cache("livestream/chat").set(messages)
      //   }
      // })

      chatNodeRef.limitToLast(1).on('child_added', snap => {
        const message = snap.val()

        // Don't show very first message, because it is most likely not a live message
        let canShowMessageNow = cache('livestream/canShowMessageNow')
        if (!canShowMessageNow.get()) {
          canShowMessageNow.set(true)
          return
        }

        let existingMessages = cache("livestream/chat").get() || []

        // Do not add, if an exact same message is already in chat
        let x = existingMessages.map(msg => `${msg.timestamp}${msg.message}`)
        let y = `${message.timestamp}${message.message}`
        if (x.includes(y)) return
        
        const newSetOfMessages = [
          ...existingMessages,
          message
        ]

        // Update cache
        cache("livestream/chat").set(newSetOfMessages)

        // Update <LivestreamMessages />
        const setChat = cache("livestream/functions/setChat").get()
        if (typeof setChat === "function") setChat(newSetOfMessages)
      })
    }
    init()
    // if (chatNodeRef) {
    //   return () => chatNodeRef.off()
    // }
    
  }, [])


  useEffect(() => {
    const ptcsNodeRef = database().ref(`livestreams/participants/${gymId}`)

    const init = async () => {
      await ptcsNodeRef.once('value', async snap => {
        const users = snap.val()
        if (users) {
          let ptcs = Object.entries(users).map(([uid, userData]) => {
            userData.uid = uid
            return userData
          })
          // Assumes existing data that may be in cache upon the very first
          // render of this component is irrelevant and to be overwritten
          cache("livestream/participants").set(ptcs)

          let liveCount = ptcs.filter(ptc => ptc.here).length
          cache("livestream/viewerCount").set(liveCount)
          refresh(r => r + 1)
        }
      })

      /**
       * Update or append new users that come into the livestream,
       * update their 'here' status,
       * update cache and certain Child Components.
       */
      ptcsNodeRef.on('child_changed', snap => {
        const user = { ...snap.val(), uid: snap.key }
        let existingPtcs = cache("livestream/participants").get() || []
        const newSetOfPtcs = [ user, ...existingPtcs ]

        // child_changed can provide an entirely new user, or an update to an existing one
        // let's distinguish..
        let existingUids = existingPtcs.map(ptc => ptc.uid)
        const action = existingUids.includes(user.uid) ? "update" : "creation"

        // Update existingPtcs to meet current state
        if (action === "update") {
          existingPtcs.forEach(ptc => {
            if (ptc.uid === user.uid) {
              for (let key in user) {
                ptc[ key ] = user[ key ]
              }
            }
          })
        }
        
        //
        // [UPDATING OF WHETHER USER PRESENT OR NOT]

        // Update <LiveViewerCountBadge />
        let liveCount
        if (action === "update") {
          liveCount = existingPtcs.filter(user => user.here).length
          // Update cache
          cache("livestream/participants").set(existingPtcs)
        } else if (action === "creation") {
          liveCount = newSetOfPtcs.filter(user => user.here).length
          // Update cache
          cache("livestream/participants").set(newSetOfPtcs)
        }
        cache("livestream/viewerCount").set(liveCount)
        const setViewerCount = cache("livestream/functions/setViewerCount").get()
        if (typeof setViewerCount === "function") setViewerCount(liveCount)

        //
        // [APPENDING OF NEW USERS]

        // Do not proceed further, if this is not a new user
        if (action !== "creation") return

        // Update cache
        cache("livestream/participants").set(newSetOfPtcs)

        // Update <LivestreamMessages />
        const setPtcs = cache("livestream/functions/setParticipants").get()
        if (typeof setPtcs === "function") setPtcs(newSetOfPtcs)
        // Update <ParticipantList />
        const setPtcsList = cache("livestream/functions/setParticipantsList").get()
        if (typeof setPtcsList === "function") setPtcsList(newSetOfPtcs)
      })

      ptcsNodeRef.child(user.id).onDisconnect().update({
        here: false,
      })
    }
    init()

    return () => {
      ptcsNodeRef.child(user.id).update({
        here: false,
      })
      ptcsNodeRef.off()
    }
  }, [])

  function setDeck(state) {
    // [v DEBUG ONLY v]
    if (config.DEBUG) {
      buttonOptions.viewButtonPanel.state = "open"
      refresh(r => r + 1)
    }
    // [^ DEBUG ONLY ^]
    
    
    // [v DISABLED DURING DEBUG v]
    if (!config.DEBUG) {
      clearTimeout(buttonOptions.viewButtonPanel.data)
      buttonOptions.viewButtonPanel.state = state
  
      if (state === "open") {
        let timeout = setTimeout(() => {
          if (buttonOptions.viewChat.state === "open"
              ||buttonOptions.viewParticipants.state === "open") {
              return
            }
  
          buttonOptions.viewButtonPanel.state = "closed"
          refresh(r => r + 1)
        }, 4500)
        buttonOptions.viewButtonPanel.data = timeout
      }
  
      refresh(r => r + 1)
    }
    // [^ DISABLED DURING DEBUG ^]
  }

  useEffect(() => {
    setDeck("open")
  }, [])

  // Disable native device return button, to prevent accidental touch
  useEffect(() => {
    const goBack = () => true
    BackHandler.addEventListener('hardwareBackPress', goBack)

    return () => BackHandler.removeEventListener('hardwareBackPress', goBack)
  }, [])



  return (
    <>
    <View style={{
      position: "absolute",
      backgroundColor: "black",
      width: "100%",
      height: "100%",
      // zIndex: 999,
      }} />


    {/* {buttonOptions.viewButtonPanel.show 
    ?  */}
    <TouchableWithoutFeedback
        style={{
          width: "100%",
          height: "100%",
            zIndex: -10,
        }}
        onPress={() => setDeck(
          buttonOptions.viewButtonPanel.state === "open" ? "closed" : "open"
        )}
      />
    {/* : null} */}

     {/* {buttonOptions.viewButtonPanel.state === "open" 
    ?  */}
    <View style={{
        width: "100%",
        height: "100%",
        position: "absolute",
          zIndex: 105,
          marginTop: 40,
      }}>
        {/* { buttonOptions.goBack.show  ? */}
       <View style={{
          position: "absolute",
          top: 10,
          left: 10,
            }}>
               
               <View style={{
                  backgroundColor: "white",
                  borderRadius: 999,
                  zIndex: 110,
                  // ...simpleShadow,
                  ...containerStyle,
                }}>
                  <TouchableOpacity
                    style={{
                      borderRadius: 999,
                    }}
                    // underlayColor="#00000020"
                    onPress={() => navigation.goBack()}
                  >
                    <Icon
                      containerStyle={{
                        width: 50,
                        height: 50,
                      }}
                      imageStyle={imageStyle}
                      source={require("../components/img/png/x.png")}
                    />
                  </TouchableOpacity>
                </View>
          </View>
        {/* // : null } */}

        {/* {user.account_type == "partner" ? 
            <TouchableWithoutFeedback
            containerStyle={{
              position: "absolute",
              top: 20,
                right: 20,
            }}
            onPress={() => {
              layoutOptions.viewerCount.show = !layoutOptions.viewerCount.show
              refresh(r => r + 1)
            }}
            // [v DEBUG ONLY v]
            onLongPress={config.DEBUG ? () => {
              layoutOptions.viewerCount.show = !layoutOptions.viewerCount.show
              refresh(r => r + 1)
            } : null}
            // [^ DEBUG ONLY ^]
            >
            <LiveViewerCountBadge
              hidden={!layoutOptions.viewerCount.show}
            />
            </TouchableWithoutFeedback>
        : null
       } */}
       
       {/* { liveStatus == 'video.live_stream.connected' ? */}
        
        <View style={{
          width: "100%",
          paddingHorizontal: 15,
          paddingBottom: 80,
          position: "absolute",
          bottom: 0,
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
          {buttonOptions.viewChat.show
          ? <ChatButton
              onPress={() => {
                let ptcState, chatState
                switch (buttonOptions.viewChat.state) {
                  case "open":
                    chatState = "closed"
                    ptcState = "closed"
                    setDeck("open") // closes after 4500ms
                    break
                  case "closed":
                    chatState = "open"
                    ptcState = "closed"
                    break
                }
                buttonOptions.viewChat.state = chatState
                buttonOptions.viewParticipants.state = ptcState
                refresh(r => r + 1)
              }}
            />
          : null}


      {user.account_type == "partner" ? 
        <View>
          {/* <CancelButton
            title="Leave"
            onPress={() => navigation.goBack()} 
          /> */}
          <GoLiveButton
                title={buttonOptions.goLive.state === "streaming" ? "End Livestream" : "Go Live"}
                  onPress={() => {
                  switch(buttonOptions.goLive.state) {
                    case "streaming":

                      // register didPressEnd
                      firestore()
                        .collection('partners')
                        .doc(user.id)
                        .update({
                          didPressEnd: true,
                        })

                      buttonOptions.goLive.state = "idle"
                      buttonOptions.goBack.show = true
                      console.log("streaming")
                      break
                    case "idle":
                      buttonOptions.goLive.state = "streaming"
                      buttonOptions.goBack.show = false
                      console.log("idle")
                      break
                  }
                  refresh(r => r + 1)
                  
                  buttonOptions.goLive.onPress()
                }}
              />
            </View>
          : null }
          
          
          {/* {buttonOptions.viewParticipants.show ? */}
          {user.account_type == "partner" ? 
          <ListButton
              onPress={() => {
                let ptcState, chatState
                switch (buttonOptions.viewParticipants.state) {
                  case "open":
                    ptcState = "closed"
                    chatState = "closed"
                    setDeck("open") // closes after 4500ms
                    break
                  case "closed":
                    ptcState = "open"
                    chatState = "closed"
                    break
                }
                buttonOptions.viewParticipants.state = ptcState
                buttonOptions.viewChat.state = chatState
                refresh(r => r + 1)
              }}
            />
          : null}
        </View>
        {/* : null} */}

    {buttonOptions.viewChat.state === "open"
    ? <Chat
        containerStyle={{
          width: "94%",
          height: "70%",
          marginTop: 120,
          position: "absolute",
          alignSelf: "center",
          zIndex: 110,
        }}
        gymId={gymId}
        user={user}
        onSend={message => {
          message = message.trim()
          if (!message) return

          sendMessage({
            gymId,
            uid: user.id,
            name: `${user.first} ${user.last}`,
            message
          })
        }}
      />
    : null}

    {buttonOptions.viewParticipants.state === "open"
    ? <ParticipantList
        containerStyle={{
          width: "94%",
          height: 500,
          marginTop: 120,
          position: "absolute",
          alignSelf: "center",
          zIndex: 110,
        }}
      />
    : null}
    </View>
    </>
  )
}