exports.p = console.log
exports.w = console.warn
exports.e = console.error

exports._extractOnlyData = function(snapshots) {
  snapshots.forEach((item, idx, arr) => {
    arr[ idx ] = item.data() || {}
  })
  return snapshots
}

/**
 * @returns {String} `mm-dd-yyy`
 */
exports.getEndDateStringOfLastMonth = function() {
  const currentUTCDate = new Date()
  const formattedUTCDate = new Date(Date.UTC(
    currentUTCDate.getUTCFullYear(),
    currentUTCDate.getUTCMonth(),
    0 // Day param -- 0 makes it go to previous date, which is last month's final date
  ))

  let mm = (formattedUTCDate.getUTCMonth() + 1).toString()
  if (mm.length < 2) mm = `0${mm}` // ascertain two digits
  let dd = formattedUTCDate.getUTCDate().toString()
  if (dd.length < 2) dd = `0${dd}` // ascertain two digits
  let yyyy = formattedUTCDate.getUTCFullYear()

  return `${mm}_${dd}_${yyyy}`
}

exports.getEndDateStringOfTimestamp = function(timestamp=Date.now()) {
  if (!timestamp) return
  const date = new Date(timestamp)
  const nextMonth = date.getUTCMonth() + 1
  
  const formattedUTCDate = new Date(Date.UTC(
    date.getUTCFullYear(),
    nextMonth,
    0 // Day param -- 0 makes it go to previous date, which is last month's final date
  ))

  let mm = (formattedUTCDate.getUTCMonth() + 1).toString()
  if (mm.length < 2) mm = `0${mm}` // ascertain two digits
  let dd = formattedUTCDate.getUTCDate().toString()
  if (dd.length < 2) dd = `0${dd}` // ascertain two digits
  let yyyy = formattedUTCDate.getUTCFullYear()

  return `${mm}_${dd}_${yyyy}`
}

exports.getDateStringOfTimestamp = function(timestamp=Date.now()) {
  if (!timestamp) return
  const date = new Date(timestamp)

  let mm = (date.getUTCMonth() + 1).toString()
  if (mm.length < 2) mm = `0${mm}` // ascertain two digits
  let dd = date.getUTCDate().toString()
  if (dd.length < 2) dd = `0${dd}` // ascertain two digits
  let yyyy = date.getUTCFullYear()

  return `${mm}_${dd}_${yyyy}`
}