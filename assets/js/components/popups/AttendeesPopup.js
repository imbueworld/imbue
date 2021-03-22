import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import CustomPopup from '../CustomPopup';
import {publicStorage} from '../../backend/BackendFunctions';
import {FONTS} from '../../contexts/Styles';
import {ScrollView} from 'react-native-gesture-handler';
import AttendeeCard from '../AttendeeCard';
import {colors} from '../../contexts/Colors';
import Class from '../../backend/storage/Class';
import firestore from '@react-native-firebase/firestore';

export default function AttendeesPopup(props) {
  const {classId, timeId} = props;

  if (!classId || !timeId)
    throw new Error('classId and timeId both need to be provided.');

  const [attendees, setAttendees] = useState(null);
  const [iconUris, setIconUris] = useState(null);
  const [byPurchase, setByPurchase] = useState(null);
  const [bySchedule, setBySchedule] = useState(null);

  const [ByPurchase, ByPurchaseCreate] = useState(null);
  const [BySchedule, ByScheduleCreate] = useState(null);

  useEffect(() => {
    const init = async () => {
      const classObj = new Class();
      await classObj.initByUid(classId);

      // get attendees
      // const attendees = firestore()
      //   .collection('users')
      //   .get()
      //   .then(querySnapshot => {
      //     querySnapshot.forEach(documentSnapshot => {

      //       // go through classes
      //       documentSnapshot.data().active_classes.map((it) => {

      //       })
      //     }

      //       if (documentSnapshot.data().)
      //       console.log("gym")
      //       setGyms(prevArray => [...prevArray, documentSnapshot.data()])
      //     });
      //   });

      const attendees = await classObj.retrieveAttendees(timeId);

      console.log('attendees', attendees); // DEBUG

      setAttendees(attendees);
    };
    init();
  }, []);

  // Separates the attendees into two categories:
  //   -  Those who purchased One Time Class
  //   -  Those who scheduled it on the basis of having a membership
  useEffect(() => {
    if (!attendees) return;
    console.log("this shouldn't be called");
    const init = async () => {
      let promises = [];
      attendees.forEach((client) => {
        promises.push(publicStorage(client.icon_uri));
      });
      // Last icon will always be imbueProfileLogoBlack.png,
      // for use with the placeholder / "Your future client" below
      promises.push(publicStorage('imbueProfileLogoBlack.png'));
      let iconUris = await Promise.all(promises);
      setIconUris(iconUris);
      const processedAttendees = attendees.map((client, idx) => {
        return {
          ...client,
          icon_uri: iconUris[idx],
        };
      });

      let byPurchase = [];
      let bySchedule = [];
      processedAttendees.forEach((client) => {
        switch (client.purchase_method) {
          case 'class':
            byPurchase.push(client);
            break;
          case 'membership':
            bySchedule.push(client);
            break;
        }
      });
      setByPurchase(byPurchase);
      setBySchedule(bySchedule);
    };
    init();
  }, [attendees]);

  useEffect(() => {
    if (!byPurchase) return;
    if (!bySchedule) return;
    console.log("shouldn't be called if no byPurchase or bySchedule");
    ByPurchaseCreate(
      byPurchase.map((attendeeDoc, idx) => (
        <View
          key={idx}
          style={{
            // marginTop: idx !== 0 ? 10 : 0,
            marginTop: 10,
          }}>
          <AttendeeCard {...attendeeDoc} />
        </View>
      )),
    );

    ByScheduleCreate(
      bySchedule.map((attendeeDoc, idx) => (
        <View
          key={idx}
          style={{
            // marginTop: idx !== 0 ? 10 : 0,
            marginTop: 10,
          }}>
          <AttendeeCard {...attendeeDoc} />
        </View>
      )),
    );
  }, [byPurchase, bySchedule]);

  if (!ByPurchase || !BySchedule) return <View />;
  if (!attendees || !iconUris) return <View />;

  const FauxUser = (
    <View
      style={{
        marginTop: 10,
      }}>
      <AttendeeCard
        {...{
          first: `Your future client`,
          last: `\n(will show up here)`,
          icon_uri: iconUris[iconUris.length - 1],
        }}
      />
    </View>
  );

  return (
    <CustomPopup onX={props.onX}>
      <View
        style={{
          paddingHorizontal: 10,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.textInputBorder,
          borderRadius: 30,
          backgroundColor: colors.buttonAccent,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginVertical: 20,
            }}>
            <Text style={styles.title}>
              People who have purchased the class
            </Text>
            {ByPurchase.length === 0 ? FauxUser : ByPurchase}

            <View
              style={{
                height: 20,
              }}
            />

            <Text style={styles.title}>
              People who have this class on their schedule
            </Text>
            <Text style={styles.subtitle}>
              (excludes people in the list above)
            </Text>
            {BySchedule.length === 0 ? FauxUser : BySchedule}
          </View>
        </ScrollView>
      </View>
    </CustomPopup>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: '6%',
    ...FONTS.title,
    textAlign: 'center',
    fontSize: 20,
  },
  subtitle: {
    paddingHorizontal: '6%',
    ...FONTS.subtitle,
    textAlign: 'center',
    fontSize: 14,
  },
});
