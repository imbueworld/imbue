import { GoogleSignin } from "@react-native-community/google-signin"
import { PermissionsAndroid, Platform } from "react-native"
import { LoginManager } from "react-native-fbsdk"
import auth from '@react-native-firebase/auth'
import config from "../../../App.config"

/**
 * inp -- must be passed in the format of [YYYY-MM-DD HH-MM]
 * Returns second-timestamp
 */
function fullTimeToTimestamp(inp) {
  let [date, time] = inp.split(" ")
  // let [y, m, d] = date.split("-")
  let [hh, mm] = time.split(":")

  // Returns UTC millisecond timestamp
  // return new Date(`${date}T${time}:00+00:00`).getTime() // UTC variant
  return new Date(`${date}T${time}:00`).getTime() // Local(??) TZ variant
  return (hh * 60 * 60) + (mm * 60)
}

/**
 * Takes UTC milliseconds timestamp
 * Returns dateString as YYYY-MM-DD, note: in local timezone
 */
export function dateStringFromTimestamp(ts) {
  let date = new Date(ts)
  let y = date.getFullYear()
  let m = date.getMonth() + 1 // idx ===> length
  let d = date.getDate()
  if (m < 10) m = `0${m}`
  if (d < 10) d = `0${d}`
  return `${y}-${m}-${d}`
}

/**
 * Takes milliseconds timestamp
 * Returns local timezone formatted time as -- 00:00am/pm
 */
export function clockFromTimestamp(ts) {
  let date = new Date(ts)
  let hh = date.getHours() // idx ===> length
  let mm = date.getMinutes()
  if (mm < 10) mm = `0${mm}`
  let ampm = "am"
  if (hh == 12) ampm = "pm"
  if (hh > 12) { ampm = "pm"; hh -= 12 }
  return `${hh}:${mm}${ampm}`
}

/**
 * Takes UTC milliseconds timestamp
 * Returns local timezone formatted date as -- Mon XX
 */
export function shortDateFromTimestamp(ts) {
  let date = new Date(ts)
  let mo
  switch (date.getMonth() + 1) { // idx ===> length
    case 1:
      mo = "Jan"
      break
    case 2:
      mo = "Feb"
      break
    case 3:
      mo = "Mar"
      break
    case 4:
      mo = "Apr"
      break
    case 5:
      mo = "May"
      break
    case 6:
      mo = "Jun"
      break
    case 7:
      mo = "Jul"
      break
    case 8:
      mo = "Aug"
      break
    case 9:
      mo = "Sep"
      break
    case 10:
      mo = "Oct"
      break
    case 11:
      mo = "Nov"
      break
    case 12:
      mo = "Dec"
      break
    default:
      mo = `Month=${date.getMonth() + 1}`
      break
  }
  let day = date.getDate()
  let weekday
  switch (date.getDay() + 1) {
    case 1:
      weekday = "Sunday"
      break
    case 2:
      weekday = "Monday"
      break
    case 3:
      weekday = "Tuesday"
      break
    case 4:
      weekday = "Wednesday"
      break
    case 5:
      weekday = "Thursday"
      break
    case 6:
      weekday = "Friday"
      break
    case 7:
      weekday = "Saturday"
      break
    default:
      weekday = `DayOfTheWeek=${date.getDay() + 1}`
      break
  }
  return `${weekday}, ${mo} ${day}`
}

export function representDatabaseField(field) {
  switch (field) {
    case 'dob':
      return 'Date of Birth'
    case 'gender':
      return 'Gender'
    // case '':
    //   return ''
    default:
      if (config.DEBUG) console.warn(`HelperFunctions/representDatabaseField field ${field} not set.`)
      return field
  }
}

/**
 * Turns zero-decimal USD, EUR etc. formatted currency
 * into formatted currency, with a dot
 */
export function currencyFromZeroDecimal(value) {
  return (Number.parseFloat(value) / 100).toFixed(2)
}

export function zeroDecimalFromCurrency(value) {
  let commaIdx = value.search(/[.]/)
  if (commaIdx !== -1) {
    let cents = value.slice(commaIdx + 1, commaIdx + 3)
    if (cents.length < 2) cents = `${cents}0`
    let dollars = value.slice(0, commaIdx)
    return parseInt(dollars + cents)
  } else {
    return parseInt(value + "00")
  }
}

/**
 * Helps with stripe payments.
 */
export function imageSourceFromCCBrand(brand) {
  brand = brand.toLowerCase()
  switch (brand) {
    case "american express":
      return require("../components/img/png/amex.png")
    case "cartes_bancaires":
      return require("../components/img/png/generic-credit-card.png")
    case "diners club":
      return require("../components/img/png/diners-club.png")
    case "discover":
      return require("../components/img/png/discover.png")
    case "jcb":
      return require("../components/img/png/jcb.png")
    case "mastercard":
      return require("../components/img/png/mastercard.png")
    case "visa":
      return require("../components/img/png/visa.png")
    case "unionpay":
      return require("../components/img/png/unionpay.png")
  }
}

/**
 * Handles firebase auth() error codes
 */
export function handleAuthError(err) {
  let errorMsg
  let redFields = []
  switch (err.code) {
    case "auth/email-already-in-use":
    case "auth/operation-not-allowed":
      errorMsg = "Email is already in use."
      redFields = ["email"]
      break
    case "auth/invalid-email":
      errorMsg = "Provide a valid email."
      redFields = ["email"]
      break
    case "auth/weak-password":
      errorMsg = "Weak password."
      redFields = ["password", "passwordConfirm"]
      break
    case "auth/wrong-password":
      errorMsg = "Wrong password."
      redFields = ["password", "passwordConfirm"]
      break
    case "auth/too-many-requests":
      errorMsg = "Too many attempts made. Try again later."
      redFields = ["password"]
      break
    case "auth/user-disabled":
      errorMsg = "This account is disabled."
      redFields = ["email"]
      break
    case "auth/user-not-found":
      errorMsg = "Credentials did not match an account in our system."
      redFields = ["email", "password"]
    default:
      errorMsg = "Something prevented the action."
      break
  }
  return [errorMsg, redFields]
}

export function handleAuthErrorAnonymous(err) {
  let errorMsg
  let redFields = []
  switch (err.code) {
    case "auth/wrong-password":
    case "auth/invalid-email":
    case "auth/user-not-found":
      errorMsg = "Credentials did not match an account in our system."
      redFields = ["email", "password"]
      break
    case "auth/user-disabled":
      errorMsg = "This account is disabled."
      redFields = ["email"]
      break
    default:
      errorMsg = "Something prevented the action."
      break
  }
  return [errorMsg, redFields]
}

export function handlePasswordResetError(err) {
  let errMsg
  switch(err.code) {
    case 'auth/expired-action-code':
      errMsg = 'Code has expired.'
      break
    case 'auth/invalid-action-code':
      errMsg = 'Entered code was not the correct one.'
      break
    case 'user-disabled':
      errMsg = 'User is disabled.'
      break
    case 'auth/user-not-found':
      errMsg = 'User was not found.'
      break
    case 'auth/weak-password':
      errMsg = 'Weak password.'
      break
    default:
      errMsg = 'Something prevented the action.'
      break
  }
  return errMsg
}

/**
 * Generates a random id
 */
export function getRandomId() {
  const random = () => {
    return Math.random().toString(36).substr(2, 9)
  }

  let st = random() + random()
  let st2 = ""
  for (let i = 0; i < st.length; i++) {
    let char = st[i]
    if (typeof char === "string") {
      if (Math.random() >= 0.5) st2 += char.toUpperCase()
      else st2 += char.toLowerCase()
    } else st2 += char
  }
  return st2
}

export function classType(type) {
  switch (type) {
    case "online":
      return "Online"
    case "in_studio":
    case "studio":
      return "In Studio"
  }
}



/**
 * Permission checking, primarily for Android,
 * any potential iOS stuff can also be added.
 * 
 * @param {Array<String>} perms
 * 
 * @returns {(Array<String> | null)}
 * `null`, if all permissions were fulfilled, or
 * an `Array` of permissions that were not.
 */
export async function requestPermissions(perms) {
  if (Platform.OS = 'android') {
    const PermissionObjects = perms
      .map(permName => PermissionsAndroid.PERMISSIONS[ permName ])
    
    const outcomes = await PermissionsAndroid.requestMultiple(PermissionObjects)
    const unfulfilled = Object.entries(outcomes)
      .filter(([perm, status]) => status != 'granted')
      .map(([perm, status]) => perm)

    return unfulfilled.length ? unfulfilled : null

  } else if (Platform.OS = 'ios') {
    // iOS .. ?
  }
}



export async function logOutAndRedirect(navigation) {
  if (!navigation) {
    if (config.DEBUG) console.warn('logOutAndRedirect did not execute because param `navigation` was not provided, it should be something you get from useNavigation().')
    return
  }

  await Promise.all([
    GoogleSignin.signOut(),
    LoginManager.logOut(),
    auth().signOut(),
  ])
  navigation.reset({
    index: 0,
    routes: [{ name: 'Boot' }],
  })
}





// import User from './storage/User'

// /**
//  * [Essentialy belongs in HelperFunctions.js]
//  * 
//  * Filters out the time_ids from class doc,
//  * that the user hasn't signed up for.
//  */
// export async function filterUserClasses() {
//   const user = new User()
//   const { scheduled_classes } = await user.retrieveUser()

//   const classes = user.retrieveClasses()

//   let newClasses = []
//   classes.forEach(classObj => {
//     const classDoc = { ...classObj.getAll() } // Must not mess up the original doc in cache
//     let activeTimeIds = scheduled_classes.map(it => it.time_id)

//     // [THIS DOES NOT LOOK LIKE A GOOD PRACTICE]
//     classDoc.active_times = classDoc.active_times
//       .filter(active => activeTimeIds.includes(active.time_id))
//     newClasses.push(classDoc)
//   })
//   return newClasses
// }
