import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'

import database from "@react-native-firebase/database"

import ChatButton from '../components/ChatButton'
import CancelButton from '../components/CancelButton'
import ListButton from '../components/ListButton'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { registerParticipant, sendMessage } from '../backend/LivestreamFunctions'
import CustomButton from '../components/CustomButton'
import ParticipantList from '../components/ParticipantList'
import Chat from '../components/Chat'
import AppBackground from '../components/AppBackground'
import LiveViewerCountBadge from '../components/badges/LiveViewerCountBadge'
import { colors } from '../contexts/Colors'
import { cache } from '../backend/CacheFunctions'



const layoutOptions = {
  viewerCount: {
    show: true,
  },
}

const buttonOptions = {
  goLive: {
    show: false,
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
  const gymId = props.gymId
  const user = props.user
  if (!gymId) throw new Error("prop gymId must be provided")
  if (!user) throw new Error("prop user must be provided")
  const Content = props.children
  let navigation = useNavigation()

  const [r, refresh] = useState(0)

  // Apply props.buttonOptions to buttonOptions
  if (props.buttonOptions) {
    Object.entries(props.buttonOptions).forEach(([button, instructions]) => {
      Object.entries(instructions).forEach(([key, value]) => {
        buttonOptions[ button ][ key ] = value
      })
    })
  }

  // Determine and set the initial customState value
  // This is required for:
  //   -  viewParticipants
  //   -  viewChat
  // This is required due to their states being tied together (one affects the other)
  const [customState, setCustomState] = useState(/*{
    viewParticipants: {
      state: buttonOptions.viewParticipants.state,
    },
    viewChat: {
      state: buttonOptions.viewChat.state,
    },
  }*/buttonOptions)
  // Should customState's initial value just be the customOptions value?
  // Is customState even needed, if I can `assignment = {...buttonOptions, x : {...buttonOptions[x], ..}}? // useReducer() also
  // I think it is not even needed.

  // Apply customState to buttonOptions
  // Object.entries(customState).forEach(([button, instructions]) => {
  //   Object.entries(instructions).forEach(([key, value]) => {
  //     buttonOptions[ button ][ key ] = value
  //   })
  // })

  useEffect(() => {
    const chatNodeRef = database().ref(`livestreams/messages/${gymId}`)

    const init = async () => {
      await registerParticipant({
        gymId,
        name: user.name,
        uid: user.id,
        icon_uri: user.icon_uri,
      })

      await chatNodeRef.once('value', snap => {
        let data = snap.val()
        if (data) {
          const messages = Object.values(data)
          // Assumes existing data that may be in cache upon the very first
          // render of this component is irrelevant and to be overwritten
          cache("livestream/chat").set(messages)
        }
      })

      chatNodeRef.limitToLast(1).on('child_added', snap => {
        const message = snap.val()

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

    return () => chatNodeRef.off()
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
    }
    init()

    return () => {
      ptcsNodeRef.child(user.id).update({
        here: false,
      })
      ptcsNodeRef.off()
    }
  }, [])


  // function hideDeck() {
  //   let timeout = setTimeout(() => {
  //     buttonOptions.viewButtonPanel.state = "closed"
  //     refresh(r => r + 1)
  //   }, 4500)
  //   buttonOptions.viewButtonPanel.data = timeout
  // }

  // function showDeck() {
  //   clearTimeout(buttonOptions.viewButtonPanel.data)
  //   buttonOptions.viewButtonPanel.state = "open"
  //   refresh(r => r + 1)

  //   hideDeck()
  // }

  function setDeck(state) {
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

  useEffect(() => {
    setDeck("open")
  }, [])



  return (
    <>
    <View style={{
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: -100,
      ...props.containerStyle,
    }}>
      { Content }
    </View>

    {/* <View style={{
      position: "absolute",
      backgroundColor: "black",
      width: "100%",
      height: "100%",
      zIndex: -110,
    }} /> */}
    <AppBackground />

    {buttonOptions.viewButtonPanel.show
    ? <TouchableWithoutFeedback
        style={{
          width: "100%",
          height: "100%",
          zIndex: -10,
        }}
        onPress={() => setDeck(
          buttonOptions.viewButtonPanel.state === "open" ? "closed" : "open"
        )}
      />
    : null}

    {buttonOptions.viewButtonPanel.state === "open"
    ? <View style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 105,
      }}>
        <TouchableWithoutFeedback
          containerStyle={{
            position: "absolute",
            top: 10,
            right: 15,
          }}
          onPress={() => {
            layoutOptions.viewerCount.show = !layoutOptions.viewerCount.show
            refresh(r => r + 1)
          }}
          // [uncomment upon DEBUG start]
          onLongPress={() => {
            layoutOptions.viewerCount.show = !layoutOptions.viewerCount.show
            refresh(r => r + 1)
          }}
          // [comment upon DEBUG end]
        >
          <LiveViewerCountBadge
            hidden={!layoutOptions.viewerCount.show}
          />
        </TouchableWithoutFeedback>

        <View style={{
          width: "100%",
          paddingHorizontal: 15,
          paddingBottom: 15,
          position: "absolute",
          bottom: 0,
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
        {buttonOptions.viewChat.show
        ? <ChatButton
            onPress={() => {
              let ptcState, chatState
              switch (customState.viewChat.state) {
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

              // setCustomState({
              //   ...customState,
              //   viewChat: {
              //     state: chatState,
              //   },
              //   viewParticipants: {
              //     state: ptcState,
              //   },
              // })

              console.log("chatState", chatState)
              console.log("ptcState", ptcState)
              buttonOptions.viewChat.state = chatState
              buttonOptions.viewParticipants.state = ptcState
              refresh(r => r + 1)
            }}
          />
        : null}

        {buttonOptions.leaveLivestream.show
        ? <CancelButton
            title="Leave Workout"
            onLongPress={() => navigation.goBack()}
          />
        : null}

        {buttonOptions.goLive.show
        ? <View style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            justifyContent: "flex-end",
          }}>
            <CustomButton
              style={{
                width: "75%",
                alignSelf: "center",
                marginBottom: 35,
              }}
              title="ok"
              // title={isStreaming ? "End Livestream" : "Go Live"}
              // onLongPress={toggleStream}
            />
          </View>
        : null}
        
        {buttonOptions.viewParticipants.show
        ? <ListButton
            onPress={() => {
              let ptcState, chatState
              switch (customState.viewParticipants.state) {
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

              // setCustomState({
              //   ...customState,
              //   viewParticipants: {
              //     state: ptcState,
              //   },
              //   viewChat: {
              //     state: chatState,
              //   },
              // })

              buttonOptions.viewParticipants.state = ptcState
              buttonOptions.viewChat.state = chatState
              refresh(r => r + 1)
            }}
          />
        : null}
        </View>

      </View>
    : null}

    {buttonOptions.viewChat.state === "open"
    ? <Chat
        containerStyle={{
          width: "94%",
          height: "70%",
          marginTop: 50,
          position: "absolute",
          alignSelf: "center",
          zIndex: 110,
        }}
        gymId={gymId}
        user={user}
        onSend={message => {
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
          marginTop: 50,
          position: "absolute",
          alignSelf: "center",
          zIndex: 110,
        }}
      />
    : null}
    </>
  )
}