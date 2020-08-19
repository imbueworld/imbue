import React, { useState } from 'react'
import { StyleSheet, ScrollView, View, Text, PermissionsAndroid, Platform } from 'react-native'

import { NodeCameraView } from "react-native-nodemediaclient"

import AppBackground from "../components/AppBackground"

import CustomButton from "../components/CustomButton"



export default function GoLive(props) {
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

    const [isStreaming, setIsStreaming] = useState(false)
    const [hasAllPermissions, setHasAllPermisions] = useState(false)
    const [streamKey, setStreamKey] = useState(null)

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
        <View style={styles.container}>
            <AppBackground />

            <NodeCameraView
                style={styles.cameraView}
                ref={vb => { stream = vb }}
                outputUrl={`${base}${streamKey}`}
                camera={settings.camera}
                audio={settings.audio}
                video={settings.video}
                autopreview
            />

            <View style={styles.buttonContainer}>
                <CustomButton
                    style={styles.button}
                    title={isStreaming ? "End Livestream" : "Go Live"}
                    onLongPress={toggleStream}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
    cameraView: {
        width: "100%",
        height: "100%",
        // position: "absolute",
    },
    buttonContainer: {
        width: "100%",
        height: "100%",
        position: "absolute",
        justifyContent: "flex-end",
    },
    button: {
        width: "75%",
        alignSelf: "center",
        marginBottom: 35,
    },
})