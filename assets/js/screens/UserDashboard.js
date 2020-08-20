import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Animated, TouchableHighlight } from 'react-native'

import { useDimensions } from '@react-native-community/hooks'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import { mapStyle } from "../contexts/MapStyle"
import ProfileLayout from "../layouts/ProfileLayout"

import UserIcon from "../components/UserIcon"

import CustomButton from "../components/CustomButton"

import GymBadge from "../components/GymBadge"
import LogOut from "../components/LogOut"

import auth from "@react-native-firebase/auth"
import { retrieveUserData, retrieveGymsByLocation, retrieveClassesByGymIds, retrieveClassesByIds } from '../backend/CacheFunctions'
import { simpleShadow } from '../contexts/Colors'
import Icon from '../components/Icon'
import { publicStorage } from '../backend/HelperFunctions'



export default function UserDashboard(props) {
  let cache = props.route.params.cache

  const [expanded, setExpanded] = useState(false)
  const { width, height } = useDimensions().window
  const slidingAnim = useRef(new Animated.Value(-1 * width - 25)).current

  const [user, setUser] = useState(null)
  const [gyms, setGyms] = useState(null)

  const [Markers, MarkersCreate] = useState(null)
  const [CurrentGymBadge, GymBadgeCreate] = useState(null)
  // const [Menu, MenuCreate] = useState(null)
  // const [MenuButton, MenuButtonCreate] = useState(null)

  useEffect(() => {
    async function init() {
      let user = await retrieveUserData(cache)
      setUser(user)
      let promises = await Promise.all([
        retrieveGymsByLocation(cache),
        retrieveClassesByIds(cache, { classIds: user.active_classes }),
      ])
      setGyms(promises[0])
    }
    init()
  }, [])

  useEffect(() => {
    if (!gyms) return

    MarkersCreate(gyms.map((gym, idx) =>
      <Marker
        coordinate={gym.coordinate}
        key={idx}
        onPress={() => {
          GymBadgeCreate(
            gyms
              .filter((gym, idx2) => idx2 === idx)
              .map(gym => {
                return (
                  <GymBadge
                    containerStyle={styles.badgeContainer}
                    name={gym.name}
                    desc={gym.description}
                    rating={`${gym.rating} (${gym.rating_weight})`}
                    relativeDistance={""}
                    iconUri={publicStorage(gym.icon_uri)}
                    key={idx}
                    onMoreInfo={() => {
                      // Does not need await, because utilizes cache.working
                      // = load into next page instantly
                      retrieveClassesByGymIds(cache, { gymIds: [gym.id] })
                      props.navigation.navigate(
                        "GymDescription", { gymId: gym.id })
                    }}
                    onX={() => GymBadgeCreate(null)}
                  />
                )
              })
          )
        }}
      />
    ))
  }, [gyms])

  useEffect(() => {
    if (!user) return

    // MenuButtonCreate(
    //   <TouchableOpacity
    //     style={styles.sidePanelButtonContainer}
    //     onPress={sidePanelToggle}
    //   >
    //     <UserIcon
    //       style={{
    //         width: 64,
    //         height: 64,
    //       }}
    //       data={{ uri: user.icon_uri }}
    //     />
    //   </TouchableOpacity>
    // )
  }, [user])

  // useEffect(() => {
  //   if (!user) return
  //   if (!MenuButton) return

  // MenuCreate(
  //   <>
  //   {expanded ? null : MenuButton}

  //   <Animated.View style={[
  //     styles.sidePanel,
  //     {
  //       left: slidingAnim,
  //     }
  //   ]}>

  //     <ProfileLayout
  //       innerContainerStyle={{
  //         paddingBottom: 10,
  //       }}
  //       data={{ name: user.name, iconUri: user.icon_uri }}
  //     >

  //       {expanded ? MenuButton : null}

  //       <TouchableOpacity
  //         style={styles.logOutButtonContainer}
  //         onPress={() => console.log("To-Do: Intuitively shows what the button does")}
  //         onLongPress={() => {
  //           firebase.auth().signOut()
  //           props.navigation.navigate("Boot", { referrer: "UserDashboard" })
  //           if (expanded) sidePanelToggle()
  //         }}
  //       >
  //         <LogOut
  //           style={{
  //             width: "100%",
  //             height: "100%",
  //           }}
  //           containerStyle={{
  //             left: 1.35, // Make-up for the icon's flaw regarding centering
  //             padding: 10,
  //           }}
  //         />
  //       </TouchableOpacity>

  //       <CustomButton
  //         title="My Classes"
  //         onPress={() => {
  //           console.log("cache.classes", cache.classes)
  //           props.navigation.navigate(
  //             "ScheduleViewer", { data: cache.classes })
  //         }}
  //       />
  //       <CustomButton
  //         title="Manage Memberships"
  //         onPress={() => props.navigation.navigate(
  //           "UserMemberships")}
  //       />
  //       <CustomButton
  //         title="Edit Profile"
  //         onPress={() => props.navigation.navigate(
  //           "ProfileSettings")}
  //       />
  //       <CustomButton
  //         title="Payment Settings"
  //         onPress={() => props.navigation.navigate(
  //           "PaymentSettings")}
  //       />

  //     </ProfileLayout>
  //   </Animated.View>
  //   </>
  // )

  // }, [user, expanded, MenuButton, slidingAnim._value])

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
      toValue: -1 * width - 25, // -35 to hide the added side in <ProfileLayout /> as well
      duration: 275,
      useNativeDriver: false,
    }).start()
  }

  function sidePanelSlideOut() {
    Animated.timing(slidingAnim, {
      toValue: 0,
      duration: 425,
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
    {/* {Menu} */}

    {
    !user ? null :
    expanded ? null :
      <TouchableOpacity
        style={[styles.sidePanelButtonContainer, {
          zIndex: 0,
        }]}
        onPress={sidePanelToggle}
      >
        <UserIcon
          style={{
            width: 64,
            height: 64,
          }}
          data={{ uri: publicStorage(user.icon_uri) }}
        />
      </TouchableOpacity>
    }

    {!user ? null :
    <Animated.View style={[styles.sidePanel, { left: slidingAnim }]}>
      <ProfileLayout
        // BackButton={
        //   <TouchableHighlight
        //     style={styles.sidePanelButtonContainer}
        //     underlayColor="#eed"
        //     onPressIn={sidePanelToggle}
        //   >
        //     <BackButton />
        //   </TouchableHighlight>
        // }
        innerContainerStyle={{
          paddingBottom: 10,
        }}
        data={{ name: user.name, iconUri: user.icon_uri }}
        onBack={sidePanelToggle}
      >

        <TouchableOpacity
          style={styles.logOutButtonContainer}
          onPress={() => console.log("To-Do: Intuitively shows what the button does")}
          onLongPress={() => {
            auth().signOut()
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
            }}
          />
        </TouchableOpacity>

        <CustomButton
          icon={
            <Icon
              source={require("../components/img/png/my-classes.png")}
            />
          }
          title="My Classes"
          onPress={() => {
            console.log("[USR DHSBRD]  cache.classes", cache.classes)
            props.navigation.navigate(
              "ScheduleViewer",
              { classIds: user.active_classes }
            )
          }}
        />
        <CustomButton
          icon={
            <Icon
              source={require("../components/img/png/user-memberships.png")}
            />
          }
          title="Manage Memberships"
          onPress={() => props.navigation.navigate(
            "UserMemberships")}
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
              source={require("../components/img/png/generic-credit-card.png")}
            />
          }
          title="Payment Settings"
          onPress={() => props.navigation.navigate(
            "PaymentSettings")}
        />

      </ProfileLayout>
    </Animated.View>}
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
    zIndex: 100,
  },
  sidePanelButtonContainer: {
    ...simpleShadow,
    backgroundColor: "white",
    marginTop: 10,
    marginLeft: 10,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 999,
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