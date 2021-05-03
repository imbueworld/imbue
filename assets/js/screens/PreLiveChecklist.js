import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import ProfileLayout from '../layouts/ProfileLayout';
import { FONTS } from '../contexts/Styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import User from '../backend/storage/User';
import config from '../../../App.config';
import CheckBox from '@react-native-community/checkbox';
import CustomButton from '../components/CustomButton';
import { colors, simpleShadow } from '../contexts/Colors';
import AppBackground from '../components/AppBackground';
import BackButton from '../components/BackButton';
import Icon from '../components/Icon';

export default function PreLiveChecklist(props) {
  const route = useRoute();
  const { timeId, classId } = route.params;
  const [disabled, setDisabled] = useState(true);
  const [toggleCheckBox1, setToggleCheckBox1] = useState(false);
  const [toggleCheckBox2, setToggleCheckBox2] = useState(false);
  const [toggleCheckBox3, setToggleCheckBox3] = useState(false);
  const [toggleCheckBox4, setToggleCheckBox4] = useState(false);
  const [toggleCheckBox5, setToggleCheckBox5] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const init = async () => {
      const user = new User();
      const userDoc = await user.retrieveUser();
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (
        toggleCheckBox1 == true &&
        toggleCheckBox2 == true &&
        toggleCheckBox3 == true &&
        toggleCheckBox4 == true &&
        toggleCheckBox5 == true
      ) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    };
    init();
  }, [
    toggleCheckBox1,
    toggleCheckBox2,
    toggleCheckBox3,
    toggleCheckBox4,
    toggleCheckBox5,
  ]);

  const handleOnPress = () => {
    if (
      toggleCheckBox1 == true &&
      toggleCheckBox2 == true &&
      toggleCheckBox3 == true &&
      toggleCheckBox4 == true &&
      toggleCheckBox5 == true
    ) {
      setDisabled(false);
      props.navigation.navigate('GoLive', { classId, timeId });
    } else {
      setDisabled(true);
    }
  };

  // if (!user) return <View />

  return (
    <SafeAreaView
      style={{
        flex: 0,
        backgroundColor: colors.bg,
        paddingTop: Platform.OS === 'android' ? 25 : 0,
      }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled">
        <AppBackground />

        {/* Back Button */}
        <TouchableOpacity
          style={styles.sidePanelButtonContainer}
          onPress={props.onBack || (() => navigation.goBack())}>
          <BackButton
            imageStyle={{
              width: 47,
              height: 47,
            }}
          />
        </TouchableOpacity>

        {/* Help and logout buttons */}
        <View
          style={{
            flex: 1,
            position: 'absolute',
            right: 0,
            flexDirection: 'row-reverse',
            paddingRight: 10,
            marginTop: 10,
            marginRight: 10,
            zIndex: 2,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('help')}
            containerStyle={{
              alignSelf: 'center',
              width: 30,
              height: 30,
              marginLeft: 10,
            }}>
            <Icon
              containerStyle={{
                width: 30,
                height: 30,
                position: 'absolute',
                top: 10,
                right: 0,
              }}
              source={require('../components/img/png/question-mark.png')}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          Make sure you're ready to go live:
        </Text>

        <View style={styles.checkBoxesContainer}>
          <CheckBox
            text="Hello"
            onCheckColor="#f9f9f9"
            onFillColor="#242429"
            onTintColor="#242429"
            tintColor="#242429"
            value={toggleCheckBox1}
            onValueChange={(newValue) => setToggleCheckBox1(newValue)}
          />
          <Text style={styles.subHeading}>solid internet connection</Text>
        </View>

        <View style={styles.checkBoxesContainer}>
          <CheckBox
            text="Hello"
            onCheckColor="#f9f9f9"
            onFillColor="#242429"
            onTintColor="#242429"
            tintColor="#242429"
            value={toggleCheckBox2}
            onValueChange={(newValue) => setToggleCheckBox2(newValue)}
          />
          <Text style={styles.subHeading}>phone on do not disturb</Text>
        </View>

        <View style={styles.checkBoxesContainer}>
          <CheckBox
            text="Hello"
            onCheckColor="#f9f9f9"
            onFillColor="#242429"
            onTintColor="#242429"
            tintColor="#242429"
            value={toggleCheckBox3}
            onValueChange={(newValue) => setToggleCheckBox3(newValue)}
          />
          <Text style={styles.subHeading}>ample space to do all exercises</Text>
        </View>

        <View style={styles.checkBoxesContainer}>
          <CheckBox
            text="Hello"
            onCheckColor="#f9f9f9"
            onFillColor="#242429"
            onTintColor="#242429"
            tintColor="#242429"
            value={toggleCheckBox4}
            onValueChange={(newValue) => setToggleCheckBox4(newValue)}
          />
          <Text style={styles.subHeading}>
            posted on social media that you’re about to start
          </Text>
        </View>

        <View style={styles.checkBoxesContainer}>
          <CheckBox
            text="Hello"
            onCheckColor="#f9f9f9"
            onFillColor="#242429"
            onTintColor="#242429"
            tintColor="#242429"
            value={toggleCheckBox5}
            onValueChange={(newValue) => setToggleCheckBox5(newValue)}
          />
          <Text style={styles.subHeading}>ready to sweat!</Text>
        </View>

        <CustomButton
          title="Go Live"
          style={styles.unLocked}
          onPress={() => handleOnPress()}
        />

        {/* {disabled ?
          <CustomButton
            title="Go Live"
            style={styles.locked}
            disabled={true}
            onPress={() => 
              props.navigation.navigate("GoLive")
          }
        /> :
        <CustomButton
          title="Go Live"
          style={styles.unLocked}
          onPress={() => 
            props.navigation.navigate("GoLive")
          }
        />
        } */}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: '100%',
    backgroundColor: '#F9F9F9',
    marginHorizontal: 10,
  },
  checkBoxesContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    marginHorizontal: 5,
  },
  title: {
    marginTop: 45,
    marginBottom: 30,
    textAlign: 'center',
    alignSelf: 'center',
    ...FONTS.title,
    fontSize: 16,
  },
  subHeading: {
    marginLeft: 10,
    marginRight: 10,
    paddingVertical: 8,
    alignSelf: 'center',
    fontSize: 12,
    ...FONTS.body,
  },
  locked: {
    opacity: 0.7,
    marginTop: 30,
  },
  unLocked: {
    opacity: 1.0,
    marginTop: 30,
  },
});
