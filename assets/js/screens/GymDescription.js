import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View, Platform} from 'react-native';

import CustomButton from '../components/CustomButton';
import MembershipApprovalBadge from '../components/MembershipApprovalBadge';
import MembershipApprovalBadgeImbue from '../components/MembershipApprovalBadgeImbue';
import firestore from '@react-native-firebase/firestore';

import {colors} from '../contexts/Colors';
import GymLayout from '../layouts/GymLayout';
import {FONTS} from '../contexts/Styles';
import CreditCardSelectionV2 from '../components/CreditCardSelectionV2';
import Icon from '../components/Icon';
import User from '../backend/storage/User';
import Gym from '../backend/storage/Gym';
import config from '../../../App.config';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import functions from '@react-native-firebase/functions';
import Share from 'react-native-share';
import {
  clockFromTimestamp,
  currencyFromZeroDecimal,
  dateStringFromTimestamp,
  shortDateFromTimestamp,
} from '../backend/HelperFunctions';
import CalendarView from '../components/CalendarView';
import ClassList from '../components/ClassList';
import LottieView from 'lottie-react-native';

export default function GymDescription(props) {
  const {id} = props.route.params;
  console.log(props.route.params);
  const [gymId, setGymId] = useState('');
  const [calendarData, setCalendarData] = useState(null);
  const [slctdDate, setSlctdDate] = useState(
    dateStringFromTimestamp(Date.now()),
  );
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [r, refresh] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [gym, setGym] = useState('');
  const [partnerInfo, setPartnerInfo] = useState(null);

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  const [Genres, GenresCreate] = useState(null);
  const [Desc, DescCreate] = useState(null);
  const [Name, NameCreate] = useState(null);

  const [popup, setPopup] = useState(false);

  const [hasMembership, setHasMembership] = useState(null);
  ``;

  useEffect(() => {
    setGymId(id);
    const init = async () => {
      const gymData = new Gym();
      setGym(await gymData.retrieveGym(id));
      console.log(gym);
      const thisUser = new User();
      setUser(await thisUser.retrieveUser());
      setUserId(user.uid);
    };
    init();
  }, []);
  // https://imbuefitness.app.link/aEImCZ8ksfb
  function getFormatted(classItem) {
    const processedClass = classItem; // avoid affecting cache
    processedClass.active_times = processedClass.active_times.map(timeDoc => ({
      ...timeDoc,
    })); // avoid affecting cache
    const {active_times} = processedClass;
    const currentTs = Date.now();
    let additionalFields;

    active_times.forEach(timeDoc => {
      const {begin_time, end_time} = timeDoc;

      // Add formatting to class,
      // which is later used by <ScheduleViewer />, and potentially others.
      additionalFields = {
        dateString: dateStringFromTimestamp(begin_time),
        formattedDate: shortDateFromTimestamp(begin_time),
        formattedTime:
          `${clockFromTimestamp(begin_time)} – ` +
          `${clockFromTimestamp(end_time)}`,
      };
      Object.assign(timeDoc, additionalFields);

      // Add functionality, same reasons
      // ... not here, most likely!

      // Add state identifiers~
      timeDoc.livestreamState = 'offline'; // default
      let timePassed = currentTs - begin_time; // Positive if class has started or already ended

      // If time for class has come, but class has not ended yet
      if (timePassed > 0 && currentTs < end_time) {
        timeDoc.livestreamState = 'live';
      }

      // If livestream is starting soon (30min before)
      if (timePassed > -30 * 60 * 1000 && currentTs < begin_time) {
        timeDoc.livestreamState = 'soon';
      }
    });

    return processedClass;
  }

  useEffect(() => {
    async function getClasses() {
      if (gymId) {
        setCalendarLoading(true);
        const gym = new Gym();
        const {name} = await gym.retrieveGym(gymId);

        //  get Gym's classes
        await firestore()
          .collection('classes')
          .get()
          .then(querySnapshot => {
            const classes = [];

            querySnapshot.forEach(documentSnapshot => {
              if (documentSnapshot.data().gym_id == gymId) {
                let formatted = getFormatted(documentSnapshot.data());
                classes.push({
                  ...formatted,
                });
              }
            });
            console.log('Classes:' + JSON.stringify(classes));
            setCalendarData(classes);
          });

        setCalendarLoading(false);
      }
    }
    getClasses();
  }, [gymId]);

  useEffect(() => {
    const init = async () => {
      if (!gym) return;
      if (!user) return;
      const imbue = new Gym();

      const {id: imbueId} = await imbue.retrieveGym('imbue');

      let hasMembership = user.active_memberships.includes(imbueId)
        ? 'imbue'
        : user.active_memberships.includes(gym.id)
        ? 'gym'
        : false;

      setHasMembership(hasMembership);
    };
    init();
  }, [user, gym]);

  useEffect(() => {
    if (!gym) return;

    NameCreate(
      <View style={styles.nameContainer}>
        <Text style={styles.nameText}>{gym.name}</Text>
      </View>,
    );
    GenresCreate(
      <View style={styles.genreContainer}>
        {gym.genres &&
          gym.genres.map((txt, idx) => (
            <View style={styles.genre} key={idx}>
              <Text style={styles.genreText}>{txt}</Text>
            </View>
          ))}
      </View>,
    );
    DescCreate(
      <View style={styles.descContainer}>
        <Text style={styles.descText}>{gym.description}</Text>
      </View>,
    );
  }, [gym]);

  function openClassesSchedule() {
    props.navigation.navigate('ScheduleViewer', {gymId});
  }

  if (!gym) return <View />;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        paddingTop: Platform.OS === 'android' ? 25 : 0,
      }}>
      <GymLayout
        innerContainerStyle={{
          paddingBottom: 10,
        }}
        data={gym}>
        {Name}
        {Genres}
        {Desc}
        {calendarLoading ? (
          <View style={{alignItems: 'center', marginVertical: 10}}>
            <LottieView
              source={require('../components/img/animations/cat-loading.json')}
              style={{height: 100, width: 100}}
              autoPlay
              loop
            />
          </View>
        ) : (
          <View style={styles.capsule}>
            <View style={styles.innerCapsule}>
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
        )}
        {/* <CustomButton
        style={{
          marginBottom: 0,
        }}
          title="Join Livestream for Free"
          onPress={() => {
            props.navigation.navigate("Livestream", { gymId })
          }}
        /> */}
        {/* 
      <CustomButton
        style={{
          marginBottom: 0,
        }}
        title="Classes"
        onPress={openClassesSchedule}
        />
         */}

        {errorMsg ? <Text style={{color: 'red'}}>{errorMsg}</Text> : null}
        {successMsg ? <Text style={{color: 'green'}}>{successMsg}</Text> : null}

        {/* if null, it means it hasn't been initialized yet. */}
        {hasMembership === null ? (
          <View />
        ) : hasMembership ? null : (
          <>
            {popup === 'buy' ? (
              <CreditCardSelectionV2
                containerStyle={styles.cardSelectionContainer}
                title={
                  <Text>
                    {`Confirm payment for ${gym.name}'s`}
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                      }}>
                      Unlimited Membership:
                    </Text>
                  </Text>
                }
                price={
                  <Text>{`$${
                    gym.membership_price_online
                      ? currencyFromZeroDecimal(gym.membership_price_online)
                      : 0
                  } `}</Text>
                }
                onX={() => setPopup(null)}
                onCardSelect={async paymentMethodId => {
                  try {
                    setErrorMsg('');
                    setSuccessMsg('');

                    const {id: gymId} = gym;

                    const user = new User();
                    await user.purchaseGymMembership({
                      user,
                      paymentMethodId,
                      gymId,
                    });

                    // sendGridPurchasedYourMembership
                    try {
                      // initiate SendGrid email
                      const sendGridPurchasedYourMembership = functions().httpsCallable(
                        'sendGridPurchasedYourMembership',
                      );
                      await sendGridPurchasedYourMembership(gymId);
                    } catch (err) {
                      setErrorMsg('Email could not be sent');
                    }

                    // sendGridMemberPurchasedMembership
                    try {
                      // initiate SendGrid email
                      const sendGridMemberPurchasedMembership = functions().httpsCallable(
                        'sendGridMemberPurchasedMembership',
                      );
                      await sendGridMemberPurchasedMembership(userId);
                    } catch (err) {
                      setErrorMsg('Email could not be sent');
                    }

                    // After success with purchase
                    setHasMembership('gym');
                    navigation.navigate('SuccessScreen', {
                      successMessageType: 'UserPurchasedMembership',
                    });
                    setTimeout(() => {
                      navigation.navigate('ScheduleViewer');
                    }, 7000);
                  } catch (err) {
                    if (config.DEBUG) console.error(err.message); // DEBUG
                    switch (err.code) {
                      case 'busy':
                        setErrorMsg(err.message);
                        break;
                      case 'membership-already-bought':
                        setSuccessMsg(err.message);
                        break;
                      default:
                        setErrorMsg('Something prevented the action.');
                        break;
                    }
                  }
                }}
              />
            ) : (
              <>
                <CustomButton
                  style={{
                    marginBottom: 20,
                  }}
                  title="Get Membership"
                  onPress={() => setPopup('buy')}
                  // Icon={
                  //   <Icon
                  //     source={require("../components/img/png/membership.png")}
                  //   />
                  // }
                />

                {/* <CustomButton
                style={{
                  marginBottom: 0,
                }}
                textStyle={{
                  fontSize: 16,
                }}
                title="Get Imbue Universal Membership"
                onPress={() => props.navigation.navigate("PurchaseUnlimited")}
                Icon={
                  <Icon
                    source={require("../components/img/png/membership-2.png")}
                  />
                }
              /> */}
              </>
            )}
          </>
        )}

        {hasMembership === 'gym' ? (
          <MembershipApprovalBadge
            containerStyle={{
              marginTop: 10,
            }}
            data={gym}
          />
        ) : null}

        {hasMembership === 'imbue' ? (
          <MembershipApprovalBadgeImbue
            containerStyle={{
              marginTop: 10,
            }}
            data={gym}
          />
        ) : null}
      </GymLayout>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // scrollView: {
  //     minHeight: "100%",
  // },
  // container: {
  //     width: "88%",
  //     marginVertical: 30,
  //     alignSelf: "center",
  // },
  // innerContainer: {
  //     paddingHorizontal: 0,
  // },
  // gymImg: {
  //     width: "100%",
  //     height: "100%",
  //     height: 300,
  //     borderRadius: 30,
  //     borderBottomLeftRadius: 0,
  //     borderBottomRightRadius: 0,
  // },
  // button: {
  //     // marginVertical: 20,
  //     marginTop: 10,
  //     marginBottom: 0,
  // },
  cardSelectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 30,
    marginBottom: hp('5%'),
  },
  capsule: {
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
  },
  
  innerCapsule: {
    width: '100%',
    marginBottom: 20,
    paddingBottom: 10,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 25,
  },
  classListContainer: {
    marginTop: 10,
  },
  nameContainer: {},
  nameText: {
    marginTop: hp('2%'),
    ...FONTS.title,
    textAlign: 'center',
    fontSize: 27,
  },
  genreContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genre: {
    marginRight: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  genreText: {
    ...FONTS.subtitle,
    fontSize: 14,
  },
  descContainer: {
    marginTop: 0,
    textAlign: 'center',
    paddingHorizontal: hp('5%'),
    paddingVertical: hp('1%'),
    borderRadius: 30,
    marginBottom: 10,
    // borderWidth: 1,
    // borderColor: colors.gray,
  },
  descText: {
    ...FONTS.body,
    fontSize: 16,
    textAlign: 'center',
  },
});
