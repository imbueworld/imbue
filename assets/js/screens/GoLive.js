import React, { useState, useEffect } from 'react'
import { View, PermissionsAndroid, Platform } from 'react-native'

import { NodeCameraView } from "react-native-nodemediaclient"
import LivestreamLayout from '../layouts/LivestreamLayout'

import cache from '../backend/storage/cache'
import User from '../backend/storage/User'



async function checkPermissions() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ])
    let hasAllPermissions = true
    Object.keys(granted).forEach(key => {
      if (granted[key] !== "granted") {
        hasAllPermissions = false
      }
    })
    return hasAllPermissions
  } catch (err) {
    console.error(err)
    return false
  }
}



export default function GoLive(props) {
  const [user, setUser] = useState(null)
  const [gymId, setGymId] = useState(null)

  const [hasAllPermissions, setHasAllPermisions] = useState(false)
  const [streamKey, setStreamKey] = useState(null)

  useEffect(() => {
    const init = async () => {
      const partner = new User()
      const partnerDoc = await partner.retrieveUser()

      const { associated_gyms=[] } = partnerDoc
      const gymId = associated_gyms[ 0 ]

      setUser(partnerDoc)
      setGymId(gymId)
    }; init()
  }, [])

  useEffect(() => {
    const init = async () => {
      if (Platform.OS === "android") {
        let has = await checkPermissions()
        setHasAllPermisions(has)
      }
    }; init()
  }, [])



  if (!user || !gymId) return <View />
  if (Platform.OS === "android" && !hasAllPermissions) return <View style={{
    backgroundColor: "black",
    width: "100%",
    height: "100%",
    position: "absolute",
  }} />

  const settings = {
    camera: { cameraId: 1, cameraFrontMirror: true },
    audio: { bitrate: 32000, profile: 1, samplerate: 44100 },
    video: {
      bitrate: 400000,
      // preset: 24,
      // profile: 2,
      // fps: 30,
      // videoFrontMirror: true,
      preset: 5,
      profile: 1,
      fps: 30,
      videoFrontMirror: false,
    }
  }

  const base = "rtmp://global-live.mux.com:5222/app/"

  const toggleStream = async () => {
    const stream = cache("streamRef").get()
    const isStreaming = cache("isStreaming").get()

    if (isStreaming) {
      stream.stop()
      cache("isStreaming").set(false)
      return
    }

    const userObj = new User()
    await userObj.createLivestream() // Will not create livestream, if it already has been
    const { stream_key } = await userObj.retrieveUser()
    setStreamKey(stream_key)

    stream.start()
    cache("isStreaming").set(true)
  }

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
            onLongPress: toggleStream,
          },
        }}
      />

      <View style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: -100,
        ...props.containerStyle,
      }}>
        {hasAllPermissions
          ? <NodeCameraView
            style={{
              width: "100%",
              height: "100%",
              zIndex: -100,
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
          />
          : null}
      </View>
    </>
  )
}