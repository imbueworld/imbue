const functions = require('firebase-functions')
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const imbueUrl = 'https://imbuefitness.com'
const waitlistTokenId = 'IIW1M7'



/**
 * Adds user to the waitlist,
 * or retrieves information about their current position in it.
 */
// exports.addUserToWaitlist = functions.https.onCall(async (data, context) => {
//   let { email, referrerToken } = data
//   if (typeof email != 'string') throw 'Email of wrong data type provided (expected String).'

//   let referral_link = imbueUrl
//   if (referrerToken) {
//     if (typeof referrerToken != 'string') throw 'ReferrerToken of wrong data type provided (expected String).'
//     referral_link += `?&ref_id=${referrerToken}`
//   }

//   return await new Promise((resolve, reject) => {
//     let xhr = new XMLHttpRequest
//     xhr.onload = () => {
//       try {
//         const res = JSON.parse(xhr.responseText)
//         resolve(res)
//       } catch(err) {
//         console.error(xhr.responseText)
//         reject(err)
//       }
//     }
//     xhr.open('POST', 'https://getwaitlist.com/waitlist')
//     xhr.setRequestHeader('Content-Type', 'application/json')
//     xhr.send(JSON.stringify({
//       email,
//       api_key: waitlistTokenId,
//       referral_link,
//     }))
//   })
// })