import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AppBackground from '../components/AppBackground';
import firestore from '@react-native-firebase/firestore';
import {
  clockFromTimestamp,
  dateStringFromTimestamp,
  shortDateFromTimestamp,
} from '../backend/HelperFunctions';

import CalendarView from '../components/CalendarView';
import ClassList from '../components/ClassList';
import Icon from '../components/Icon';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {filterUserClasses} from '../backend/HelperFunctions';
import {FONTS} from '../contexts/Styles';
import {colors, simpleShadow} from '../contexts/Colors';
import CustomCapsule from '../components/CustomCapsule';
import GoBackButton from '../components/buttons/GoBackButton';
import CustomButton from '../components/CustomButton';
import PlusButton from '../components/buttons/PlusButton';
import User from '../backend/storage/User';
import Gym from '../backend/storage/Gym';
import ClassesCollection from '../backend/storage/ClassesCollection';
import CalendarSyncButton from '../components/buttons/CalendarSyncButton';

export default function ScheduleViewer(props) {
  const {classIds, gymId} = props.route.params;

  const [calendarData, setCalendarData] = useState(null);
  const [dataIsFormatted, setDataIsFormatted] = useState(false);
  const [gymClasses, setGymClasses] = useState([]);
  const [classData, setClassData] = useState([]);

  const [openDropdown, setOpenDropdown] = useState(false);
  const [btnSelection, setBtnSelection] = useState('createClass');

  const [slctdDate, setSlctdDate] = useState(
    dateStringFromTimestamp(Date.now()),
  );

  const [user, setUser] = useState(null);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const init = async () => {
        const user = new User();
        const fireUser = await user.retrieveUser();
        setUser(fireUser);

        const classes = new ClassesCollection();

        // Determine which classes to display:
        // based on the provided gymId or classIds
        // let classData
        if (classIds) {
          console.log(1111);

          classStuff = (await classes.retrieveWhere('id', 'in', classIds)).map(
            it => it.getFormatted(),
          );

          setCalendarData(classStuff);

          setTitle('My Classes');
        } else if (gymId) {
          console.log(2222);

          const gym = new Gym();
          const {name} = await gym.retrieveGym(gymId);

          //  get Gym's classes
          const getGymClasses = await firestore()
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
              setCalendarData(classes);
            });

          setTitle(name);
          setSubtitle('Schedule');
        } else {
          console.log(3333);

          const classStuff = (await user.retrieveScheduledClasses()).map(it => {
            let data = it.getFormatted();
            let activeDateForUser = [];
            data.active_times.forEach(time => {
              if (
                fireUser.active_classes.some(el => el.time_id === time.time_id)
              )
                activeDateForUser.push(time);
            });
            data.active_times = activeDateForUser;
            return data;
          });

          setCalendarData(classStuff);
          // if (user.accountType == 'user') classData = await filterUserClasses()

          setTitle('My Classes');
        }
        // setCalendarData(classData)
      };
      init();

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

  // useEffect(() => {
  //   const init = async () => {
  //     const user = new User()
  //     setUser(await user.retrieveUser())

  //     const classes = new ClassesCollection()

  //     // Determine which classes to display:
  //     // based on the provided gymId or classIds
  //     let classData
  //     if (classIds) {
  //       console.log(1111)

  //       classData = (await classes
  //         .retrieveWhere('id', 'in', classIds)
  //       ).map(it => it.getFormatted())

  //       setTitle('My Classes')

  //     } else if (gymId) {
  //       console.log(2222)

  //       const gym = new Gym()
  //       const {
  //         name,
  //       } = await gym.retrieveGym(gymId)

  //       console.log("gymId: ", gymId)

  //       classData = (await classes
  //         .retrieveWhere('gym_id', 'in', [ gymId ])
  //       ).map(it => it.getFormatted())

  //       console.log("classData: ", classData) // DEBUG

  //       setTitle(name)
  //       setSubtitle('Schedule')

  //     } else {
  //       console.log(3333)

  //       classData = ( await user.retrieveScheduledClasses() )
  //         .map(it => it.getFormatted())
  //       // if (user.accountType == 'user') classData = await filterUserClasses()

  //       console.log("classData", classData) // DEBUG

  //       setTitle('My Classes')
  //     }

  //     setCalendarData(classData)
  //   }; init()
  // }, [])

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
    if (!calendarData) return;
    // calendarData.forEach(({ active_times }) => {
    //   addFormattingToClassData(active_times)
    // })

    // addFunctionalityToClassData(calendarData, props.navigation)

    setCalendarData(calendarData);
    setDataIsFormatted(true);
  }, [calendarData]);

  if (!user || !dataIsFormatted) return <View />;

  return (
    <SafeAreaView
      style={{
        paddingTop: Platform.OS === 'android' ? 25 : 0,
        flex: 1,
        backgroundColor: colors.bg,
      }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        alwaysBounceVertical={false}>
        <AppBackground />

        <CustomCapsule
          containerStyle={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            paddingTop: 0,
            marginTop: 10,
            marginBottom: 0,
          }}
          innerContainerStyle={{
            paddingHorizontal: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}>
          <View
            style={{
              flexDirection: 'row',
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <GoBackButton
              containerStyle={{
                position: 'absolute',
                top: 0,
                left: 5,
              }}
              imageContainerStyle={{
                width: 48,
                height: 48,
              }}
            />
            <View
              style={{
                position: 'absolute',
              }}>
              <Text
                style={{
                  width: '100%',
                  textAlign: 'center',
                  marginBottom: 10,
                  ...FONTS.body,
                  fontSize: 20,
                }}>
                {title}
              </Text>
              {/* {subtitle ?
            <Text style={{
              width: "100%",
              ...FONTS.body,
              textAlign: "center",
              fontSize: 18,
              marginBottom: -10
            }}>{subtitle}</Text> : null} */}
            </View>

            {/* Calendar Sync Button */}
            {/* <View style={{
              position: "absolute",
              top: 0,
              right: 15,
            }}>
              <CalendarSyncButton
                calendarData={calendarData}
                type="allSync"
              />
           </View> */}
            {/*           
          {user.account_type === "partner" ?
            // {/* 
            //   <PlusButton
            //       containerStyle={{
            //         position: "absolute",
            //         right: 15,
            //       }}
            //       imageContainerStyle={{
            //         width: 48,
            //         height: 48,
            //       }}
            //       onPress={() => props.navigation.navigate(
            //         "SchedulePopulate")} 
            //   >
           : null} */}
          </View>
        </CustomCapsule>

        {user.account_type === 'partner' ? (
          <View style={styles.capsule}>
            <CustomButton
              style={{marginBottom: 0}}
              title="Create Class"
              onPress={() => props.navigation.navigate('PartnerCreateClass')}
            />
            <View style={{flex: 1, flexDirection: 'row', marginBottom: 10}}>
              <CustomButton
                style={{
                  marginBottom: 0,
                  marginRight: 5,
                  width: wp('47%'),
                  alignItems: 'stretch',
                }}
                title="Edit"
                onPress={() => props.navigation.navigate('PartnerEditClasses')}
              />
              <CustomButton
                style={{marginBottom: 0, marginLeftt: 5, width: wp('47%')}}
                title="Schedule"
                onPress={() => props.navigation.navigate('SchedulePopulate')}
              />
            </View>
          </View>
        ) : null}

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: '100%',
  },
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
    borderRadius: 25,
  },
  classListContainer: {
    marginTop: 10,
  },
  picker: {
    width: 110,
    height: 72,
    marginVertical: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    // borderColor: colors.gray,
    borderColor: colors.buttonFill,
    backgroundColor: '#333',
    color: '#f9f9f9',
  },
  pickerDropDown: {
    // ...simpleShadow,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  pickerItem: {
    paddingHorizontal: 20,
  },
  pickerLabel: {
    textAlign: 'center',
    color: '#f9f9f9',
  },
});
