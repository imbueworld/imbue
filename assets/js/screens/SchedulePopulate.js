import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'

import { retrieveUserData } from '../backend/CacheFunctions'
import ProfileLayout from '../layouts/ProfileLayout'
import CalendarPopulateForm from '../components/CalendarPopulateForm'



export default function SchedulePopulate(props) {
    let cache = props.route.params.cache

    const [user, setUser] = useState(null)

    useEffect(() => {
        const init = async () => {
            let user = await retrieveUserData(cache)
            setUser(user)
        }
        init()
    }, [])

    if (!user) return <View />

    return (
        <ProfileLayout
            innerContainerStyle={{
                paddingHorizontal: 0,
                paddingBottom: 10,
            }}
            data={{ name: user.name, iconUri: user.icon_uri_full }}
        >
            <CalendarPopulateForm
                containerStyle={{
                    // backgroundColor: "red",
                }}
                cache={cache}
            />
        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {},
})