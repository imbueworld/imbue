import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, AppState} from 'react-native';
import DateSelector from './DateSelector';
import ClockInput from './ClockInput';
// import ClockInputDismissOverlay from './ClockInputDismissOverlay'
import CustomButton from './CustomButton';
import CustomDropDownPicker from './CustomDropDownPicker';
import {colors} from '../contexts/Colors';
import {getRandomId} from '../backend/HelperFunctions';
import User from '../backend/storage/User';
import Class from '../backend/storage/Class';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import functions from '@react-native-firebase/functions';
import LottieView from 'lottie-react-native';
import useStore from '../store/RootStore';
import {ClockInputV2} from './ClockInputV2';

export default function CalendarPopulateForm(props) {
  const {partnerStore} = useStore();
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [redFields, setRedFields] = useState([]);
  const [edit, setEdit] = useState(false);
  const [classDoc, setClassDoc] = useState(null);

  // const [forceCloseClock, setForceCloseClock] = useState(false)
  // const [dismissOverlay, setDismissOveraly] = useState(true)

  const [dropDownClasses, setDropDownClasses] = useState(null);

  const [beginClock, setBeginClock] = useState([`00`, `00`]);
  const [endClock, setEndClock] = useState([0, 0]);
  const [dateStringList, setDateStringList] = useState([]);

  const [class_id, setClassId] = useState(null);
  const [timeId, setTimeId] = useState(null);
  const [user, setUser] = useState(null);
  const [gymId, setGymId] = useState(null);

  let navigation = useNavigation();

  // const [active_times, setActiveTimes] = useState(null)

  useEffect(() => {
    const init = async () => {
      const user = new User();
      setUser(await user.retrieveUser());
      // setGymId(await user.retrieveUser().associated_gyms[0])

      const classes = await user.retrieveClasses();

      setEdit(props.isEdit);
      setClassId(props.classId);
      setTimeId(props.timeId);

      let dropDownClasses = classes
        .map((entity) => {
          entity = entity.getAll();
          // Leave out mindbody integration classes; refer to comment way below
          if (entity.mindbody_integration) return;
          return {label: entity.name, value: entity.id};
        })
        .filter(Boolean);
      setDropDownClasses(dropDownClasses);

      setInitialized(true);
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      setGymId(user ? user.associated_gyms[0]: null);
    };
    init();
  }, [user]);

  // remove current time when they press apply
  async function cleanUpClassTime() {
    // create list of updated class times
    let newTimes = [];
    // get attendees count
    await firestore()
      .collection('classes')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          if (documentSnapshot.data().id == class_id) {
            // map through active times
            documentSnapshot.data().active_times.forEach((clss) => {
              // find relevant time, don't add back to list
              if (clss.time_id == timeId) {
                console.log('same: ', clss.time_id);
              } else {
                newTimes.push(clss);
              }
            });
          }
        });
      });
    console.log('newTimes: ', newTimes);
    // update active_times in firebase
    await firestore().collection('classes').doc(class_id).update({
      active_times: newTimes,
    });
  }

  function validate() {
    if (!class_id) {
      setRedFields(['class']);
      throw new Error('A class must be selected.');
    }
    console.log(dateStringList);
    if (!dateStringList.length) {
      setRedFields(['calendar']);
      throw new Error('A date for the class must be selected');
    }

    if (dateStringList.length > 50) {
      setRedFields(['calendar']);
      throw new Error('Currently we allow adding only 50 classes at once.');
    }

    // Date must be in the future
    dateStringList.forEach((dateString) => {
      let bH = beginClock[0] * 3600000; // hours ===> milliseconds
      let bM = beginClock[1] * 60000; // minutes ===> milliseconds

      const dateObj = new Date(dateString);
      const dateTsLocal =
        dateObj.getTime() +
        dateObj.getTimezoneOffset() * 60 * 1000 + // minutes ===> milliseconds
        bH +
        bM;

      if (dateTsLocal < Date.now()) {
        setRedFields(['calendar', 'beginClock']);
        throw new Error('The class date and time must be in the future.');
      }
    });

    let bH = beginClock[0] * 60; // hours ===> minutes
    let bM = beginClock[1];
    let eH = endClock[0] * 60; // hours ===> minutes
    let eM = endClock[1];
    // beginning time of class must be before the end of class
    if (bH + bM > eH + eM) {
      setRedFields(['beginClock', 'endClock']);
      throw new Error('Class starting time must be before its end time.');
    }
    // Classes must last at least 1 minute
    if (eH + eM - (bH + bM) < 1) {
      setRedFields(['beginClock', 'endClock']);
      throw new Error('A class must last at least 1 minute.');
    }
  }

  function format() {
    let bH = beginClock[0] * 3600000; // hours ===> milliseconds
    let bM = beginClock[1] * 60000; // minutes ===> milliseconds
    let eH = endClock[0] * 3600000; // hours ===> milliseconds
    let eM = endClock[1] * 60000; // minutes ===> milliseconds

    let activeTimes = [];
    dateStringList.forEach((dateString) => {
      const dateObj = new Date(dateString);
      const dateTsLocal =
        dateObj.getTime() + dateObj.getTimezoneOffset() * 60 * 1000; // minutes ===> milliseconds
      activeTimes.push({
        time_id: getRandomId(),
        begin_time: dateTsLocal + bH + bM,
        end_time: dateTsLocal + eH + eM, //initialize at 0
        attendees: 0,
      });
    });
    // setActiveTimes(activeTimes)
    return activeTimes;
  }

  if (!initialized) return <View />;

  return (
    <>
      {/* This right down below is probably a bad idea; too irresponsive and in the way */}
      {/* {dismissOverlay ?
    <ClockInputDismissOverlay
      onPress={() => {
        setForceCloseClock(true)
        setForceCloseClock(false)
        setDismissOveraly(false)
      }}
    /> : null} */}

      <View style={{...props.containerStyle}}>
        <View style={styles.layoutMargin}>
          {errorMsg ? (
            <Text style={{color: 'red', textAlign: 'center'}}>{errorMsg}</Text>
          ) : (
            <Text style={{color: 'green', textAlign: 'center'}}>
              {successMsg}
            </Text>
          )}
        </View>

        {loading ? (
          <View style={{alignItems: 'center'}}>
            <LottieView
              source={require('../components/img/animations/cat-loading.json')}
              style={{height: 100, width: 100}}
              autoPlay
              loop
            />
          </View>
        ) : (
          <>
            {edit != true ? (
              <CustomDropDownPicker
                containerStyle={{
                  ...styles.dropDownPickerContainerStyle,
                  ...styles.layoutMargin,
                }}
                style={{
                  ...styles.dropDownPicker,
                  borderColor: redFields.includes('class') ? 'red' : undefined,
                }}
                items={dropDownClasses}
                placeholder="Select your class"
                onChangeItem={(item) => {
                  console.log(item.value);
                  setClassId(item.value);
                }}
              />
            ) : null}
            <DateSelector
              containerStyle={{
                ...styles.calendarContainerStyle,
                borderColor: redFields.includes('calendar') ? 'red' : undefined,
              }}
              innerContainerStyle={styles.calendarInnerContainerStyle}
              onDayPress={(dates) => {
                setDateStringList(dates);
              }}
            />
            <View style={styles.layoutMargin}>
              <ClockInputV2
                containerStyle={{marginTop: 20}}
                value={beginClock}
                onChangeText={(h, m) => {
                  setBeginClock([h, m]);
                }}
              />
              <ClockInputV2
                containerStyle={{marginTop: 20}}
                value={beginClock}
                onChangeText={(h, m) => {
                  setEndClock([h, m]);
                }}
              />

              <CustomButton
                style={{marginTop: 20}}
                title="Schedule"
                onPress={async () => {
                  setLoading(true);
                  setRedFields([]);
                  setErrorMsg('');
                  setSuccessMsg('');

                  const classObj = new Class();
                  await classObj.initByUid(class_id);

                  // Do not allow the spawning of more class entities that have come
                  // from Mindbody Integration.
                  // Why? Because those classes are meant to have only one active_time,
                  // it's just how they are managed. As well as, Mindbody classes should
                  // only be managed from Mindbody console or such.
                  if (classObj.getAll().mindbody_integration) {
                    setErrorMsg(
                      "You mustn't populate a class that has been integrated through Mindbody.",
                    );
                    return;
                  }

                  try {
                    validate();
                    let active_times = format();

                    {
                      edit == true ? await cleanUpClassTime() : null;
                    }

                    await classObj.populate({
                      activeTimes: active_times,
                      classId: class_id,
                      timeId: timeId,
                    });

                    // SendGrid Scheduled Class
                    try {
                      // initiate SendGrid email
                      console.log('gymId: ', gymId);
                      const sendGridScheduledClass = functions().httpsCallable(
                        'sendGridScheduledClass',
                      );
                      await sendGridScheduledClass(gymId);
                    } catch (err) {
                      setErrorMsg('Email could not be sent');
                    }

                    setSuccessMsg('Successfully scheduled class!');
                    navigation.navigate('SuccessScreen', {
                      successMessageType: 'ClassScheduled',
                    });
                    // navigate after successful class creation
                    setTimeout(() => {
                      navigation.navigate('PartnerDashboard');
                    }, 3000);
                  } catch (err) {
                    setErrorMsg(err.message);
                  } finally {
                    partnerStore.getPartnerData();
                    setLoading(false);
                  }
                }}
              />
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  layoutMargin: {
    width: '88%',
    alignSelf: 'center',
  },
  calendarContainerStyle: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    // borderColor: colors.gray,
    borderColor: colors.buttonFill,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  calendarInnerContainerStyle: {},
  dropDownPickerContainerStyle: {
    marginTop: 20,
  },
  dropDownPicker: {
    marginTop: 0,
    marginBottom: 0,
  },
  clockInput: {
    marginTop: 20,
    backgroundColor: undefined,
    borderWidth: 1,
    // borderColor: colors.gray,
    borderColor: colors.buttonFill,
    borderRadius: 30,
    overflow: 'hidden',
  },
});
