import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Animated, TouchableHighlight, BackHandler } from 'react-native'

import { useDimensions } from '@react-native-community/hooks'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "../components/CustomButton"
import GymBadge from "../components/GymBadge"
import CustomTextInput from "../components/CustomTextInput"

import auth from "@react-native-firebase/auth"
import Icon from '../components/Icon'
import { publicStorage } from '../backend/BackendFunctions'
import { simpleShadow } from '../contexts/Colors'
import { GoogleSignin } from '@react-native-community/google-signin'
import { LoginManager } from 'react-native-fbsdk'
import { useNavigation } from '@react-navigation/native'
import User from '../backend/storage/User'
import GymsCollection from '../backend/storage/GymsCollection'
import cache from '../backend/storage/cache'
import AlgoliaSearchAbsoluteOverlay from '../components/AlgoliaSearchAbsoluteOverlay'



export default function UserDashboard(props) {
  const navigation = useNavigation()

  const [expanded, setExpanded] = useState(null)

  const { width, height } = useDimensions().window
  const slidingAnim = useRef(new Animated.Value(-1 * width - 25)).current

  const [user, setUser] = useState(null)
  const [gyms, setGyms] = useState(null)

  const [Markers, MarkersCreate] = useState(null)
  const [CurrentGymBadge, GymBadgeCreate] = useState(null)

  useEffect(() => {
    async function init() {
      const user = new User()
      setUser(await user.retrieveUser())

      const gyms = new GymsCollection()
      let temp = (
        await gyms.__retrieveAll()
      ).map(it => it.getAll())
      setGyms(temp)

      // This acts as a prefetch for when user eventually navs to ScheduleViewer
      user.retrieveClasses()
    }; init()
  }, [])

  /**
   * Some logic to control Native Back Button
   */
  useEffect(() => {
    cache("UserDashboard/toggleMenu").set(() => setExpanded(expanded => !expanded))

    // Takes control or releases it upon each toggle of the side menu
    if (expanded) cache("UserDashboard/toggleMenu/enabled").set(true)
    else cache("UserDashboard/toggleMenu/enabled").set(false)

    // Stops listening upon leaving screen
    navigation.addListener("blur", () => {
      cache("UserDashboard/toggleMenu/enabled").set(false)
    })

    // Continues listening upon coming back to screen
    navigation.addListener("focus", () => {
      if (expanded === null) return // do not run on initial render
      cache("UserDashboard/toggleMenu/enabled").set(true)
    })

    const onBack = () => {
      const controlled = cache("UserDashboard/toggleMenu/enabled").get()
      const toggleMenu = cache("UserDashboard/toggleMenu").get()

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
      const {
        hidden_on_map,
        coordinate,
      } = gym

      if (hidden_on_map) return
      if (!coordinate) return

      // Make sure coordinates are of type number
      const parsedCoordinates = {}
      for (let coord in coordinate) {
        parsedCoordinates[ coord ] = parseFloat(coordinate[ coord ])
      }

      return (
        <Marker
          coordinate={parsedCoordinates}
          key={idx}
          onPress={async () => {
            const gymIconUri = await publicStorage(gym.icon_uri)

            GymBadgeCreate(
              gyms
                .filter((gym, idx2) => idx2 === idx)
                .map(gym => {
                  const {
                    name,
                    description,
                    rating,
                    rating_weight,
                    id,
                  } = gym

                  return (
                    <GymBadge
                      containerStyle={styles.badgeContainer}
                      name={name}
                      desc={description}
                      rating={`${rating} (${rating_weight})`}
                      relativeDistance={""}
                      iconUri={gymIconUri}
                      key={idx}
                      onMoreInfo={() => {
                        props.navigation.navigate(
                          "GymDescription", { gymId: id })
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

  var mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ]


  return (
    <>
      <AlgoliaSearchAbsoluteOverlay style={{position: 'absolute', top: 300, }}/>

    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={{
        latitude: 37.78825, 
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      customMapStyle={mapStyle}
    >
      { Markers }
    </MapView>

    { CurrentGymBadge }

    {/* <CustomTextInput
      containerStyle={{
        // borderColor: redFields.includes("first") ? "red" : undefined,
        position: "absolute", paddingTop: 0, top: 170, left: 35, width: 300, height: 60, textAlign: "center", backgroundColor: "#fff", fontSize: 24
      }}
    placeholder="Search for a gym"
    multiline={false}
    numberOfLines={1}
      // value={first}
      // onChangeText={setFirst}
    /> */}
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
          onLongPress={() => setExpanded(!expanded)}
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
            onPress: () => {
              auth().signOut()
              GoogleSignin.signOut()
              LoginManager.logOut()
              navigation.reset({
                index: 0,
                routes: [{ name: 'Boot' }],
              })
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
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0,
    // width: "100%",
    // height: "100%",
    // backgroundColor: "#addbff", // water fill before map loads
    zIndex: -1000,
  },
  badgeContainer: {
    width: "100%",
    marginBottom: 40,
    bottom: 0,
  },
})