const admin = require('firebase-admin')
const functions = require('firebase-functions')
const stripe = require('stripe')(functions.config().stripe.secret, {
  apiVersion: '2020-03-02',
})
const { Reports } = require('../Reports')
const {
  membership_instances,
  partners,
} = require('../Collections')
const {
  getEndDateStringOfLastMonth,
  getEndDateStringOfTimestamp,
} = require('../HelperFunctions')



/**
 * Calculates all payout information for each gym by going through
 * membership_instances collection.
 */
async function coreCalculatePayouts(mode) {
  if (mode !== 'inspect'
    && mode !== 'commit'
    && mode !== 'refresh') throw 'ValueError on param \'mode\'.'

  // const DOC_LIMIT_TOTAL = 50
  const DOC_LIMIT_BATCH = 10
  const MO_END_DATE_STRING = getEndDateStringOfLastMonth()
  const CURRENT_DATE_STRING = getEndDateStringOfTimestamp()
  const DATE_STRING = mode == 'refresh'
    ? CURRENT_DATE_STRING
    : MO_END_DATE_STRING
  const DAYS_IN_MONTH = 30
  // const IMBUE_UNIVERSAL_PRICE = ( await gyms.doc('imbue').get() ).data().membership_price // alternative
  IMBUE_UNIVERSAL_PRICE = 19390 // USD 200 - USD 6.10 Stripe fee
  let lastFirebaseDoc
  let gym_docs_done = 0
  const GYM_REVENUES = {} // product, final goal
  // DEBUG VARIABLES
  const reports = new Reports(DATE_STRING, '_payouts', 5)
  await reports.deleteLogs()
  const DEBUG = {
    MEMBERSHIP_INSTANCES_READ: 0,
  }

  // DEBUG
  DEBUG['mode'] = mode
  DEBUG['1 MO_END_DATE_STRING'] = MO_END_DATE_STRING
  DEBUG['2 CURRENT_DATE_STRING'] = CURRENT_DATE_STRING
  DEBUG['3 DATE_STRING'] = CURRENT_DATE_STRING
  DEBUG['IMBUE_UNIVERSAL_PRICE'] = IMBUE_UNIVERSAL_PRICE
  if (!IMBUE_UNIVERSAL_PRICE) {
    DEBUG['__message'] = 'Imbue Universal Membership Price was not found.'
    await reports.log('__GENERAL', DEBUG, true)
  }

  async function getBatchOfUsers() {
    return (await membership_instances
      .orderBy('id')
      .startAfter(lastFirebaseDoc || '')
      .limit(DOC_LIMIT_BATCH)
      .get()
    ).docs
  }

  // async function getBatchOfGyms(userId) {
  //   return (await membership_instances
  //     .doc(userId)
  //     .collection('visits')
  //     .doc(DATE_STRING)
  //     .collection('gyms')
  //     .get()
  //   ).docs
  // }

  const getBatchOfGymsOnlineUsage = async (userId) => {
    return await membership_instances
      .doc(userId)
      .collection('visits')
      .doc(DATE_STRING)
      .collection('gyms_visited_online')
      .get()
      .then(snap => snap.docs)
  }
  const getBatchOfGymsInstudioUsage = async (userId) => {
    return await membership_instances
      .doc(userId)
      .collection('visits')
      .doc(DATE_STRING)
      .collection('gyms_visited_instudio')
      .get()
      .then(snap => snap.docs)
  }

  while(true/* && DOC_LIMIT_TOTAL > gym_docs_done*/) {
    const userDocs = await getBatchOfUsers(lastFirebaseDoc)
    if (!userDocs.length) break
    lastFirebaseDoc = userDocs[ userDocs.length - 1 ]

    /*usersLoop: */for (let userDoc of userDocs) {
      // DEBUG VARIABLES
      const USER_DEBUG = {}

      const coreGymDocAnalyzer = async (gymDocs) => {
        // Determine total visits by the user to all gyms combined
        const TOTAL_VISITS = gymDocs.reduce((totalVisits, gymDoc) => {
          return totalVisits + gymDoc.data().times_visited
        }, 0)

        // DEBUG
        USER_DEBUG['TOTAL_VISITS'] = TOTAL_VISITS
        if (TOTAL_VISITS <= 0) {
          USER_DEBUG['__message'] = 'Total visits cannot be 0 or negative.'
          await reports.log(userDoc.id, USER_DEBUG)
          // continue usersLoop
          return
        }


        // If total visits are less than 8, divide by 8,
        // else divide by total visits
        const timesVisitedDivisor =
          TOTAL_VISITS < 8
          ? 8 : TOTAL_VISITS
        // If total visits are over days in the month, divide by total visits,
        // else divide by days in the month
        const daysInMonthDivisor =
          TOTAL_VISITS > DAYS_IN_MONTH
          ? TOTAL_VISITS : DAYS_IN_MONTH


        // Determine gross compensation for each gym
        const GROSS_COMPENSATIONS = {}
        for (let gymDoc of gymDocs) {
          // DEBUG VAR
          const USER_GYM_DEBUG = {}

          const id = gymDoc.id
          const {
            times_visited: timesVisited,
            membership_price_paid: membershipPrice,
          } = gymDoc.data()

          // DEBUG
          USER_GYM_DEBUG['gymId'] = gymDoc.id
          USER_GYM_DEBUG['times_visited'] = timesVisited
          USER_GYM_DEBUG['membership_price_paid'] = membershipPrice
          if (membershipPrice <= 0) {
            USER_GYM_DEBUG['__message'] = 'Membership price paid cannot be 0 or negative.'
            await reports.log(userDoc.id, USER_GYM_DEBUG)
            // continue usersLoop
            return
          }
          if (timesVisited < 0) {
            USER_GYM_DEBUG['__message'] = 'Times visited cannot be a negative number.'
            await reports.log(userDoc.id, USER_GYM_DEBUG)
            // continue usersLoop
            return
          }

          GROSS_COMPENSATIONS[ id ] =
            timesVisited / timesVisitedDivisor * membershipPrice
        }
        
        // DEBUG
        USER_DEBUG['GROSS_COMPENSATIONS'] = GROSS_COMPENSATIONS
        
        const gymReduction = Object.values(GROSS_COMPENSATIONS)
          .reduce((acc, compVal) => {
            return acc + compVal
          }, 0)

        const unallocatedFunds =
          (IMBUE_UNIVERSAL_PRICE * 0.9)
          - gymReduction
        
        // DEBUG
        USER_DEBUG['unallocatedFunds'] = unallocatedFunds

        // Calculate final gym compensation values, i.e. revenue,
        // Allocate that to the product document
        gymDocs.forEach(gymDoc => {
          const id = gymDoc.id
          const { times_visited } = gymDoc.data()

          const fundsMultiplier = times_visited / daysInMonthDivisor

          GYM_REVENUES[ id ] = Math.round(
            (GYM_REVENUES[ id ] || 0)
            + GROSS_COMPENSATIONS[ id ] // + gym gross compensation
            + fundsMultiplier * unallocatedFunds // handling of unallocated funds
          )

          // DEBUG
          gym_docs_done++
        })

        // DEBUG
        DEBUG['MEMBERSHIP_INSTANCES_READ']++
      }

      // const gymDocs = await getBatchOfGyms(userDoc.id)
      const [
        gymDocsOnline,
        gymDocsInstudio,
      ] = await Promise.all([
        getBatchOfGymsOnlineUsage(userDoc.id),
        getBatchOfGymsInstudioUsage(userDoc.id),
      ])

      // Must be sequential (awaited one after the other)
      await coreGymDocAnalyzer(gymDocsOnline)
      if (mode == 'inspect') DEBUG['GYM_REVENUS (1st half)'] = {...GYM_REVENUES}
      await coreGymDocAnalyzer(gymDocsInstudio)
    }

    // DEBUG
    // DEBUG['DOC_LIMIT_TOTAL'] = DOC_LIMIT_TOTAL
    DEBUG['gym_docs_done'] = gym_docs_done
  }

  // DEBUG
  DEBUG['TOTAL_GYMS_REVENUE'] = Object.values(GYM_REVENUES).reduce((total, val) => total + val, 0)
  // DEBUG['GYM_REVENUES'] = GYM_REVENUES
  if (mode == 'inspect') DEBUG['GYM_REVENUES'] = GYM_REVENUES
  // p('GYM_REVENUES', GYM_REVENUES)
  // p('DEBUG', DEBUG)

  await reports.log('__GENERAL', DEBUG)

  switch (mode) {
    case 'commit':
      // [IMPORTANT NOTE]
      // It is vital that throughout the payout process,
      // each payout is being documented as the fn is still executing,
      // on top of that -- written to Firestore PROMPTLY after creation.
      //
      // Thus enabling us to continue if at any very unfortunate point the code breaks,
      // (by checking whether a payout for that date exists already)
      // avoiding having no clue whether a certain partner has been paid or not.
      //
      // Payouts are to be stored in partners/{partnerId}/payouts,
      // and written to after each and every single successful payout.
    
      const existingPayouts = {}
      let x = (await admin.firestore()
        .collectionGroup('payouts')
        .select('metadata')
        .get()
      ).docs.forEach(firebaseDoc => {
        let { metadata: { endDateString }={} } = firebaseDoc.data()
        if (!endDateString) return // I suppose this could be missing, therefore irrelevant
        const partnerId = firebaseDoc.ref.parent.parent.id
        existingPayouts[ partnerId ] = [
          ...(existingPayouts[ partnerId ] || []),
          endDateString,
        ]
      })
    
      const failedPayouts = new Reports(MO_END_DATE_STRING, '_failed_payouts')
      const PAYOUTS_DEBUG = {}
    
      for (const gymId in GYM_REVENUES) {
        // DEBUG
        PAYOUTS_DEBUG['gymId'] = gymId
    
        const partnerFirebaseDoc = (
          await partners
            .where('associated_gyms', 'array-contains', gymId)
            .get()
        ).docs[ 0 ]
    
        // Do not do a payout for this user, if they have already
        // received a payout (or it is on the way)
        if ((existingPayouts[ partnerFirebaseDoc.id ] || []).includes(MO_END_DATE_STRING)) {
          console.log(`partner ${partnerFirebaseDoc.id} has already received a payout! (skipping)`)
          continue
        }
    
        const {
          stripe_account_id: destination,
        } = partnerFirebaseDoc.data()
    
        // DEBUG
        PAYOUTS_DEBUG['stripe_account_id'] = destination
        PAYOUTS_DEBUG['amount'] = GYM_REVENUES[ gymId ]
    
        try {
          const payout = await stripe.transfers.create({
            amount: GYM_REVENUES[ gymId ],
            currency: 'usd',
            destination,
            description: `Imbue monthly payout`,
            metadata: {
              endDateString: MO_END_DATE_STRING,
            },
          })
    
          await partners
            .doc(partnerFirebaseDoc.id)
            .collection('payouts')
            .doc(payout.id)
            .set(payout)
        } catch(err) {
          PAYOUTS_DEBUG['__message'] = err.message || err
          await failedPayouts.log(gymId, PAYOUTS_DEBUG)
          continue
        }
      }
      break
    case 'refresh':
      for (const gymId in GYM_REVENUES) {
        const partnerFirebaseDoc = (
          await partners
            .select('associated_gyms')
            .where('associated_gyms', 'array-contains', gymId)
            .get()
        ).docs[ 0 ]
        await partnerFirebaseDoc.ref.update({
          revenue: GYM_REVENUES[ gymId ]
        })
      }
      break
  }

}
exports.coreCalculatePayouts = coreCalculatePayouts

// exports.calculatePayouts = functions.https.onCall(async (mode, context) => {
//   await coreCalculatePayouts(mode)
// })

/**
 * Runs on the 1st of every month at 00:00
 * Is what makes the payouts to the partners.
 */
exports.scheduleCommitPayouts = functions.pubsub.schedule('0 0 1 * *').onRun(async context => {
  await coreCalculatePayouts('commit')
})

/**
 * Runs every day.
 * Is what updates values, so that partner sees their up-to-date current
 * revenue for the month.
 */
exports.scheduleRefreshRevenueInfos = functions.pubsub.schedule('every 24 hours').onRun(async context => {
  await coreCalculatePayouts('refresh')
})
