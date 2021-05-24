import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import CustomButton from '../components/CustomButton';
// import CustomPopup from "../components/CustomPopup"
import MembershipApprovalBadge from '../components/MembershipApprovalBadge';
import MembershipApprovalBadgeImbue from '../components/MembershipApprovalBadgeImbue';
import ClassApprovalBadge from '../components/ClassApprovalBadge';
import { useFocusEffect } from '@react-navigation/native';

import GymLayout from '../layouts/GymLayout';
import { colors } from '../contexts/Colors';
import { FONTS } from '../contexts/Styles';
import CreditCardSelectionV2 from '../components/CreditCardSelectionV2';
import {
  classType,
  currencyFromZeroDecimal,
  representDatabaseField,
} from '../backend/HelperFunctions';
import User from '../backend/storage/User';
import Gym from '../backend/storage/Gym';
import Class from '../backend/storage/Class';
import config from '../../../App.config';
import { StackActions, useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import CalendarPopulateForm from '../components/CalendarPopulateForm';
import functions from '@react-native-firebase/functions';
import moment from 'moment';
import RNCalendarEvents from 'react-native-calendar-events';
import AppBackground from '../components/AppBackground';
import LottieView from 'lottie-react-native';
import useStore from '../store/RootStore';

export default function ClassDescription(props) {
  const { classId, timeId } = props.route.params;
  const navigation = useNavigation();

  const { userStore } = useStore();
  const [r, refresh] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // const [Title, TitleCreate] = useState(null)
  // const [Time, TimeCreate] = useState(null)
  // const [Desc, DescCreate] = useState(null)
  const [Content, ContentCreate] = useState(null);

  const [popup, setPopup] = useState(false);
  // const [PopupCCNotFound, PopupCCNotFoundCreate] = useState(null)

  const [hasMembership, setHasMembership] = useState(null);
  const [classHasPassed, setClassHasPassed] = useState();
  const [dob, setDob] = useState('');
  const { data: calendarData } = props

  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [gym, setGym] = useState(null);
  const [gymUid, setGymUid] = useState(null);
  const [classDoc, setClassDoc] = useState(null);
  const [priceType, setPriceType] = useState(null);
  const [editShow, setEditShow] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleDOB = () => {
    console.log('address (handDOB): ', address);
    {
      user.account_type == 'partner'
        ? updateSafeInfoForPartner()
        : updateSafeInfoForUser();
    }
  };

  useEffect(() => {
    if (!(calendarData instanceof Array)) return

    let filteredCalendarData = []
    if (props.dateString) {
      calendarData.forEach(doc => {
        let filteredData = { ...doc }
        filteredData.active_times = doc.active_times.filter(({ dateString }) => {
          return dateString === props.dateString
        })
        filteredCalendarData.push(filteredData)
      })
    } else filteredCalendarData = calendarData
    setClasses(filteredCalendarData)
  }, [calendarData, props.dateString])

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const init = async () => {
        const classObj = new Class();
        const classDoc = await classObj.retrieveClass(classId);
        const timeDoc = classDoc.active_times.filter(
          ({ time_id }) => time_id == timeId,
        )[0];
        setClassDoc({
          ...classDoc,
          ...timeDoc,
        });

        // Determine whether the class has passed, and, if it has, the variable
        // is going to be used to not show scheduling button
        const { begin_time } = timeDoc;
        setClassHasPassed(begin_time < Date.now());

        const { gym_id: classGymId } = classDoc;

        const user = new User();
        setUser(await user.retrieveUser());
        setUserId(user.uid);

        const gym = new Gym();
        setGym(await gym.retrieveGym(classGymId));
      };
      init();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

  useEffect(() => {
    const init = async () => {
      const classObj = new Class();
      const classDoc = await classObj.retrieveClass(classId);
      const timeDoc = classDoc.active_times.filter(
        ({ time_id }) => time_id == timeId,
      )[0];
      setClassDoc({
        ...classDoc,
        ...timeDoc,
      });

      // Determine whether the class has passed, and, if it has, the variable
      // is going to be used to not show scheduling button
      const { begin_time } = timeDoc;
      setClassHasPassed(begin_time < Date.now());

      const { gym_id: classGymId } = classDoc;

      const user = new User();
      setUser(await user.retrieveUser());
      console.log(await user.retrieveUser());
      const gym = new Gym();
      setGym(await gym.retrieveGym(classGymId));

      setGymUid(gym.uid);
    };
    init();
  }, [r]);

  function invalidate() {
    let redFields = [];
    if (dob.split('-').length != 3) redFields.push('dob');
  }

  let activeClassesCount = user
    ? user.active_classes
      ? user.active_classes.length
      : null
    : null;
  useEffect(() => {
    if (!gym) return;
    if (!user) return;
    if (!classDoc) return;
    if (user.account_type != 'user') {
      setHasMembership(true);
      return;
    }

    setPriceType(classDoc.priceType);

    const init = async () => {
      const imbue = new Gym();

      const { id: imbueId } = await imbue.retrieveGym('imbue');

      let activeTimeIds = user.active_classes.map((active) => active.time_id);

      let hasMembership = user.active_memberships.includes(imbueId)
        ? 'imbue'
        : user.active_memberships.includes(gym.id)
          ? 'gym'
          : activeTimeIds.includes(timeId)
            ? 'class'
            : false;

      setHasMembership(hasMembership);
    };
    init();
  }, [activeClassesCount, gym, classDoc, popup]);

  useEffect(() => {
    if (!classDoc) return;
    if (hasMembership === null) return;

    const Bar = (
      <View
        style={{
          width: '88%',
          height: 1,
          alignSelf: 'center',
          borderBottomWidth: 1,
          borderColor: `${colors.gray}40`,
        }}
      />
    );

    ContentCreate(
      <View style={styles.contentContainer}>
        <Text style={styles.nameText}>{classDoc.name}</Text>
        <Text style={styles.instructorText}>{classDoc.instructor}</Text>

        {Bar}

        <Text style={styles.timeText}>
          {classDoc.formattedDate}
          {'\n'}
          {classDoc.formattedTime}
          {'\n'}
          {classType(classDoc.type)}
        </Text>

        {Bar}

        <View style={styles.descContainer}>
          <Text style={styles.descText}>{classDoc.description}</Text>

          {/* {hasMembership
            ? null
            : <Text style={{
              ...styles.descText,
              alignSelf: "flex-end",
            }}>
              {`$${currencyFromZeroDecimal(classDoc.price)}`}
            </Text>} */}
        </View>
      </View>,
    );

    // PopupCCNotFoundCreate(
    //   <CustomPopup
    //     containerStyle={{
    //       padding: 0,
    //     }}
    //     onX={() => setPopup(false)}
    //   >
    //     <View style={{
    //       flexDirection: "row",
    //       marginHorizontal: 20,
    //     }}>
    //       <CustomButton
    //         style={{
    //           flex: 1,
    //           marginRight: 10,
    //         }}
    //         title="Yes"
    //         onPress={() => {
    //           setPopup(false)
    //           props.navigation.navigate("AddPaymentMethod")
    //         }}
    //       />
    //       <CustomButton
    //         style={{
    //           flex: 1,
    //           marginLeft: 10,
    //         }}
    //         title="Cancel"
    //         onPress={() => setPopup(false)}
    //       />
    //     </View>
    //   </CustomPopup>
    // )
  }, [classDoc, hasMembership]);

  if (!gym || !user || !classDoc || classHasPassed === undefined)
    return <View />;

  // helper variable
  const classIsAddedToCalendar =
    user.account_type == 'user'
      ? user.scheduled_classes.map((it) => it.time_id).includes(timeId)
      : null;

  function getGoToLivestreamButton() {
    let options = {
      show: false,
      state: 'normal',
    };
    if (classDoc.livestreamState === 'live') {
      options.show = true;
    }
    if (classDoc.livestreamState === 'soon') {
      options.show = true;
      options.state = 'inactive';
    }
    return options;
  }

  async function removeClass() {
    let newTimes = [];
    // get attendees count
    await firestore()
      .collection('classes')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          if (documentSnapshot.data().id == classId) {
            // map through active times
            documentSnapshot.data().active_times.forEach((clss) => {
              // find relevant time, don't add back to lis
              if (clss.time_id == timeId) {
              } else {
                newTimes.push(clss);
              }
            });
          }
        });
      });

    // push updated times to firebase
    firestore().collection('classes').doc(classId).update({
      active_times: newTimes,
    });

    setSuccessMsg('Successfully removed class.');

    // go back
    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flex: 1 }}
      backgroundColor={'fffffff'}>
      <AppBackground></AppBackground>
      <View
        style={{
          backgroundColor: 'ffffff',
        }}>
        <GymLayout
          containerStyle={styles.container}
          innerContainerStyle={styles.innerContainerStyle}
          data={gym}
          classData={(classId, timeId)}
          classDoc={classDoc}
          buttonOptions={{
            goToLivestream: getGoToLivestreamButton(),
            // addToCalendar: {
            //   show: hasMembership && user.account_type == 'user' && !classHasPassed,
            //   state: classIsAddedToCalendar ? 'fulfilled' : 'opportunity',
            //   onPress: async () => {
            //     const {
            //       id: classId,
            //       time_id: timeId,
            //     } = classDoc

            //     const user = new User()
            //     try {
            //       await user.scheduleClass({ classId, timeId })
            //     } catch(error) {
            //       if (config.DEBUG) console.error(error)
            //       if (error.code == 'insufficient_fields') {
            //         let additionalFields = error.context
            //           .map(representDatabaseField).join(', ')
            //         Alert.alert(
            //           'Information Request',
            //           `At the request of the owner of this class, you must be`
            //           + `providing additional information: ${additionalFields}.`,
            //           [
            //             {
            //               text: 'Add Now',
            //               onPress: () => {
            //                 navigation.dispatch(StackActions.push('ProfileSettings'))
            //               },
            //             },
            //             {
            //               text: 'Cancel',
            //               style: 'cancel',
            //             },
            //           ],
            //           { cancelable: true },
            //         )
            //       } else {
            //         Alert.alert('Action was not possible at this time.')
            //       }
            //     }

            //     refresh(r + 1)
            //   }
            // },
            // removeFromCalendar: {
            //   onPress: async () => {
            //     const { id: classId, time_id: timeId } = classDoc

            //     const user = new User()
            //     await user.unscheduleClass({ classId, timeId })

            //     refresh(r + 1)
            //   },
            // },
            viewAttendees: {
              show: user.account_type === 'partner' ? true : false,
              data: {
                classId: classId,
                timeId: timeId,
              },
            },
            goToCalendar: { show: false },
          }}>
          {Content}

          {errorMsg ? (
            <Text style={{ color: 'red', textAlign: 'center' }}>
              {errorMsg}
            </Text>
          ) : null}
          {successMsg ? (
            <Text style={{ color: 'green', textAlign: 'center' }}>
              {successMsg}
            </Text>
          ) : null}

          {user.account_type !== 'user' ? null : (
            <View>
              {/* if null, it means it hasn't been initialized yet. */}
              {hasMembership === null ? (
                <View />
              ) : hasMembership && user.dob ? null : (
                <>
                  {popup === 'buy' ? (
                    <CreditCardSelectionV2
                      containerStyle={styles.cardSelectionContainer}
                      price={
                        <Text>{`$${currencyFromZeroDecimal(
                          classDoc.price,
                        )}`}</Text>
                      }
                      title={
                        <Text>
                          {`Confirm payment for ${gym.name}, ${classDoc.name} — `}
                          <Text
                            style={{
                              textDecorationLine: 'underline',
                            }}>
                            One Time Online Class
                          </Text>
                        </Text>
                      }
                      onX={() => setPopup(null)}
                      onCardSelect={async (paymentMethodId) => {
                        try {
                          setErrorMsg('');
                          setSuccessMsg('');

                          const { id: classId, time_id: timeId } = classDoc;

                          const user = new User();
                          await user.purchaseClass({
                            paymentMethodId,
                            classId,
                            timeId,
                          });

                          refresh(r + 1);
                          userStore.getUserClasses();
                          navigation.navigate('SuccessScreen', {
                            successMessageType: 'UserPurchasedClass',
                          });
                        } catch (err) {
                          console.log(err);
                          if (config.DEBUG) console.error(err.message); // DEBUG
                          switch (err.code) {
                            case 'busy':
                              setErrorMsg(err.message);
                              break;
                            case 'class-already-bought':
                              setSuccessMsg(err.message);
                              break;
                            default:
                              setErrorMsg('Something prevented the action.');
                              break;
                          }
                        }
                      }}
                    />
                  ) : priceType === 'paid' && user.dob && classDoc.livestreamState !== 'passed' ? (
                    <>
                      <CustomButton
                        style={{
                          marginBottom: 0,
                        }}
                        title="Book"
                        onPress={() => {
                          setPopup('buy');
                        }}
                      />
                    </>
                  ) : priceType === 'paid' && !user.dob ? (
                    <>
                      <View>
                        <Text
                          style={{
                            marginTop: 5,
                            ...FONTS.body,
                            fontSize: 12,
                            textAlign: 'center',
                          }}>
                          You must enter your Date of birth before you can book
                          a class
                        </Text>
                        <Text
                          style={{
                            ...FONTS.body,
                            fontSize: 8,
                            textAlign: 'center',
                          }}>
                          Your birhday is needed for stripe, our payment
                          processor
                        </Text>
                      </View>

                      <CustomButton
                        style={styles.button}
                        title="Enter Date of Birth"
                        onPress={() => navigation.navigate('ProfileSettings')}
                      />
                    </>
                  ) : (
                    <View>
                      {classDoc.livestreamState == 'passed' ? (
                        <View>
                        </View>
                      ) : (
                        <>
                          { buttonDisabled ? (
                            <View style={{ alignItems: 'center' }} >
                              <LottieView
                                source={require('../components/img/animations/cat-loading.json')}
                                style={{ height: 100, width: 100 }}
                                autoPlay
                                loop
                              />
                            </View>
                          ) : (
                            <CustomButton
                              style={{
                                marginBottom: 0,
                              }}
                              title="Add to Calendar"
                              onPress={async () => {
                                setButtonDisabled(true);
                                console.log('test');
                                // enable after 10 second

                                if (buttonDisabled != true) {
                                  try {
                                    setErrorMsg('');
                                    setSuccessMsg('');

                                    const {
                                      id: classId,
                                      time_id: timeId,
                                    } = classDoc;

                                    // add class to user's native calendar
                                    console.log('classDoc: ', classDoc);

                                    let beg_time = classDoc.begin_time;
                                    let end_time = classDoc.end_time;

                                    // Get event ID from firestore
                                    const updatedClass = await firestore()
                                      .collection('classes')
                                      .doc(classDoc.id)
                                      .get();

                                    let calendarId = updatedClass.data().calendarId;

                                    // Take care of duplicate entries
                                    if (calendarId) {
                                      RNCalendarEvents.removeEvent(calendarId);
                                    }

                                    // add to calendar
                                    await RNCalendarEvents.requestPermissions();
                                    let response = await RNCalendarEvents.saveEvent(
                                      classDoc.name + ' Imbue Class',
                                      {
                                        startDate: beg_time,
                                        endDate: end_time,
                                        notes:
                                          'Open the Imbue app at class time to join',
                                      },
                                    );

                                    // update firestore
                                    firestore()
                                      .collection('classes')
                                      .doc(classDoc.id)
                                      .update({
                                        calendarId: response,
                                      });
                                    ///// end add class to user's native calendar

                                    const user = new User();
                                    await user.addClassToCalender({
                                      classId,
                                      timeId,
                                    });

                                    // sendGrid somebody joined your class
                                    try {
                                      // initiate SendGrid email
                                      console.log(
                                        'sendGridMemberPurchasedClass???',
                                      );
                                      console.log('gymUid: ', gymUid);
                                      const sendGridMemberPurchasedClass = functions().httpsCallable(
                                        'sendGridMemberPurchasedClass',
                                      );
                                      await sendGridMemberPurchasedClass(gymUid);
                                    } catch (err) {
                                      setErrorMsg('Email could not be sent');
                                    }

                                    // sendGrid you joined a class
                                    try {
                                      console.log('IDDDD: ', userId);

                                      // initiate SendGrid email
                                      console.log('user.id: ', userId);
                                      const sendGridMemberAddedClass = functions().httpsCallable(
                                        'sendGridMemberAddedClass',
                                      );
                                      await sendGridMemberAddedClass(userId);
                                    } catch (err) {
                                      setErrorMsg('Email could not be sent');
                                    }
                                    userStore.getUserClasses();
                                    refresh(r + 1);
                                  } catch (err) {
                                    console.log(err);
                                    switch (err.code) {
                                      case 'busy':
                                        setErrorMsg(err.message);
                                        break;
                                      case 'class-already-added':
                                        setSuccessMsg(err.message);
                                        break;
                                      default:
                                        setErrorMsg(
                                          'Something prevented the action.',
                                        );
                                        break;
                                    }
                                  } finally {
                                    setButtonDisabled(false);
                                  }
                                }
                              }}
                            />
                          )}
                        </>
                      )}
                    </View>
                  )}
                </>
              )}

              {hasMembership !== 'imbue' ? null : (
                <MembershipApprovalBadgeImbue
                  containerStyle={{
                    marginTop: 10,
                  }}
                  data={gym}
                />
              )}
              {hasMembership !== 'gym' ? null : (
                <>
                  {classDoc.livestreamState == 'passed' ? (
                    <View>
                    </View>
                  ) : (
                    <View>
                      <CustomButton
                        style={{
                          marginBottom: 0,
                        }}
                        title="Join Class"
                        onPress={() => {
                          const pushAction = StackActions.push('LivestreamWaitScreen', {
                            gymId: gym.id,
                            classDoc: classDoc,
                          });
                          navigation.dispatch(pushAction);
                          // getGoToLivestreamButton()
                        }}
                      />
                      <MembershipApprovalBadge
                        containerStyle={{
                          marginTop: 10,
                        }}
                        data={gym}
                      />
                    </View>
                  )}
                </>
              )}
              {hasMembership !== 'class' ? null : (
                <>
                  {classDoc.livestreamState == 'passed' ? (
                    <View/>
                  ) : (
                    <View>
                      <CustomButton
                        style={{
                          marginBottom: 0,
                        }}
                        title="Join"
                        onPress={() => {
                          const pushAction = StackActions.push(
                            'LivestreamWaitScreen',
                            { gymId: gym.id, classDoc: classDoc },
                          );
                          navigation.dispatch(pushAction);
                          // getGoToLivestreamButton()
                        }}
                      />
                      <ClassApprovalBadge
                        containerStyle={{
                          marginTop: 10,
                        }}
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          )}

          {/* pop Edit class time and date */}
          {editShow == true ? (
            <View
              style={{
                backgroundColor: 'ffffff',
              }}>
              <CalendarPopulateForm
                isEdit
                classId={classId}
                timeId={timeId}
                classDoc={classDoc}
                containerStyle={{
                  paddingRight: 15,
                  paddingLeft: 15,
                  // backgroundColor: "red",
                }}
              />
            </View>
          ) : null}

          {user.account_type == 'partner' ? (
            <>
              <View
                style={{
                  backgroundColor: 'ffffff',
                }}>
                <CustomButton
                  title="Go Live"
                  style={styles.customButtonContainer}
                  onPress={() => {
                    props.navigation.navigate('PreLiveChecklist', {
                      classId: classDoc.id,
                      timeId: classDoc.time_id,
                    });
                  }}
                />
                {/* Edit Class */}
                <TouchableOpacity onPress={() => setEditShow(!editShow)}>
                  <Text
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      marginTop: hp('2%'),
                      marginBottom: hp('1%'),
                      color: colors.darkButtonText,
                      ...FONTS.body,
                      fontSize: 10,
                    }}>
                    Edit
                  </Text>
                </TouchableOpacity>

                {/* Delete Class  */}
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Are you sure you wish to delete this class',
                      'All instances of this class will be removed from your schedule',
                      [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        { text: 'Yes', onPress: () => removeClass() },
                      ],
                      { cancelable: false },
                    )
                  }>
                  <Text
                    style={{
                      width: '100%',
                      textAlign: 'center',
                      marginTop: hp('1%'),
                      color: colors.darkButtonText,
                      ...FONTS.body,
                      fontSize: 10,
                    }}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : null}

          {Object.keys(user).length === 0 ? (
            classDoc.priceType === 'free' ? (
              <TouchableHighlight
                style={styles.buttonContainer}
                onPress={() =>
                  navigation.navigate('RegisterWithBuy', {
                    step: 'user',
                    classData: classDoc,
                  })
                }>
                <Text style={styles.buttonText}>Reserve One Time Class</Text>
              </TouchableHighlight>
            ) : (
              <TouchableHighlight
                style={styles.buttonContainer}
                onPress={() =>
                  navigation.navigate('RegisterWithBuy', {
                    step: 'card',
                    classData: classDoc,
                  })
                }>
                <Text style={styles.buttonText}>Buy One Time Class</Text>
              </TouchableHighlight>
            )
          ) : null}
        </GymLayout>
      </View>
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  container: {},
  innerContainerStyle: {
    paddingBottom: 10,
  },
  cardSelectionContainer: {
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 30,
  },
  contentContainer: {
    marginTop: 20,
  },
  buttonContainer: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderRadius: 99,
  },
  buttonText: {
    ...FONTS.title,
    textAlign: 'center',
    color: 'white',
  },
  // nameContainer: {
  //   marginTop: 20,
  //   borderRadius: 40,
  //   borderWidth: 1,
  //   borderColor: colors.gray,
  // },
  nameText: {
    ...FONTS.title,
    textAlign: 'center',
    fontSize: 27,
  },
  instructorText: {
    ...FONTS.subtitle,
    textAlign: 'center',
    fontSize: 22,
  },
  // timeContainer: {
  //   marginTop: 20,
  //   marginRight: 5,
  //   paddingHorizontal: 10,
  //   paddingVertical: 5,
  //   borderRadius: 40,
  //   borderWidth: 1,
  //   borderColor: colors.gray,
  // },
  timeText: {
    ...FONTS.subtitle,
    fontSize: 18,
    textAlign: 'center',
  },
  customButtonContainer: {
    width: '50%',
    alignSelf: 'center',
  },
  descContainer: {
    // marginTop: 10,
    // paddingHorizontal: 15,
    width: '88%',
    alignSelf: 'center',
    paddingVertical: 10,
    // borderRadius: 40,
    // borderWidth: 1,
    // borderColor: colors.gray,
  },
  descText: {
    ...FONTS.body,
    fontSize: 8,
    textAlign: 'center',
  },
});
