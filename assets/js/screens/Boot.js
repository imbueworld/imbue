import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View, Button } from 'react-native';
import config from '../../../App.config';

import AppBackground from '../components/AppBackground';
import CompanyLogo from '../components/CompanyLogo';

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import { LoginManager } from 'react-native-fbsdk';
import { StackActions, useNavigation } from '@react-navigation/native';
import { colors } from '../contexts/Colors';
import functions from '@react-native-firebase/functions';

import User from '../backend/storage/User';
import cache from '../backend/storage/cache';

export default function Boot(props) {
  // signs out user on app load
  // GoogleSignin.signOut()
  // LoginManager.logOut()
  // auth().signOut()

  const navigation = useNavigation();

  const bootWithUser = async () => {
    const user = new User();
    // console.log("await user.retrieveUser(): ", await user.retrieveUser())
    const { account_type } = await user.retrieveUser();
    const { approved } = await user.retrieveUser();
    const { phone } = await user.retrieveUser();
    const { associated_classes } = await user.retrieveUser();
    const userDoc = await user.retrieveUser();

    // // Waitlist stuff:
    // // Determine whether to let in or not
    // switch (account_type) {
    //   case "user":
    //     const { waitlist_threshhold, current_priority } = await user.retrieveWaitlistStatus()

    //     // If user's waitlist current priority falls below the cutoff,
    //     // Redirect to a screen that tells them that they're still gonna have to wait
    //     if (current_priority > waitlist_threshhold) {
    //       navigation.reset({
    //         index: 0,
    //         routes: [{ name: 'Waitlist' }],
    //       })
    //       return // Do not continue
    //     }
    //   case "partner":
    //     navigation.reset({
    //       index: 0,
    //       routes: [{ name: "PartnerDashboard" }],
    //     })
    //     break
    //   default:
    //     navigation.reset({
    //       index: 0,
    //       routes: [{ name: 'Landing' }],
    //     })
    //     break
    // }

    switch (account_type) {
      case 'user':
        navigation.reset({
          index: 0,
          routes: [{ name: 'UserDashboard' }],
        });
        break;
      case 'partner':
        if (!approved) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'postApplicationUnverifiedPartner' }],
          });
          break;
        } else if (approved && !phone) {
          // add to SendGrid accepted influencers
          try {
            let listName = 'accepted influencer';
            let email = userDoc.email;
            let first = userDoc.first;
            let last = userDoc.last;

            // Remove fromt Sendgrid
            const removeFromSendGrid = functions().httpsCallable(
              'removeFromSendGrid',
            );
            await removeFromSendGrid({ email, first, last, listName });

            // add to new list
            const addToSendGrid = functions().httpsCallable('addToSendGrid');
            await addToSendGrid({ email, first, last, listName });
          } catch (err) {
            console.log("addToSendGrid didn't work: ", err);
          }

          // remove from SendGrid applied influencers

          navigation.reset({
            index: 0,
            routes: [{ name: 'PartnerOnboard' }],
          });
          break;
        } else if (approved && associated_classes) {
          navigation.reset({
            index: 0,
            // Send to flow to create & schedule page - not created yet
            routes: [{ name: 'PartnerDashboard' }],
          });
          break;
        } else if (approved && phone) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'PartnerDashboard' }],
          });
          break;
        }
      default:
        navigation.reset({
          index: 0,
          routes: [{ name: 'Landing' }],
        });
        break;
    }
  };

  useEffect(() => {
    // Clear (session) cache no matter what, when entering this screen
    cache()._resetCache();

    // (Optionally) Do not redirect automatically, if DEBUG
    // if (config.DEBUG) return

    const init = async () => {
      // Let the logo show for at least 200ms
      await new Promise((r) => setTimeout(r, 200));

      if (auth().currentUser) {
        await bootWithUser();
      } else {
        console.log('else');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Landing' }],
        });
      }
    };
    init();
  }, []);

  if (!config.DEBUG)
    return (
      <CompanyLogo
        containerStyle={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.bg,
        }}
      />
    );

  if (!user) return <View />;

  // useEffect(() => {
  //   new Promise(r => setTimeout(r, 3500))
  //   const init = async () => {
  //     const user = new User()
  //     setUser(await user.retrieveUser())
  //   }; init()
  // }, [])

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollView}>
      <AppBackground />
      <View style={styles.container}>
        <View style={{ height: 30, borderBottomWidth: 1 }} />
        <Button
          title="Normal Boot"
          onPress={() => {
            if (auth().currentUser) {
              bootWithUser();
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Landing' }],
              });
            }
          }}
        />

        <View style={{ height: 10, borderBottomWidth: 1 }} />
        <Button
          title="Testing Grounds"
          onPress={() => {
            props.navigation.navigate('Test');
          }}
        />
        <View style={{ height: 10, borderBottomWidth: 1 }} />

        <View style={{ height: 50 }} />
        <Button
          title="Livestream (h3Gj4YYpDhmlbXfRScm4)" // wUGdlSqTzNiaAR7VtkUy // D4iONGuVmdWwx4zGk4BI
          onPress={() => {
            props.navigation.navigate('Livestream', {
              gymId: 'h3Gj4YYpDhmlbXfRScm4',
            });
          }}
        />

        <View style={{ height: 10, borderBottomWidth: 1 }} />
        <View style={{ height: 10, borderBottomWidth: 1 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: '100%',
    backgroundColor: '#F9F9F9',
  },
  container: {
    backgroundColor: '#F9F9F9',
  },
});
