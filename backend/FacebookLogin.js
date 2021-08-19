import auth from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import User from './storage/User'



export async function FacebookLogin(accountType, onAuthChange) {
  // Attempt login with permissions
  // LoginManager.logOut();
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

  // Sign-in the user with the credential
  const { user } = await auth().signInWithCredential(facebookCredential);

  

  if (user) {
    if (user.displayName.substring(0, 5) === "user_") {
      // console.log("Recognized user account.")
    } else if (user.displayName.substring(0, 8) === "partner_") {
      // console.log("Recognized partner account.")
    } else {
      let options = {
        user,
        accountType,
      }
      const userObj = new User()
      await userObj.create({}, options)
    }
    onAuthChange(user)
  }
}