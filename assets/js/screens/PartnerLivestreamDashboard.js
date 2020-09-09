import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'

import AppBackground from "../components/AppBackground"
import CustomButton from "../components/CustomButton"
import CustomTextInput from "../components/CustomTextInput"
import CustomCapsule from "../components/CustomCapsule"
import { addDataToUser, updateGym, updateUser } from '../backend/BackendFunctions'
import { retrieveUserData, retrieveGymsByIds } from '../backend/CacheFunctions'
import CustomDropDownPicker from '../components/CustomDropDownPicker'

import functions from "@react-native-firebase/functions"



export default function PartnerLivestreamDashboard(props) {
    let cache = props.route.params.cache

    const [r, refresh] = useState(0)
    // const [user, setUser] = useState(null)
    const [gym_id, setGymId] = useState(null)
    const [dropDownGyms, setDropDownGyms] = useState(null)
    const [streamKey, setStreamKey] = useState(null)

    useEffect(() => {
        const init = async() => {
            let user = await retrieveUserData(cache)
            // setUser(user)
            setStreamKey(user.stream_key)
            let gyms = await retrieveGymsByIds(cache, { gymIds: user.associated_gyms })
            setDropDownGyms( gyms.map(gym => ({ label: gym.name, value: gym.id })) )
        }
        init()
    }, [])

    const applySettings = async() => {
        // await addDataToUser(cache, {
        //     collection: "partners",
        //     data: { stream_key: streamKey }
        // })
        // await updateGym(cache, {
        //     gym_id,
        //     doc: {
        //         stream_key: streamKey
        //     }
        // })

        // await updateUserSettings(cache, {
        //     stream_gym_id: gym_id
        // })
        // await updateUser(cache, {
        //     stream_gym_id: gym_id
        // })

        let x = await functions().httpsCallable("createLivestream")()

        refresh(r + 1)
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <AppBackground />
            <CustomCapsule
                containerStyle={styles.container}
                innerContainerStyle={{
                    paddingTop: 10,
                    paddingBottom: 10,
                }}
            >
                <CustomTextInput
                    containerStyle={{
                        height: 100,
                    }}
                    numberOfLines={10}
                    placeholder="Stream Secret Key"
                    value={streamKey}
                    onChangeText={setStreamKey}
                />

                <CustomDropDownPicker
                    style={{}}
                    items={dropDownGyms}
                    onChangeItem={item => setGymId(item.id)}
                />

                <CustomButton
                    title="Create Livestream"
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
        width: "88%",
        marginTop: 30,
        alignSelf: "center",
    },
})