import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "../components/CustomButton"

import auth from "@react-native-firebase/auth"
import { retrieveUserData, retrieveClassesByGymIds } from '../backend/CacheFunctions'
import Icon from '../components/Icon'



export default function PartnerDashboard(props) {
    let cache = props.route.params.cache

    const [user, setUser] = useState(null)
    // const [classes, setClasses] = useState(null)

    useEffect(() => {
        async function init() {
            let user = await retrieveUserData(cache)
            setUser(user)
            // let classes = await retrieveClassesByGymIds(
            //     cache, { gymIds: [user.associated_gyms] })
            // setClasses(classes)
        }
        init()
    }, [])

    if (!user) return <View />

    return (
        <ProfileLayout
            innerContainerStyle={{
                padding: 10,
            }}
            hideBackButton={true}
            data={{ name: user.name, iconUri: user.icon_uri_full }}
            buttonOptions={{
                logOut: {
                    show: true,
                },
            }}
        >
            <CustomButton
                icon={
                    <Icon
                    source={require("../components/img/png/livestream.png")}
                    />
                }
                title="Go Live"
                onPress={() => {props.navigation.navigate(
                    "GoLive")}}
            />
            {/* <CustomButton
                title="Livestream Settings"
                onPress={() => {props.navigation.navigate(
                    "PartnerLivestreamDashboard")}}
            /> */}
            <CustomButton
                icon={
                    <Icon
                    source={require("../components/img/png/my-classes.png")}
                    />
                }
                title="Schedule"
                onPress={() => {props.navigation.navigate(
                    "ScheduleViewer",
                    { gymId: user.associated_gyms[0] })}}
            />
            <CustomButton
              icon={
                <Icon
                  source={require("../components/img/png/profile.png")}
                />
              }
              title="Edit Profile"
              onPress={() => props.navigation.navigate(
                "ProfileSettings")}
            />
            <CustomButton
                icon={
                    <Icon
                    source={require("../components/img/png/gym-settings.png")}
                    />
                }
                title="Manage Gym"
                onPress={() => {props.navigation.navigate(
                    "PartnerGymSettings")}}
            />

        </ProfileLayout>
    )
}

const styles = StyleSheet.create({
    logOutButtonContainer: {
        width: 64,
        height: 64,
        marginTop: 10,
        marginRight: 10,
        position: "absolute",
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 999,
        zIndex: 110,
    },
})