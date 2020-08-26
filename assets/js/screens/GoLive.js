import React, { useState, useEffect } from 'react'
import { StyleSheet, View, PermissionsAndroid, Platform } from 'react-native'

import { NodeCameraView } from "react-native-nodemediaclient"

import CustomButton from "../components/CustomButton"
import LivestreamLayout from '../layouts/LivestreamLayout'
import { retrieveUserData } from '../backend/CacheFunctions'



export default function GoLive(props) {
    let cache = props.route.params.cache

    const [user, setUser] = useState(null)
    const [gymId, setGymId] = useState(null)

    const [isStreaming, setIsStreaming] = useState(false)
    const [hasAllPermissions, setHasAllPermisions] = useState(false)
    const [streamKey, setStreamKey] = useState(null)

    useEffect(() => {
        const init = async () => {
            let user = await retrieveUserData(cache)
            setUser(user)
            setGymId(user.associated_gyms[0])
        }
        init()
    }, [])

    if (!user || !gymId) return <View />

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

    let stream

    console.log("isStreaming", isStreaming)

    const checkPermissions = async () => {
        console.log("Checking Permissions Android")
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
            ])
            let hasAllPermissions = true
            Object.keys(granted).forEach(key => {
                // key: the name of the object key
                // index: the ordinal position of the key within the object
                if (granted[key] !== "granted") {
                    console.log("Does not have permission for: ", granted[key])
                    hasAllPermissions = false
                }
            })
            console.log("hasAllPermissions: ", hasAllPermissions)
            setHasAllPermisions(hasAllPermissions)
        } catch (err) {
            console.error(err)
        }
    }

    const base = "rtmp://global-live.mux.com:5222/app/"

    const toggleStream = async () => {
        if (Platform.OS === "android") {
            if (!hasAllPermissions) {
                checkPermissions()
                return
            }
        }

        setStreamKey( await initializeStream(cache) )

        if (isStreaming) stream.stop()
        else stream.start()
        setIsStreaming(!isStreaming)
    }

    return (
        <LivestreamLayout
            user={user}
            gymId={gymId}
            buttonOptions={{
                leaveLivestream: {
                    show: false,
                },
                goLive: {
                    // show: true,
                },
                viewButtonPanel: {
                    show: false,
                    state: "closed",
                },
                viewChat: {
                    state: "open",
                },
            }}
        >
            {/* <NodeCameraView
                style={{
                    width: "100%",
                    height: "100%",
                    zIndex: -100,
                    // position: "absolute",
                }}
                ref={vb => { stream = vb }}
                outputUrl={`${base}${streamKey}`}
                camera={settings.camera}
                audio={settings.audio}
                video={settings.video}
                autopreview
            /> */}
        </LivestreamLayout>
    )
}