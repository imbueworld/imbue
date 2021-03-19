import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Platform,
} from 'react-native';
import AppBackground from '../components/AppBackground';
import CompanyLogo from '../components/CompanyLogo';
import CustomCapsule from '../components/CustomCapsule';
import {useNavigation} from '@react-navigation/native';
import BackButton from '../components/BackButton';
import {FONTS} from '../contexts/Styles';
import {colors, simpleShadow} from '../contexts/Colors';
import ForwardButton from '../components/ForwardButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export const PartnerApplyBackground = (props) => {
  const {onNextButton, children} = props;
  const navigation = useNavigation();

  const {top, bottom} = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        paddingTop: Platform.OS === 'android' ? 25 : 0,
        justifyContent: 'space-between',
      }}>
      <TouchableHighlight
        style={[styles.sidePanelButtonContainer, {top: top}]}
        underlayColor="#fff"
        onPress={() => navigation.goBack()}>
        <BackButton
          imageStyle={{
            width: 48,
            height: 48,
            simpleShadow,
          }}
        />
      </TouchableHighlight>
      <KeyboardAwareScrollView
        containerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <CompanyLogo style={{height: 100, marginTop: 80, marginBottom: 60}} />
        <CustomCapsule containerStyle={styles.container}>
          <View>
            <Text style={styles.title}>Influencer application</Text>
          </View>
          <View>{children}</View>
        </CustomCapsule>
      </KeyboardAwareScrollView>
      {onNextButton && (
        <TouchableHighlight
          style={[styles.forwardButtonContainer, {bottom: bottom}]}
          underlayColor="#fff"
          onPress={() => onNextButton()}>
          <ForwardButton size={70} />
        </TouchableHighlight>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    minHeight: '100%',
    backgroundColor: '#F9F9F9',
  },
  container: {
    width: '88%',
    marginBottom: 30,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
  },
  sidePanelButtonContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 99,
  },
  forwardButtonContainer: {
    marginBottom: 30,
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 25,
    backgroundColor: '#ffffff',
    marginTop: 5,
  },
  title: {
    width: '60%',
    textAlign: 'center',
    marginBottom: 50,
    alignSelf: 'center',
    ...FONTS.subtitle,
    fontSize: 17,
  },
  body: {
    alignSelf: 'center',
    textAlign: 'center',
    ...FONTS.body,
    fontSize: 12,
  },
  text: {
    ...FONTS.body,
    color: colors.accent,
  },
});
