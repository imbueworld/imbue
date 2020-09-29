import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Animated, TouchableHighlight, BackHandler, SafeAreaView } from 'react-native'

import { useDimensions } from '@react-native-community/hooks'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import { mapStyle, mapStyle2 } from "../contexts/MapStyle"
import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "../components/CustomButton"
import GymBadge from "../components/GymBadge"
import CustomTextInput from "../components/CustomTextInput"


import auth from "@react-native-firebase/auth"
import { retrieveUserData, retrieveGymsByLocation, retrieveClassesByUser } from '../backend/CacheFunctions'
import Icon from '../components/Icon'
import { publicStorage } from '../backend/CacheFunctions'
import { simpleShadow } from '../contexts/Colors'
import { GoogleSignin } from '@react-native-community/google-signin'
import { cache as CACHE } from "../backend/CacheFunctions"
import { LoginManager } from 'react-native-fbsdk'
import { StackActions } from '@react-navigation/native'
import { TextInput } from 'react-native-gesture-handler'



export default function UserDashboard(props) {
  let cache = props.route.params.cache
  const navigation = props.navigation

  const [expanded, setExpanded] = useState(null)

  const { width, height } = useDimensions().window
  const slidingAnim = useRef(new Animated.Value(-1 * width - 25)).current

  const [user, setUser] = useState(null)
  const [gyms, setGyms] = useState(null)

  const [Markers, MarkersCreate] = useState(null)
  const [CurrentGymBadge, GymBadgeCreate] = useState(null)

  useEffect(() => {
    async function init() {
      let user = await retrieveUserData(cache)
      setUser(user)
      let promises = await Promise.all([
        retrieveGymsByLocation(cache),
        retrieveClassesByUser(cache),
      ])
      setGyms(promises[0])
    }
    init()
  }, [])

  /**
   * Some logic to control Native Back Button
   */
  useEffect(() => {
    CACHE("UserDashboard/toggleMenu").set(() => setExpanded(expanded => !expanded))

    // Takes control or releases it upon each toggle of the side menu
    if (expanded) CACHE("UserDashboard/toggleMenu/enabled").set(true)
    else CACHE("UserDashboard/toggleMenu/enabled").set(false)

    // Stops listening upon leaving screen
    navigation.addListener("blur", () => {
      CACHE("UserDashboard/toggleMenu/enabled").set(false)
    })

    // Continues listening upon coming back to screen
    navigation.addListener("focus", () => {
      if (expanded === null) return // do not run on initial render
      CACHE("UserDashboard/toggleMenu/enabled").set(true)
    })

    const onBack = () => {
      const controlled = CACHE("UserDashboard/toggleMenu/enabled").get()
      const toggleMenu = CACHE("UserDashboard/toggleMenu").get()

      if (controlled) {
        toggleMenu()
        return true
      }
    }
    
    // Even though this is called every expanded state change,
    // assuming it doesn't matter how many listeners are added
    BackHandler.addEventListener('hardwareBackPress', onBack)
  }, [expanded])

  useEffect(() => {
    if (!gyms) return

    MarkersCreate(gyms.map((gym, idx) => {
      if (gym.hidden_on_map) return

      return (
        <Marker
          coordinate={gym.coordinate}
          key={idx}
          onPress={async () => {
            const gymIconUri = await publicStorage(gym.icon_uri)

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
                      iconUri={gym.icon_uri}
                      key={idx}
                      onMoreInfo={() => {
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
      )
    }
    ))
  }, [gyms])

  function sidePanelSlideIn() {
    Animated.timing(slidingAnim, {
      toValue: -1 * width - 25, // -25 to hide the added side in <ProfileLayout /> as well
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

  useEffect(() => {
    if (expanded === null) return // do not run on initial render
    if (expanded) sidePanelSlideOut()
    else sidePanelSlideIn()
  }, [expanded])



  return (
    <>
    <MapView
      style={styles.map}
      // provider={PROVIDER_GOOGLE}
      customMapStyle={mapStyle2}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {Markers}
    </MapView>

    { CurrentGymBadge }

       <CustomTextInput
          containerStyle={{
            // borderColor: redFields.includes("first") ? "red" : undefined,
            position: "absolute", paddingTop: 0, top: 170, left: 35, width: 300, height: 60, textAlign: "center", backgroundColor: "#fff", fontSize: 24
          }}
        placeholder="Search for a gym"
        multiline={false}
        numberOfLines={1}
          // value={first}
          // onChangeText={setFirst}
        />
      {/* <CustomTextInput style={{ position: "absolute", top: 170, left: 35, width: 300, height: 60, textAlign: "center", backgroundColor: "#fff", fontSize: 24 }} placeholderTextColor={"#000"} placeholder={
        "Testing"
      }>
        
    </CustomTextInput> */}

    {
    !user ? null :
    expanded ? null :
      <View style={{
        marginTop: 50,
        marginLeft: 15,
        position: "absolute",
        zIndex: 0,
      }}>
        <TouchableHighlight
          style={{
            borderRadius: 999,
          }}
          underlayColor="#000000C0"
          onPress={() => setExpanded(!expanded)}
          // [uncomment upon DEBUG start]
          // onLongPress={() => setExpanded(!expanded)}
          // [comment upon DEBUG end]
        >
          <Icon
            containerStyle={{
              width: 64,
              height: 64,
              borderRadius: 999,
              overflow: "hidden",
              ...simpleShadow,
            }}
            source={{ uri: user.icon_uri_full }}
          />
        </TouchableHighlight>
      </View>
      }
      

    {!user ? null :
    <Animated.View style={[styles.sidePanel, { left: slidingAnim }]}>
      <ProfileLayout
        innerContainerStyle={{
          paddingBottom: 10,
        }}
        buttonOptions={{
          logOut: {
            show: true,
            onLongPress: () => {
              auth().signOut()
              GoogleSignin.signOut()
              LoginManager.logOut()
              const pushAction = StackActions.push("Boot")
              navigation.dispatch(pushAction)
              if (expanded) setExpanded(false)
            }
          },
        }}
        onBack={() => setExpanded(!expanded)}
      >
        <CustomButton
          icon={
            <Icon
              source={require("../components/img/png/my-classes.png")}
            />
          }
          title="My Classes"
          onPress={() => {
            props.navigation.navigate("ScheduleViewer")
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