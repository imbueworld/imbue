import LINKS from "../contexts/Links"
import storage from "@react-native-firebase/storage"

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
export function datestringFromTimestamp(ts) {
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
    }
    return [errorMsg, redFields]
}

/**
 * Takes
 *  callBackFn -- to call every 'interval'
 *  cache -- to clear the interval on cache.working end
 *  ms -- after how long to cancel operation
 */
export function setWaiter(callBackFn, cache, ms) {
    const interval = 1000
    let limit = ms * (1 / interval) // milliseconds * intervals per millisecond
    let check = setInterval(() => {
        limit--
        if (!cache.working) {
            callBackFn()
        }
        if (!cache.working || limit <= 0) {
            // cache.working = 0
            clearInterval(check)
        }
    }, interval)
}

/**
 * For in use with <ClassList />
 */
export function addFormattingToClassData(docs) {
    if (!(docs instanceof Array)) return

    docs.forEach(doc => {
        doc.dateString = datestringFromTimestamp(doc.begin_time)
        doc.formattedDate = `${shortDateFromTimestamp(doc.begin_time)}`
        doc.formattedTime = `${clockFromTimestamp(doc.begin_time)} – ${clockFromTimestamp(doc.end_time)}`
    })
}

/**
 * For in use with <ClassList />
 */
export function addFunctionalityToClassData(docs, navigation) {
    if (!(docs instanceof Array)) return
    const currentTs = Date.now()

    docs.forEach(doc => {
        if (!(doc.active_times instanceof Array)) return
        doc.active_times.forEach(classDoc => {
            classDoc.onPress = () => {
                let data = {...doc}
                Object.entries(classDoc).forEach(([key, value]) => {
                    data[ key ] = value
                })
                delete data.active_times
                navigation.navigate("ClassDescription", { data })
            }

            classDoc.livestreamState = "offline"
            let timeVal = currentTs - classDoc.begin_time
            // If livestream scheduled time has come,
            // but the livestream is not over yet.
            if (timeVal > 0 && currentTs < classDoc.end_time) {
                classDoc.livestreamState = "live"
            }
            // If livestream is soon to start (30min before)
            if (timeVal > -1 * (1000 * 60 * 30) && currentTs < classDoc.begin_time) {
                classDoc.livestreamState = "soon"
            }
    
            // temporary testings
            // console.log("classDoc.begin_time", classDoc.begin_time)
            // console.log("classDoc.end_time", classDoc.end_time)
            // console.log("timeVal", timeVal)
        })
    })
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
            return "In Studio"
    }
}