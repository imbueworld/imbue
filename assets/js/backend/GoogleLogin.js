import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-community/google-signin';
import { initializeAccount } from './BackendFunctions';

export async function GoogleLogin(cache, accountType, onAuthChange=(() => {}), onError=(() => {})) {
  try {
    await GoogleSignin.hasPlayServices()
  } catch(err) {
    onError(err)
    return
  }

  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  console.log(1, "[GoogleLogin] Got this far.") //

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  console.log(2, "[GoogleLogin] Got this far.") //

  // Sign-in the user with the credential
  const { user } = await auth().signInWithCredential(googleCredential);

  console.log(3, "[GoogleLogin] Got this far.") //

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
      await initializeAccount(cache, {}, options)
    }

    console.log(4, "[GoogleLogin] Got this far.") //

    onAuthChange(user)
  }
}