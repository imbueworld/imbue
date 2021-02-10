import auth from '@react-native-firebase/auth'
import { GoogleSignin } from '@react-native-community/google-signin'
import User from './storage/User'



export async function GoogleLogin(accountType, onAuthChange=(() => {}), onError=(() => {})) {
  try {
    await GoogleSignin.hasPlayServices()
  } catch(err) {
    onError(err.message)
    return
  }

  console.log("we made it!")

  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn(); 


  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  const { user } = await auth().signInWithCredential(googleCredential);

  if (user) {
    console.log("above")
    if (user.displayName.substring(0, 5) === "user_") {
      console.log("below if")
      // console.log("Recognized user account.")
    } else if (user.displayName.substring(0, 8) === "partner_") {
      console.log("else if")
      // console.log("Recognized partner account.")
    } else {
      console.log("bottom else")
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