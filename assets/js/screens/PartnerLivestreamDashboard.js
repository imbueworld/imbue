import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'

import AppBackground from "../components/AppBackground"
import CustomButton from "../components/CustomButton"
import CustomTextInput from "../components/CustomTextInput"
import CustomCapsule from "../components/CustomCapsule"
import { addDataToUser } from '../backend/BackendFunctions'
import { retrieveUserData } from '../backend/CacheFunctions'



export default function PartnerLivestreamDashboard(props) {
    let cache = props.route.params.cache

    const [r, refresh] = useState(0)
    // const [user, setUser] = useState(null)
    const [streamKeyField, setStreamKeyField] = useState(null)

    useEffect(() => {
        const init = async() => {
            let user = await retrieveUserData(cache)
            // setUser(user)
            setStreamKeyField(user.stream_key)
        }
        init()
    }, [])

    const applySettings = async() => {
        await addDataToUser(cache, {
            collection: "partners",
            data: { stream_key: streamKeyField }
        })
        refresh(r + 1)
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <CustomCapsule style={styles.container}>

                <CustomTextInput
                    placeholder="Stream Secret Key"
                    value={streamKeyField}
                    onChangeText={setStreamKeyField}
                />

                <CustomButton
                    title="Apply"
                    onPress={applySettings}
                />

            </CustomCapsule>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {
        width: "85%",
        marginTop: 50,
        paddingTop: 10,
        paddingBottom: 0,
        alignSelf: "center",
    },
})