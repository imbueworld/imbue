// LoginPartner
// Login
// SignUp
import React, {useState} from 'react';
import {
  SafeAreaView,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppBackground from '../components/AppBackground';
import CompanyLogo from '../components/CompanyLogo';
import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import CustomCapsule from '../components/CustomCapsule';
import {handleAuthErrorAnonymous} from '../backend/HelperFunctions';
import SocialLogin from '../components/SocialLogin';
import {StackActions, useNavigation} from '@react-navigation/native';
import BackButton from '../components/BackButton';
import auth from '@react-native-firebase/auth';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {FONTS} from '../contexts/Styles';
import {colors, simpleShadow} from '../contexts/Colors';

export default function LoginPartner(props) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
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
  }

  return (
    <>
      <Modal visible={loading} animationType={'fade'} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <LottieView
            source={require('../components/img/animations/cat-loading.json')}
            style={{height: 100, width: 100}}
            autoPlay
            loop
          />
        </View>
      </Modal>
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
          {/* <Image
          style={{
              width: "100%",
              height: "100%",
              position: "absolute",
          }}
          source={require("../components/img/workout-23.jpg")}
      /> */}
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

            <CustomTextInput
              containerStyle={{
                borderColor: redFields.includes('email') ? 'red' : undefined,
              }}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <CustomTextInput
              secureTextEntry
              containerStyle={{
                borderColor: redFields.includes('password') ? 'red' : undefined,
              }}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
            />
            <CustomButton
              style={{
                marginBottom: 5,
              }}
              title="Login"
              onPress={async () => {
                setLoading(true);
                setRedFields([]);
                setErrorMsg('');
                setSuccessMsg('');
                // setSuccessMsg("")

                let errorMsg;
                try {
                  // Validate
                  errorMsg = invalidate();
                  if (errorMsg) throw new Error(errorMsg);

                  // Log in
                  await auth().signInWithEmailAndPassword(email, password);
                  setSuccessMsg("You've signed in!");
                  // setSuccessMsg("You've signed in!")

                  // Navigate
                  const pushAction = StackActions.push('Boot');
                  props.navigation.dispatch(pushAction);
                } catch (err) {
                  // If not native (form) error, check for auth error
                  if (!errorMsg) {
                    let [errorMsg, redFields] = handleAuthErrorAnonymous(err);
                    setRedFields(redFields);
                    setErrorMsg(errorMsg);
                    return;
                  }
                  // Otherwise...
                  setErrorMsg(errorMsg);
                } finally {
                  setLoading(false);
                }
              }}
            />
            <TouchableWithoutFeedback
              style={{alignSelf: 'center', padding: 10}}
              onPress={() => navigation.navigate('PasswordReset')}>
              <Text
                style={[
                  styles.text,
                  {
                    textDecorationLine: 'underline',
                    fontSize: 16,
                  },
                ]}>
                Forgot Password
              </Text>
            </TouchableWithoutFeedback>
          </CustomCapsule>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
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
    marginTop: 60,
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
  text: {
    ...FONTS.body,
    color: colors.accent,
  },
});
