import React, {useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import GoogleLoginButton from './buttons/GoogleLoginButton';
import FacebookLoginButton from './buttons/FacebookLoginButton';
import {AppleButton} from '@invertase/react-native-apple-authentication';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {firebase, auth} from '@react-native-firebase/auth';
import User from '../backend/storage/User';

async function onAppleButtonPress(onAuthChange) {
  // performs login request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  // get current authentication state for user
  // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
  const credentialState = await appleAuth.getCredentialStateForUser(
    appleAuthRequestResponse.user,
  );

  // 2). if the request was successful, extract the token and nonce
  const {identityToken, nonce} = appleAuthRequestResponse;

  // use credentialState response to ensure the user is authenticated
  if (credentialState === appleAuth.State.AUTHORIZED) {
    // can be null in some scenarios
    if (identityToken) {
      // 3). create a Firebase `AppleAuthProvider` credential
      const appleCredential = firebase.auth.AppleAuthProvider.credential(
        identityToken,
        nonce,
      );

      // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
      //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
      //     to link the account to an existing user
      const {user} = await firebase
        .auth()
        .signInWithCredential(appleCredential);
      // console.log('user: ' + JSON.stringify(user))
      console.log('user name: ' + user['displayName']);
      if (user) {
        if (user['displayName']) {
          if (user['displayName'].substring(0, 5) === 'user_') {
            // console.log("Recognized user account.")
          } else if (user['displayName'].substring(0, 8) === 'partner_') {
            // console.log("Recognized partner account.")
          }
        } else {
          let options = {
            user,
            accountType: 'user',
          };
          const userObj = new User();
          await userObj.create({}, options);
        }
        onAuthChange(user);
      }

      // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
      // console.warn(`Firebase authenticated via Apple, UID: ${userCredential.user.uid}`);
    } else {
      // handle this - retry?
    }
  }
}

export default function SocialLogin(props) {
  useEffect(() => {
    if (appleAuth.isSupported) {
      // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
      return appleAuth.onCredentialRevoked(async () => {
        console.warn(
          'If this function executes, User Credentials have been Revoked',
        );
      });
    }
  }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

  const {
    onAuthChange = () => {},
    onError = () => {},
    setLoading = () => {},
  } = props;

  if (props.options) {
    for (let option in props.options) {
      options[option] = props.options[option];
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        ...props.containerStyle,
      }}>
      <GoogleLoginButton
        accountType={options.accountType}
        imageStyle={styles.socialIcon}
        onAuthChange={onAuthChange}
        onError={onError}
        setLoading={(state) => setLoading(state)}
      />
      {appleAuth.isSupported && (
        <AppleButton
          onAuthChange={onAuthChange}
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.SIGN_IN}
          cornerRadius={999}
          style={{
            width: 64,
            height: 64,
          }}
          onPress={() =>
            // console.log('pressed')
            {
              setLoading(true);
              onAppleButtonPress(onAuthChange).finally(() => setLoading(false));
            }
          }>
          {/* <Image style={{width: 64, height: 64,}} source={require('../components/img/png/apple-sign-in.png')} /> */}
        </AppleButton>
      )}
      <FacebookLoginButton
        accountType={options.accountType}
        setLoading={(state) => setLoading(state)}
        imageStyle={styles.socialIcon}
        onAuthChange={onAuthChange}
      />
    </View>
  );
}

const options = {
  accountType: 'user',
};

const styles = StyleSheet.create({
  socialIcon: {
    width: 64,
    height: 64,
  },
});
