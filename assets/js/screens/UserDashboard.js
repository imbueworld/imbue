import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Animated } from 'react-native'

import { useDimensions } from '@react-native-community/hooks'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import { mapStyle } from "../contexts/MapStyle"
import ProfileLayout from "../layouts/ProfileLayout"
// import AppBackground from "../components/AppBackground"

import UserIcon from "../components/UserIcon"
// import UserMenu from "../components/UserMenu"

import CustomButton from "../components/CustomButton"

import GymBadge from "../components/GymBadge"
import LogOut from "../components/LogOut"

import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'
import { retrieveUserClasses, retrieveAllGyms, retrieveGymClasses } from '../backend/CacheFunctions'
import { simpleShadow, colors } from '../contexts/Colors'



export default function UserDashboard(props) {
  let cache = props.route.params.cache
  console.log("[USER DASHBOARD]")

  const [r, refresh] = useState(0)

  const [expanded, setExpanded] = useState(false)
  const { width, height } = useDimensions().window
  const slidingAnim = useRef(new Animated.Value(-1 * width)).current

  const user = firebase.auth().currentUser

  const [Markers, MarkersCreate] = useState(null)
  const [CurrentGymBadge, GymBadgeCreate] = useState(null)

  useEffect(() => {
    async function retrieveData() {
      await Promise.all([
        retrieveUserClasses(cache),
        retrieveAllGyms(cache),
      ])
      console.log("[CACHE]  Finished retrieving user classes and gyms.")
      console.log("cache.classes", cache.classes) //
      refresh(r + 1)
    }
    retrieveData()
  }, [cache.user.active_classes.length])

  useEffect(() => {
    if (!r) return

    MarkersCreate(cache.gyms.map((gym, idx) =>
      <Marker
        coordinate={gym.coordinate}
        key={idx}
        onPress={() => {
          GymBadgeCreate(
            cache.gyms
              .filter((gym, idx2) => idx2 === idx)
              .map(gym => {
                return (
                  <GymBadge
                    containerStyle={styles.badgeContainer}
                    name={gym.name}
                    desc={gym.description}
                    rating={`${gym.rating} (${gym.rating_weight})`}
                    relativeDistance={"ERR_NOT_IMPL"}
                    iconUri={gym.icon_uri}
                    key={idx}
                    onMoreInfo={() => {
                      retrieveGymClasses(cache, gym.id) // Does not need await, because utilizes cache.working
                      props.navigation.navigate(
                        "GymDescription", { data: gym })
                    }}
                    onX={() => GymBadgeCreate(null)}
                  />
                )
              })
          )
        }}
      />
    ))
  }, [r])

  function sidePanelToggle() {
    if (expanded) {
      sidePanelSlideIn()
      setExpanded(false)
    }
    else {
      sidePanelSlideOut()
      setExpanded(true)
    }
  }

  function sidePanelSlideIn() {
    Animated.timing(slidingAnim, {
      toValue: -1 * width,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }

  function sidePanelSlideOut() {
    Animated.timing(slidingAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start()
  }

  return (
    <>

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {Markers}
      </MapView>

      {CurrentGymBadge}

      <TouchableOpacity
        style={[
          styles.sidePanelButtonContainer,
          // {
          //     display: expanded ? "none" : "flex",
          // }
        ]}
        onPress={sidePanelToggle}
      >
        <UserIcon
          style={{
            width: 64,
            height: 64,
            display: expanded ? "none" : "flex",
          }}
          data={{ uri: user.photoURL }}
        />
      </TouchableOpacity>

      {/* The Side Panel */}
      <Animated.View style={[
        styles.sidePanel,
        {
          left: slidingAnim,
        }
      ]}>
        <TouchableOpacity
          style={[
            styles.sidePanelButtonContainer,
            {
              display: expanded ? "flex" : "none",
            }
          ]}
          onPress={sidePanelToggle}
        >
          <UserIcon
            style={{
              width: 64,
              height: 64,
              display: expanded ? "flex" : "none",
            }}
            data={{ uri: user.photoURL }}
          />
        </TouchableOpacity>

        <ProfileLayout
          innerContainerStyle={{
            paddingBottom: 10,
          }}
        >

          <TouchableOpacity
            style={styles.logOutButtonContainer}
            onPress={() => console.log("To-Do: Intuitively shows what the button does")}
            onLongPress={() => {
              firebase.auth().signOut()
              props.navigation.navigate("Boot", { referrer: "UserDashboard" })
              if (expanded) sidePanelToggle()
            }}
          >
            <LogOut
              style={{
                width: "100%",
                height: "100%",
              }}
              containerStyle={{
                left: 1.35, // Make-up for the icon's flaw regarding centering
                padding: 10,
              }}
            />
          </TouchableOpacity>

          <CustomButton
            title="My Classes"
            onPress={() => {
              console.log("cache.classes", cache.classes)
              props.navigation.navigate(
                "ScheduleViewer", { data: cache.classes })
            }}
          />
          <CustomButton
            title="Manage Memberships"
            onPress={() => props.navigation.navigate(
              "UserMemberships")}
          />
          <CustomButton
            title="Edit Profile"
            onPress={() => props.navigation.navigate(
              "ProfileSettings")}
          />
          <CustomButton
            title="Payment Settings"
            onPress={() => props.navigation.navigate(
              "PaymentSettings")}
          />

        </ProfileLayout>
      </Animated.View>

    </>
  )
}

const styles = StyleSheet.create({
  container: {
    // minHeight: "100%", // This breaks sidePanel within <Anmimated.View>; minHeight does not synergize well with child position: "absolute" 's ? ; Unless it's used for ScrollView containerStyle?
    // flex: 1,
    // width: "100%",
    // height: "100%",
  },
  sidePanel: {
    width: "100%",
    height: "100%",
    // minWidth: "100%",
    // minHeight: "100%",
    position: "absolute",
    zIndex: 100 * 100,
  },
  sidePanelButtonContainer: {
    marginTop: 10,
    marginLeft: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 110,
  },
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
    ...simpleShadow,
    zIndex: 110,
  },
  map: {
    width: "100%",
    height: "100%",
    backgroundColor: "#addbff", // water fill before map loads
    zIndex: -1000,
  },
  badgeContainer: {
    width: "100%",
    marginBottom: 40,
    bottom: 0,
  },
})