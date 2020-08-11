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
 * Takes UTC milliseconds timestamp
 * Returns local timezone formatted time as -- HH:MM AM/PM
 */
export function clockFromTimestamp(ts) {
    let date = new Date(ts)
    let hh = date.getHours() + 1 // idx ===> length
    let mm = date.getMinutes() // idx ===> length
    if (mm < 10) mm = `0${mm}`
    let ampm
    if (hh >= 12) {ampm = "pm"; hh -= 12}
    else ampm = "am"
    return `${hh}:${mm}${ampm}`
}

/**
 * Takes UTC milliseconds timestamp
 * Returns local timezone formatted date as -- Mon XX
 */
export function shortDateFromTimestamp(ts) {
    let date = new Date(ts)
    let mo
    switch(date.getMonth() + 1) { // idx ===> length
        case 1:
            mo = "Jan"
            break
        default:
            mo = "Mth"
            break
    }
    let day = date.getDate()
    let weekday
    switch(date.getDay() + 1) {
        case 1:
            weekday = "Monday"
            break
        default:
            weekday = "Weekday"
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