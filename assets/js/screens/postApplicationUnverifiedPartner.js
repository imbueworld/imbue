import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

import ProfileLayout from '../layouts/ProfileLayout';
import CustomButton from '../components/CustomButton';
import Icon from '../components/Icon';
import GoBackButton from '../components/buttons/GoBackButton';

import User from '../backend/storage/User';
import {FONTS} from '../contexts/Styles';

export default function PartnerDashboard(props) {
  const [user, setUser] = useState(null);

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
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 25,
          flexDirection: 'column',
          flex: 1,
        }}>
        <Text
          style={{
            ...FONTS.subtitle,
            fontSize: 17,
            textAlign: 'center',
            textAlignVertical: 'center',
          }}>
          Influencer Application
        </Text>
        <Text
          style={{
            ...FONTS.body,
            fontSize: 12,
            textAlign: 'center',
            textAlignVertical: 'center',
            marginTop: 15,
          }}>
          Thank you so much for applying to imbue! we’re excited for this
          fitness journey together. Give us a few hours to look over your
          application.
        </Text>
      </View>
    </ProfileLayout>
  );
}
