import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  RefreshControl,
  Text,
  ScrollView,
} from 'react-native';

import ProfileLayout from '../layouts/ProfileLayout';
import CustomButton from '../components/CustomButton';
import Icon from '../components/Icon';
import CustomText from '../components/CustomText';
import {
  clockFromTimestamp,
  dateStringFromTimestamp,
  shortDateFromTimestamp,
} from '../backend/HelperFunctions';
import User from '../backend/storage/User';
import {FONTS} from '../contexts/Styles';
import {currencyFromZeroDecimal} from '../backend/HelperFunctions';
import PlaidButton from '../components/PlaidButton';
import BankAccountFormWithButtonEntry from '../components/BankAccountFormWithButtonEntry';
import config from '../../../App.config';
import {useNavigation, useRoute} from '@react-navigation/native';
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import Gym from '../backend/storage/Gym';
import CalendarView from '../components/CalendarView';
import ClassList from '../components/ClassList';
import {colors} from '../contexts/Colors';
import LottieView from 'lottie-react-native';

export default function PartnerDashboard(props) {
  const [user, setUser] = useState(null);
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasBankAccountAdded, setHasBankAccountAdded] = useState();
  const [calendarData, setCalendarData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);
  const [slctdDate, setSlctdDate] = useState(
    dateStringFromTimestamp(Date.now()),
  );
  const [r, refresh] = useState(0);

  useEffect(() => {
    async function init() {
      const user = new User();
      const userDoc = await user.retrieveUser();
      const gym = (await user.retrievePartnerGyms()).map((it) =>
        it.getAll(),
      )[0];
      setUser(userDoc);
      setGym(gym);
      setHasBankAccountAdded(Boolean(userDoc.stripe_bank_account_id));
      // setHasBankAccountAdded(true)

      console.log('user (useEffect): ', user);

      // update Stripe balance revenue
      if (gym) {
        const updateStripeAccountRevenue = functions().httpsCallable(
          'updateStripeAccountRevenue',
        );
        await updateStripeAccountRevenue(gym.id);
      }
    }
    init();
  }, []);

  useEffect(() => {
    async function takeCalendarData() {
      setLoading(true);
      if (user.associated_gyms.length !== 0) {
        console.log('test');
        const gymId = user.associated_gyms[0];

        await firestore()
          .collection('classes')
          .get()
          .then((querySnapshot) => {
            const classes = [];

            querySnapshot.forEach((documentSnapshot) => {
              if (documentSnapshot.data().gym_id == gymId) {
                let formatted = getFormatted(documentSnapshot.data());
                classes.push({
                  ...formatted,
                });
              }
            });
            setCalendarData(classes);
            setLoading(false);
          });
      }
    }
    takeCalendarData();
  }, [user, r]);

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  function getFormatted(classItem) {
    const processedClass = classItem; // avoid affecting cache
    processedClass.active_times = processedClass.active_times.map(
      (timeDoc) => ({...timeDoc}),
    ); // avoid affecting cache
    const {active_times} = processedClass;
    const currentTs = Date.now();
    let additionalFields;

    active_times.forEach((timeDoc) => {
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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const user = new User();
    const userDoc = await user.retrieveUser();
    const gym = (await user.retrievePartnerGyms()).map((it) => it.getAll())[0];

    const newUser = await firestore()
      .collection('partners')
      .doc(gym.partner_id)
      .get();
    setUser(newUser.data());
    wait(2000).then(() => setRefreshing(false));
  }, []);

  if (!user || !gym || hasBankAccountAdded === undefined) return <View />;

  const toggleStream = async () => {
    console.log('pressed');
    const stream = cache('streamRef').get();
    const isStreaming = cache('isStreaming').get();

    if (isStreaming) {
      stream.stop();
      cache('isStreaming').set(false);
      return;
    }

    const partnerObj = new User();
    await partnerObj.createLivestream({gymId}); // Will not create livestream, if it already has been
    const {stream_key} = await partnerObj.retrieveUser();
    console.log('stream_key: ' + stream_key);
    setStreamKey(stream_key);

    stream.start();
    cache('isStreaming').set(true);
  };

  return (
    <ProfileLayout
      innerContainerStyle={{
        padding: 10,
      }}
      hideBackButton={true}
      buttonOptions={{
        logOut: {
          show: true,
        },
      }}>
      {/* Current Balance */}
      <View style={{flex: 1, flexDirection: 'row'}}>
        <CustomText
          style={styles.text}
          containerStyle={styles.textContainer}
          label="Current Balance">
          {`$${currencyFromZeroDecimal(user.revenue)}`}
        </CustomText>

        {/* Total Earnings */}
        <CustomText
          style={styles.text}
          containerStyle={styles.textContainer}
          label="Total Earnings">
          {`$${currencyFromZeroDecimal(user.total_revenue)}`}
        </CustomText>
      </View>
      {loading ? (
        <View style={{alignItems: 'center', flex: 1}}>
          <LottieView
            source={require('../components/img/animations/cat-loading.json')}
            style={{height: 100, width: 100}}
            autoPlay
            loop
          />
        </View>
      ) : (
        <>
          <View style={styles.capsule}>
            <CustomButton
              style={{marginBottom: 0}}
              title="Create Class"
              onPress={() => props.navigation.navigate('PartnerCreateClass')}
            />
            <CustomButton
              style={{marginBottom: 20}}
              title="Schedule"
              onPress={() => props.navigation.navigate('SchedulePopulate')}
            />
          </View>
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
        </>
      )}
      {/* <CustomText
          style={styles.text}
          containerStyle={styles.textContainer}
          label="Member Count"
        >
          ?
        </CustomText> */}

      {/* <CustomButton
        icon={
          <Icon
            source={require("../components/img/png/livestream.png")}
          />
        }
        title="Go Live"
        onPress={() => {
          props.navigation.navigate('PreLiveChecklist');

          toggleStream,
          props.navigation.navigate(
            "GoLive",
          )
        }}
      /> */}
      {/* <CustomButton
        icon={
          <Icon
            source={require("../components/img/png/my-classes-2.png")}
          />
        }
        title="Create Class"
        onPress={() => props.navigation.navigate(
          "PartnerUpdateClasses"
        )}
      /> */}
      {/* <CustomButton
        title="Livestream Settings"
        onPress={() => {props.navigation.navigate(
            "PartnerLivestreamDashboard")}}
      /> */}
      {/* <CustomButton
        title="Classes"
        onPress={() => {
          props.navigation.navigate('ScheduleViewer', {
            gymId: user.associated_gyms[0],
          });
        }}
      /> */}
      {/* <CustomButton
        title='Revenue 💰'
        onPress={() => props.navigation.navigate(
          "PartnerRevenueInfo"
        )}
        /> */}
      {/* <CustomButton
        icon={
          <Icon
            source={require("../components/img/png/profile.png")}
          />
        }
        title="Edit Profile"
        onPress={() => props.navigation.navigate('ProfileSettings')}
      /> */}
      {/* <CustomButton
        icon={
          <Icon
            source={require("../components/img/png/gym-settings.png")}
          />
        }
        title="Manage Gym"
        onPress={() => { 
          props.navigation.navigate(
            "PartnerGymSettings")
        }}
      /> */}
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  capsule: {
    paddingRight: 10,
    paddingLeft: 10,
  },
  innerCapsule: {
    width: '100%',
    marginBottom: 50,
    paddingBottom: 10,
    alignSelf: 'center',
    // backgroundColor: "#FFFFFF80",
    backgroundColor: '#00000040',
    // borderWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.gray,
    borderRadius: 40,
  },
  classListContainer: {
    marginTop: 10,
  },
  text: {
    paddingVertical: 8,
    alignSelf: 'center',
    fontSize: 22,
  },
  textContainer: {
    marginVertical: 10,
    marginStart: 5,
    marginEnd: 5,
  },
  miniText: {
    ...config.styles.body,
    fontSize: 12,
    textAlign: 'justify',
  },
  confirmation: {
    ...config.styles.body,
    color: 'green',
    textAlign: 'center',
    paddingBottom: 10,
  },
  error: {
    ...config.styles.body,
    color: 'red',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  logOutButtonContainer: {
    width: 64,
    height: 64,
    marginTop: 10,
    marginRight: 10,
    position: 'absolute',
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 999,
    zIndex: 110,
  },
});
