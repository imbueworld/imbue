import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Animated,
  TouchableHighlight,
  BackHandler,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { publicStorage } from '../backend/BackendFunctions';
import { useDimensions } from '@react-native-community/hooks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ProfileLayout from '../layouts/ProfileLayout';
import {
  clockFromTimestamp,
  dateStringFromTimestamp,
  shortDateFromTimestamp,
} from '../backend/HelperFunctions';
import CustomButton from '../components/CustomButton';
import auth from '@react-native-firebase/auth';
import Icon from '../components/Icon';
import { simpleShadow } from '../contexts/Colors';
import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager } from 'react-native-fbsdk';
import { useNavigation } from '@react-navigation/native';
import User from '../backend/storage/User';
import cache from '../backend/storage/cache';
import AlgoliaSearchAbsoluteOverlay from '../components/AlgoliaSearchAbsoluteOverlay';
import config from '../../../App.config';
//import { create } from 'react-test-renderer';
import { FONTS } from '../contexts/Styles';
import { colors } from '../contexts/Colors';
import LottieView from 'lottie-react-native';
import CalendarView from '../components/CalendarView';
import ClassList from '../components/ClassList';
import useStore from '../store/RootStore';
import { observer } from 'mobx-react-lite';

const UserDashboard = observer(props => {
  const { userStore } = useStore();
  const navigation = useNavigation();

  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const { width, height } = useDimensions().window;
  const slidingAnim = useRef(new Animated.Value(-1 * width - 25)).current;
  const cardIconLength = width / 4;
  const [calendarData, setCalendarData] = useState(null);
  const [slctdDate, setSlctdDate] = useState(
    dateStringFromTimestamp(Date.now()),
  );

  const [user, setUser] = useState(null);
  const [featuredPartners, setFeaturedPartners] = useState([]);
  const [partners, setPartners] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [classes, setClasses] = useState([]);

  const init = async () => {
    const user = new User();
    const fireUser = await user.retrieveUser();
    setUser(fireUser);
    // This acts as a prefetch for when user eventually navs to ScheduleViewer

    // retrieving all partners
    firestore()
      .collection('partners')
      .get()
      .then(async querySnapshot => {
        let resPartners = [];
        let resFeaturePartners = [];
        querySnapshot.forEach(async documentSnapshot => {
          const partnersData = documentSnapshot.data();
          if (partnersData.approved == true) {
            // perfectFeaturedPartnersList(documentSnapshot.data());
            const res = await publicStorage(partnersData.icon_uri);
            const updatedPartners = {
              ...partnersData,
              icon_uri: res,
            };
            if (updatedPartners.featured) {
              resFeaturePartners.push(updatedPartners);
            }
            resPartners.push(updatedPartners);
          }
        });
        setPartners(resPartners);
        setFeaturedPartners(resFeaturePartners);
        firestore()
          .collection('gyms')
          .get()
          .then(querySnapshot => {
            let resGyms = [];
            querySnapshot.forEach(documentSnapshot => {
              resGyms.push(documentSnapshot.data());
            });
            setGyms(resGyms);
          });

        userStore.getUserClasses();
        setLoading(false);
      });
  };

  useEffect(() => {
    if (userStore.classes !== null) setCalendarData(userStore.classes);
  }, [userStore.classes]);

  useEffect(() => {
    init();
  }, []);

  /**
   * Some logic to control Native Back Button
   */
  useEffect(() => {
    cache('UserDashboard/toggleMenu').set(() =>
      setExpanded(expanded => !expanded),
    );

    // Takes control or releases it upon each toggle of the side menu
    if (expanded) cache('UserDashboard/toggleMenu/enabled').set(true);
    else cache('UserDashboard/toggleMenu/enabled').set(false);

    // Stops listening upon leaving screen
    navigation.addListener('blur', () => {
      cache('UserDashboard/toggleMenu/enabled').set(false);
    });

    // Continues listening upon coming back to screen
    navigation.addListener('focus', () => {
      if (expanded === null) return; // do not run on initial render
      cache('UserDashboard/toggleMenu/enabled').set(true);
    });

    const onBack = () => {
      const controlled = cache('UserDashboard/toggleMenu/enabled').get();
      const toggleMenu = cache('UserDashboard/toggleMenu').get();

      if (controlled) {
        toggleMenu();
        return true;
      }
    };

    // Even though this is called every expanded state change,
    // assuming it doesn't matter how many listeners are added
    BackHandler.addEventListener('hardwareBackPress', onBack);
  }, [expanded]);

  function sidePanelSlideIn() {
    Animated.timing(slidingAnim, {
      toValue: -1 * width - 25, // -25 to hide the added side in <ProfileLayout /> as well
      duration: 275,
      useNativeDriver: false,
    }).start();
  }

  function sidePanelSlideOut() {
    Animated.timing(slidingAnim, {
      toValue: 0,
      duration: 425,
      useNativeDriver: false,
    }).start();
  }

  useEffect(() => {
    if (expanded === null) return; // do not run on initial render
    if (expanded) sidePanelSlideOut();
    else sidePanelSlideIn();
  }, [expanded]);

  // render each card
  const Item = ({ description, item, onPress }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.itemWrapper}>
      <Icon
        containerStyle={{
          width: cardIconLength,
          height: cardIconLength,
          borderRadius: 50,
          overflow: 'hidden',
        }}
        source={{ uri: item.icon_uri }}
      />
      <Text style={styles.itemName}>{item.first}</Text>
      <Text style={styles.itemDescription}>{description}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    var gymId = item.associated_gyms;
    const filterGyms = gyms.filter(data => data.id === gymId[0]);

    if (filterGyms.length !== 0) {
      return (
        <Item
          description={filterGyms[0].description}
          item={item}
          onPress={() => navigation.navigate('GymDescription', filterGyms[0])}
          style={{ backgroundColor: '#333', borderRadius: 30 }}
        />
      );
    }
  };

  return (
    <SafeAreaView style={expanded == true ? styles.sa2 : styles.sa1}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled">
        {!user ? null : (
          <View
            style={{
              marginTop: 30,
              marginLeft: 15,
              zIndex: 0,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                borderRadius: 999,
              }}
              underlayColor="#ffffff"
              onPress={() => setExpanded(!expanded)}>
              <Icon
                containerStyle={{
                  width: 64,
                  height: 64,
                  borderRadius: 999,
                  overflow: 'hidden',
                  // ...simpleShadow,
                }}
                source={{ uri: user.icon_uri_full }}
              />
            </TouchableOpacity>
          </View>
        )}

        {!user ? null : (
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
                    ]);
                    if (expanded) setExpanded(false);
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Boot' }],
                    });
                  },
                },
              }}
              onBack={() => setExpanded(!expanded)}>
              <CustomButton
                // icon={
                //   <Icon
                //     source={require("../components/img/png/my-classes.png")}
                //   />
                // }
                title="My Classes"
                onPress={() => {
                  props.navigation.navigate('ScheduleViewer');
                }}
              />
              <CustomButton
                // icon={
                //   <Icon
                //     source={require("../components/img/png/user-memberships.png")}
                //   />
                // }
                title="Memberships"
                onPress={() => props.navigation.navigate('UserMemberships')}
              />
              <CustomButton
                // icon={
                //   <Icon
                //     source={require("../components/img/png/profile.png")}
                //   />
                // }
                title="Edit Profile"
                onPress={() => props.navigation.navigate('ProfileSettings')}
              />
              <CustomButton
                // icon={
                //   <Icon
                //     source={require("../components/img/png/generic-credit-card.png")}
                //   />
                // }
                title="Payment Settings"
                onPress={() => props.navigation.navigate('PaymentSettings')}
              />
            </ProfileLayout>
          </Animated.View>
        )}

        <AlgoliaSearchAbsoluteOverlay />
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

        {/* <View style={{top: 200, height: 130, marginLeft: 10, marginRight: 10, marginTop: 30}}>
          <Text style={{flex: 1, textAlign: "center", ...FONTS.heading }}>view your classes</Text>
          <CustomButton
              title="My Classes"
              onPress={() => {
                props.navigation.navigate("ScheduleViewer")
              }}
            />
        </View> */}

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
        {!loading && calendarData !== null ? (
          <>
            <View style={styles.capsule}>
              <View style={styles.innerCapsule}>
                <Text style={styles.listTitle}>Your Classes</Text>
                <CalendarView
                  containerStyle={{
                    borderWidth: 1,
                    borderColor: colors.gray,
                  }}
                  data={calendarData}
                  slctdDate={slctdDate}
                  setSlctdDate={setSlctdDate}
                />

                <ClassList
                  containerStyle={styles.classListContainer}
                  data={calendarData}
                  dateString={slctdDate}
                />
              </View>
            </View>

            <View style={styles.cardContainer}>
              <Text style={styles.listTitle}>featured</Text>
              <FlatList
                horizontal
                data={featuredPartners}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={{}}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            {/* all partners */}
            <View style={styles.cardContainer}>
              <Text style={styles.listTitle}>all influencers</Text>
              <FlatList
                horizontal
                data={partners}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 10 }}
                style={{}}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </>
        ) : (
            <View
              style={[
                styles.cardContainer,
                {
                  alignItems: 'center',
                },
              ]}>
              <LottieView
                source={require('../components/img/animations/cat-loading.json')}
                style={{ height: 100, width: 100 }}
                autoPlay
                loop
              />
            </View>
          )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
});

export default UserDashboard;

const styles = StyleSheet.create({
  capsule: {
    paddingRight: 10,
    backgroundColor: '#ffffff',
    paddingLeft: 10,
  },
  innerCapsule: {
    width: '100%',
    paddingBottom: 10,
    alignSelf: 'center',
    // backgroundColor: "#FFFFFF80",
    backgroundColor: '#ffffff',
    borderWidth: 1,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderBottomWidth: 1,
    borderColor: colors.gray,
    borderRadius: 25,
  },
  classListContainer: {
    marginTop: 10,
  },
  scrollView: {
    height: '200%',
  },
  sa1: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  sa2: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  listTitle: {
    flex: 1,
    marginBottom: 10,
    textAlign: 'center',
    ...FONTS.heading,
  },
  itemDescription: {
    color: '#F9F9F9',
    textAlign: 'center',
    paddingHorizontal: 10,
    ...FONTS.cardBody,
    paddingTop: 5,
  },
  itemName: {
    color: '#F9F9F9',
    textAlign: 'center',
    paddingHorizontal: 10,
    ...FONTS.cardTitle,
    paddingTop: 5,
  },
  itemWrapper: {
    flex: 1,
    backgroundColor: '#242429',
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 10,
    marginLeft: 5,
    marginRight: 5,
    width: 115,
  },
  container: {
    // minHeight: "100%", // This breaks sidePanel within <Anmimated.View>; minHeight does not synergize well with child position: "absolute" 's ? ; Unless it's used for ScrollView containerStyle?
    // flex: 1,
    // width: "100%",
    // height: "100%",
  },
  sidePanel: {
    width: '100%',
    height: '100%',
    // minWidth: "100%",
    // minHeight: "100%",
    position: 'absolute',
    zIndex: 100,
    backgroundColor: '#FFFFFF',
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
    width: '100%',
    marginBottom: 40,
    bottom: 0,
  },
  cardContainer: {
    height: 230,
    marginTop: 30,
  },
});
