import React, { useState, useEffect, useRef } from 'react'
import { SafeAreaView, StyleSheet, View, Animated, TouchableHighlight, BackHandler, FlatList, TouchableOpacity, Text, Image } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import { publicStorage } from '../backend/BackendFunctions'
import { useDimensions } from '@react-native-community/hooks'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import ProfileLayout from "../layouts/ProfileLayout"

import CustomButton from "../components/CustomButton"
import CustomTextInput from "../components/CustomTextInput"

import auth from "@react-native-firebase/auth"
import Icon from '../components/Icon'
import { simpleShadow } from '../contexts/Colors' 
import { GoogleSignin } from '@react-native-community/google-signin'
import { LoginManager } from 'react-native-fbsdk'
import { useNavigation } from '@react-navigation/native'
import User from '../backend/storage/User'
import cache from '../backend/storage/cache'
import AlgoliaSearchAbsoluteOverlay from '../components/AlgoliaSearchAbsoluteOverlay'
import config from '../../../App.config'
import ImbueMap from '../components/ImbueMap'
import { create } from 'react-test-renderer';
import { FONTS } from "../contexts/Styles"
import { colors } from "../contexts/Colors"
import { ScrollView } from 'react-native-gesture-handler';


export default function UserDashboard(props) {
  const navigation = useNavigation()

  const [expanded, setExpanded] = useState(null)

  const { width, height } = useDimensions().window
  const slidingAnim = useRef(new Animated.Value(-1 * width - 25)).current
  const cardIconLength = width / 4

  const [user, setUser] = useState(null)
  const [featuredPartners, setFeaturedPartners] = useState([])
  const [partners, setPartners] = useState([])
  const [gyms, setGyms] = useState([])
  const [classes, setClasses] = useState([])

  useEffect(() => {
    const init = async () => {
      const user = new User()
      setUser(await user.retrieveUser())
      // This acts as a prefetch for when user eventually navs to ScheduleViewer
      user.retrieveClasses() 

      // retrieving all partners
      const partnersCollection = firestore()
        .collection('partners')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            // converting icon_uris to download urls
            // check if accepted
            if(documentSnapshot.data().approved == true) {
              perfectFeaturedPartnersList(documentSnapshot.data())
            }
          });
        });
      
      // retrieving all gyms
      const gymsCollection = firestore()
        .collection('gyms')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            console.log("gym")
            setGyms(prevArray => [...prevArray, documentSnapshot.data()])
          });
        });
      
    }; init()
  }, [])

  // Reset states
  useEffect(() => {
    const init = async () => {
      // setFeaturedPartners([])
      // setGyms([])
      // setPartners([])
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

  // does all asyncronous work on list so Flatlist can load data directly
  const perfectFeaturedPartnersList = async (data) => {
    let promises = []
    promises.push(publicStorage(data.icon_uri))
    const res = await Promise.all(promises)
    var profileImg = res[0]
    data.icon_uri = profileImg

    //splitting partners into featured 
    if (data.featured === true) {
      setFeaturedPartners(prevArray => [...prevArray, data])
    }
    setPartners(prevArray => [...prevArray, data])
  }

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

  // render each card
  const Item = ({ description, item, onPress }) => (
    <TouchableOpacity onPress={onPress} style={{ flex: 1, backgroundColor: "#242429", borderRadius: 20, padding: 10, marginLeft: 5, marginRight: 5, width: 115 }}>
      <Icon
        containerStyle={{
          width: cardIconLength,
          height: cardIconLength,
          borderRadius: 50,
          overflow: 'hidden', 
        }}
        source={{ uri: item.icon_uri }}
      />
      <Text style={{ color: "#F9F9F9", textAlign: "center", ...FONTS.cardTitle, paddingTop: 5 }}>{item.first}</Text>
      <Text style={{ color: "#F9F9F9", textAlign: "center", ...FONTS.cardBody, paddingTop: 5 }}>{description}</Text>
    </TouchableOpacity>
  );


  const renderItem = ({ item }) => {
    var gymId = item.associated_gyms
    var description = ""
    var thisGym 
    gyms.map((data) => {
      {
        data.id === gymId[0] ? 
          (description = data.description,
            thisGym = data)
          : (null)
      }
    })
    return (
      <Item 
        description={description}
        item={item} 
        onPress={() => navigation.navigate('GymDescription', thisGym)} 
        style={{ backgroundColor: "#333", borderRadius: 30 }}
      />
    );
  };


  return (
   <SafeAreaView  style={ (expanded==true) ? styles.sa2 : styles.sa1}>
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollView}
      keyboardShouldPersistTaps='handled'
        // alwaysBounceVertical={false} 
    >
        {/* <ImbueMap style={styles.map} /> */}
        
        {/* <View style={{ top: 220, marginLeft: 50, marginRight: 50 }}>
         <Text style={{ flex: 1, textAlign: "center", ...FONTS.heading }}>my classes</Text>
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
        </View> */}

        <View style={{top: 200, height: 130, marginLeft: 10, marginRight: 10, marginTop: 30}}>
          <Text style={{flex: 1, textAlign: "center", ...FONTS.heading }}>view your classes</Text>
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
        </View>

        {/* upcoming classes */}
        {/* {classes.length ?
        (<View style={styles.cardContainer}>
          <Text style={{ flex: 1, textAlign: "center", ...FONTS.heading }}>upcoming classes</Text>
          <FlatList
            horizontal
            data={partners}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={{}}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        ) : (
          <View style={{ top: 200, height: 80, marginLeft: 10, marginRight: 10, marginTop: 30, marginBottom: 30 }}>
              <Text style={{ flex: 1, textAlign: "center", ...FONTS.heading }}>upcoming classes</Text>
              <Text style={{ ...FONTS.subtitle, textAlign: "center" }}>you have no upcoming classes. Book some now</Text>
          </View>
          )}
         */}

      {/* featured partners */}
      <View style={styles.cardContainer}>
        <Text style={{flex: 1, textAlign: "center", ...FONTS.heading }}>featured</Text>
        <FlatList
          horizontal
          data={featuredPartners}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{}}
          showsHorizontalScrollIndicator={false}
          />
      </View>

      {/* all partners */}
      <View style={styles.cardContainer}>
        <Text style={{flex: 1, textAlign: "center", ...FONTS.heading }}>all influencers</Text>
        <FlatList
          horizontal
          data={partners}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{}}
          showsHorizontalScrollIndicator={false}
          />
      </View>
      <AlgoliaSearchAbsoluteOverlay 
    style={{ 
      position: 'absolute', 
      top: 200, }}
      />

    {
    !user ? null :
    expanded ? null :
      <View style={{
        marginTop: 30,
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
          // [v DEBUG ONLY v]
          onLongPress={config.DEBUG ? (() => setExpanded(!expanded)) : undefined}
          // [^ DEBUG ONLY ^]
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
            onPress: async () => {
              await Promise.all([
                auth().signOut(),
                GoogleSignin.signOut(),
                LoginManager.logOut(),
              ])
              if (expanded) setExpanded(false)
              navigation.reset({
                index: 0,
                routes: [{ name: 'Boot' }],
              })
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
          title="Memberships"
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
      </KeyboardAwareScrollView>
      </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    height: "130%",
  },
  sa1: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0
  },
  sa2: {
    flex: 1, backgroundColor: colors.bg,
    paddingTop: Platform.OS === 'android' ? 25 : 0
  },
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
    backgroundColor: "#F9F9F9"
  },
  // map: {
  //   position:'absolute',
  //   // top:0,
  //   // left:0,
  //   // right:0,
  //   // bottom:0,
  //   width: '100%',
  //   height: '100%',
  //   zIndex: -100,
  // },
  badgeContainer: {
    width: "100%",
    marginBottom: 40,
    bottom: 0,
  },
  cardContainer: {
    top: 200, height: 230, marginLeft: 10, marginRight: 10, marginTop: 30
  }
})