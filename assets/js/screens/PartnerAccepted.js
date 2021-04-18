import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppBackground from '../components/AppBackground';
import CompanyLogo from '../components/CompanyLogo';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import CustomCapsule from '../components/CustomCapsule';
import {StackActions, useNavigation} from '@react-navigation/native';
import BackButton from '../components/BackButton';
import auth from '@react-native-firebase/auth';
import {FONTS} from '../contexts/Styles';
import {colors, simpleShadow} from '../contexts/Colors';
import ForwardButton from '../components/ForwardButton';
import User from '../backend/storage/User';

export default function PartnerApply(props) {
  const navigation = useNavigation();

  const [redFields, setRedFields] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  // const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const { state, navigate } = this.props.navigation;
  function invalidate() {
    let redFields = [];
    if (!email) redFields.push('email');
    if (!password) redFields.push('password');
    if (redFields.length) {
      setRedFields(redFields);
      return 'Required fields need to be filled.';
    }
    useEffect(() => {
      const init = async () => {
        const user = new User();
        setUser(await user.retrieveUser());
      };
      init();
    }, []);
  }

  return (
    <SafeAreaView
      style={{
        flex: 0,
        backgroundColor: colors.bg,
        paddingTop: Platform.OS === 'android' ? 25 : 0,
      }}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}>
        <AppBackground />
        <CompanyLogo />
        {/* back button */}
        <TouchableHighlight
          style={styles.sidePanelButtonContainer}
          underlayColor="#eed"
          onPress={props.onBack || (() => navigation.goBack())}>
          <BackButton
            imageStyle={{
              width: 48,
              height: 48,
              // simpleShadow,
            }}
          />
        </TouchableHighlight>
        <CustomCapsule containerStyle={styles.container}>
          <View>
            <Text style={styles.profileName} numberOfLines={1}>
              {user.name}
            </Text>
          </View>

          {/* <SocialLogin
          containerStyle={{
            marginTop: 20,
            marginBottom: 10,
            marginHorizontal: 20,
          }}
          onAuthChange={() => {
            const pushAction = StackActions.push("Boot")
            props.navigation.dispatch(pushAction)
          }}
          onError={err => {
            // setErrorMsg(err.message)
            // setErrorMsg(`${err.code}  |  ${err.message}`)
            setErrorMsg('Something prevented the action.')
          }}
        /> */}

          {errorMsg ? (
            <Text style={{color: 'red'}}>{errorMsg}</Text>
          ) : (
            <Text style={{color: 'green'}}>{successMsg}</Text>
          )}
          {/* : <Text style={{ color: "green" }}>{successMsg}</Text>} */}

          <View>
            <Text style={styles.body}>
              Thank you so much for your interest in imbue. We’re going to ask a
              few questions to make sure you’ll be a good fit! Click the button
              to get started!
            </Text>
          </View>

          <View style={{marginTop: 150}}></View>
        </CustomCapsule>
        <TouchableHighlight
          style={styles.forwardButtonContainer}
          underlayColor="#eed"
          onPress={() => navigation.navigate('')}>
          <ForwardButton
            imageStyle={{
              width: 47,
              height: 47,
              // simpleShadow,
            }}
          />
        </TouchableHighlight>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
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
    marginTop: 10,
  },
  sidePanelButtonContainer: {
    backgroundColor: 'white',
    marginTop: 0,
    marginLeft: 10,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    zIndex: 110,
  },
  forwardButtonContainer: {
    marginBottom: 30,
    alignSelf: 'flex-end',
    marginEnd: 25,
    backgroundColor: '#ffffff',
    marginTop: 5,
  },
  title: {
    // marginTop: 15,
    marginBottom: 10,
    alignSelf: 'center',
    ...FONTS.title,
    fontSize: 16,
  },
  body: {
    alignSelf: 'center',
    ...FONTS.body,
    fontSize: 12,
  },
  text: {
    ...FONTS.body,
    color: colors.accent,
  },
  profileName: {
    // marginTop: 15,
    marginBottom: 10,
    alignSelf: 'center',
    ...FONTS.luloClean,
    fontSize: 16,
  },
});
