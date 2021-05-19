  
import React, { useState, useEffect } from 'react'
import { View, Platform, StatusBar, Text } from 'react-native'

import {PERMISSIONS} from 'react-native-permissions';
import { NodeCameraView } from "react-native-nodemediaclient"
import LivestreamLayout from '../layouts/LivestreamLayout'

import cache from '../backend/storage/cache'
import User from '../backend/storage/User'
import { requestPermissions } from '../backend/HelperFunctions'
import { colors } from '../contexts/Colors' 

async function checkPermissionsiOS() {
  let hasAllPermissionsiOS = false
  check(PERMISSIONS.IOS.CAMERA) 
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          return hasAllPermissionsiOS;
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          return hasAllPermissionsiOS;
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
          hasAllPermissionsiOS = true
          return hasAllPermissionsiOS;
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          return hasAllPermissionsiOS;
          break;
      }
    })
    .catch((error) => {
      console.error(err) 
      return false
    });
}


export default function GoLive(props) {
  const [user, setUser] = useState(null)
  const [gymId, setGymId] = useState(null)

  // android permissions
  const [hasAllPermissions, setHasAllPermisions] = useState(false) 
  // ios permissions
  const [hasAllPermissionsiOS, setHasAllPermisionsiOS] = useState(false)
  const [streamKey, setStreamKey] = useState(null)

  // Init
  useEffect(() => {
    const init = async () => {
      const partner = new User()
      const partnerDoc = await partner.retrieveUser()

      const { associated_gyms=[] } = partnerDoc
      const gymIds = associated_gyms[0]

      setUser(partnerDoc)
      setGymId(gymIds)

      // Hiding obstructing bars
      StatusBar.setBackgroundColor('#00000000')
      StatusBar.setTranslucent(true)
    }; init()

    return () => {
      StatusBar.setBackgroundColor(colors.bg)
      StatusBar.setTranslucent(false)
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === "android") {
        // let has = await checkPermissions()
        // setHasAllPermisions(has)
      } else if (Platform.OS === "ios") {
        let has = await checkPermissionsiOS()
        setHasAllPermisionsiOS(has)
      }
    }; init()

    const perms = async () => {
      let unfulfilledPerms = await requestPermissions([
        'CAMERA',
        'RECORD_AUDIO',
        'WRITE_EXTERNAL_STORAGE',
      ])

      setHasAllPermisions(!Boolean(unfulfilledPerms))
    }; perms()
  }, [])



  if (!user || !gymId) return <View />
  // if (Platform.OS === "android" && !hasAllPermissions) return <View style={{
  //   backgroundColor: "black",
  //   width: "100%",
  //   height: "100%",
  //   position: "absolute",
  // }} />

  const settings = {
    camera: { cameraId: 1, cameraFrontMirror: true },
    audio: { bitrate: 32000, profile: 1, samplerate: 44100 },
    video: {
      bitrate: 400000,
      // preset: 24,
      // profile: 2,
      // fps: 30,
      // videoFrontMirror: true,
      preset: 5, // controls video quality & res
      profile: 1,
      fps: 30,
      videoFrontMirror: false,
    }
  }

  const base = 'rtmps://global-live.mux.com:443/app/'
  // const base = "rtmp://global-live.mux.com:443/app/"

  const toggleStream = async () => {
    console.log("pressed")
    const stream = cache("streamRef").get()
    const isStreaming = cache("isStreaming").get()

    if (isStreaming) {
      stream.stop()
      cache("isStreaming").set(false)
      return
    } 

    const partnerObj = new User() 
    await partnerObj.createLivestream({ gymId }) // Will not create livestream, if it already has been
    const { stream_key } = await partnerObj.retrieveUser()
    console.log("stream_key: " + stream_key)
    setStreamKey(stream_key)

    stream.start()
    cache("isStreaming").set(true)

  }

  console.log("link: " + `${base}${streamKey}`)

  return (
    <>
      <LivestreamLayout 
        user={user}
        gymId={gymId}
        buttonOptions={{
          leaveLivestream: {
            show: false,
          },
          goBack: {
            show: true,
          },
          goLive: {
            show: true,
            onPress: toggleStream,
          },
        }}
      />
      <View style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        // zIndex: -100,
      }}>
        {
          (hasAllPermissions || hasAllPermissionsiOS) &&
          <NodeCameraView
            style={{
              width: "100%",
              height: "100%",
              // zIndex: -100,
              // position: "absolute",
            }}
            ref={vb => {
              // stream = vb
              cache("streamRef").set(vb)
            }}
            outputUrl={`${base}${streamKey}`}
            camera={settings.camera}
            audio={settings.audio}
            video={settings.video}
            autopreview
            switchCameraswitchCamera
          />
        }
      </View>
    </>
  )
}
