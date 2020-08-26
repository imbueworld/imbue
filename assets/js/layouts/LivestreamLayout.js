import React, { useEffect, useState } from 'react'
import { View } from 'react-native'

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



export default function LivestreamLayout(props) {
  const gymId = props.gymId
  const user = props.user
  const Content = props.children
  let navigation = useNavigation()

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
      data: null, // stores the timeout that is created upon show
    },
  }

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
  const [customState, setCustomState] = useState({
    viewParticipants: {
      state: buttonOptions.viewParticipants.state,
    },
    viewChat: {
      state: buttonOptions.viewChat.state,
    },
  })
  // Should customState's initial value just be the customOptions value?
  // Is customState even needed, if I can `assignment = {...buttonOptions, x : {...buttonOptions[x], ..}}? // useReducer() also
  // I think it is not even needed.

  // Apply customState to buttonOptions
  Object.entries(customState).forEach(([button, instructions]) => {
    Object.entries(instructions).forEach(([key, value]) => {
      buttonOptions[ button ][ key ] = value
    })
  })
  
  // console.log(1, "buttonOptions", buttonOptions)

  const activePtcNodeRef = database().ref(`livestreams/active_participants/${gymId}`)
  const [ptcNodeRef, setPtcNodeRef] = useState(null)

  const [ptcList, setPtcList] = useState([])

  useEffect(() => {
    const init = async () => {
      const ptcNodeRef = await registerParticipant({
        gymId,
        name: user.name,
        uid: user.id,
        icon_uri: user.icon_uri,
      })
      setPtcNodeRef(ptcNodeRef)
      ptcNodeRef
        .onDisconnect()
        .set(null)
      
      activePtcNodeRef.on('child_added', snap => {
        setPtcList(ptcList => ([...ptcList, snap.val()]))
      }, err => {
        console.log("[ERROR ptc 2]", err.message)
      })
      activePtcNodeRef.on('child_removed', snap => {
        const removedUid = snap.val().uid
        setPtcList(ptcList => ptcList.filter(ptcDoc => {
          if (ptcDoc.uid === removedUid) return false
          return true
        }))
      }, err => {
        console.log("[ERROR ptc 2]", err.message)
      })
    }
    init()
  }, [])

  // useEffect(() => {
  //   bringUpButton(1500 * 3)
  // }, [])

  // async function bringUpButton(duration = 4500 * 1.5) {
  //   // setButtonPanelPopup(true)
  //   setCustomState({
  //     ...customState,
  //     viewButtonPanel: {
  //       ...customState.viewButtonPanel,
  //       state: "open",
  //     },
  //   })
  //   clearTimeout(buttonPanelTimeout)
  //   await new Promise(r => {
  //     // setButtonPanelTimeout(
  //       let timeout = setTimeout(() => {
  //         // setButtonPanelPopup(false)
  //         setCustomState({
  //           ...customState,
  //           viewButtonPanel: {
  //             ...customState.viewButtonPanel,
  //             state: "closed",
  //           },
  //         })
  //         r()
  //       }, duration)
  //     // )
  //     setCustomState({
  //       ...customState,
  //       viewButtonPanel: {
  //         ...customState.viewButtonPanel,
  //         data: timeout,
  //       },
  //     })
  //   })
  // }

  return (
    <>
    <View style={{
      width: "100%",
      height: "100%",
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
        }}
        // onPress={bringUpButton}
      />
    : null}

    {buttonOptions.viewButtonPanel.state === "open"
    ? <View style={{
        width: "100%",
        backgroundColor: "red",
        paddingHorizontal: 15,
        paddingBottom: 15,
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        zIndex: 100,
      }}>
        {buttonOptions.viewChat.show
        ? <ChatButton
            onPress={() => {
              let ptcState, chatState
              switch (customState.viewChat.state) {
                case "open":
                  chatState = "closed"
                  ptcState = "closed"
                  break
                case "closed":
                  chatState = "open"
                  ptcState = "closed"
                  break
              }

              setCustomState({
                ...customState,
                viewChat: {
                  state: chatState,
                },
                viewParticipants: {
                  state: ptcState,
                },
              })
            }}
          />
        : null}

        {buttonOptions.leaveLivestream.show
        ? <CancelButton
            title="Leave Workout"
            onLongPress={() => {
              if (ptcNodeRef) ptcNodeRef.set(null)
              // chatNodeRef.off()
              activePtcNodeRef.off()
              navigation.goBack()
            }}
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
                  break
                case "closed":
                  ptcState = "open"
                  chatState = "closed"
                  break
              }

              setCustomState({
                ...customState,
                viewParticipants: {
                  state: ptcState,
                },
                viewChat: {
                  state: chatState,
                },
              })
            }}
          />
        : null}
      </View>
    : null}

    {buttonOptions.viewChat.state === "open"
    ? <Chat
        containerStyle={{
          width: "88%",
          height: "70%",
          marginTop: 30,
          position: "absolute",
          alignSelf: "center",
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
          width: "88%",
          height: 500,
          marginVertical: 50,
          position: "absolute",
          alignSelf: "center",
        }}
        data={ptcList}
      />
    : null}
    </>
  )
}