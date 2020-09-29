import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, View, Text } from 'react-native'

import AppBackground from "../components/AppBackground"
import ProfileLayout from '../layouts/ProfileLayout'
import { retrieveUserData } from '../backend/CacheFunctions'



export default function PartnerUpdateClasses(props) {
    let cache = props.route.params.cache
    const [user, setUser] = useState(null)
    useEffect(() => {
        const init = async() => {
            let user = retrieveUserData(cache)
            setUser(user)
        }
        init()
    }, [])
    return (
        <ProfileLayout>
            
        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        minHeight: "100%",
    },
    container: {},
})