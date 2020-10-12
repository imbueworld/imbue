const { Reports } = require("../Reports")



//
// NOT READY FOR DEPLOYMENT
//
//
//
//
//
//
//
//
//
//
//
//
/**
 * Calculates all payout information for each gym by going through
 * membership_instances collection.
 */
exports.calculatePayouts = async function(mode) {
  if (mode != 'inspection' && mode != 'commitment') throw 'ValueError on param mode.'

  const DOC_LIMIT_TOTAL = 50
  const DOC_LIMIT_BATCH = 3
  const CURR_DATE_STRING = getEndStringDateOfLastMonth()
  const DAYS_IN_MONTH = 30
  const IMBUE_UNIVERSAL_PRICE = ( await gyms.doc('imbue').get() ).data().membership_price
  let lastFirebaseDoc
  let gym_docs_done = 0
  const GYM_REVENUES = {} // product, final goal
  // DEBUG VARIABLES
  const reports = new Reports(CURR_DATE_STRING, 'payouts', 5)
  await reports.deleteLogs()
  const DEBUG = {
    MEMBERSHIP_INSTANCES_READ: 0,
    TOTAL_IMBUE_REVENUE: 0,
  }

  // DEBUG
  DEBUG['CURR_DATE_STRING'] = CURR_DATE_STRING
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

  async function getBatchOfGyms(userId) {
    return (await membership_instances
      .doc(userId)
      .collection('visits')
      .doc(CURR_DATE_STRING)
      .collection('gyms')
      .get()
    ).docs
  }

  while(true && DOC_LIMIT_TOTAL > gym_docs_done) {
    const userDocs = await getBatchOfUsers(lastFirebaseDoc)
    if (!userDocs.length) break
    lastFirebaseDoc = userDocs[ userDocs.length - 1 ]

    usersLoop: for (let userDoc of userDocs) {
      // DEBUG VARIABLES
      const USER_DEBUG = {
        // At the end of code execution for that user,
        // this should become exactly how much Imbue gets for each user.
        USER_MONEY_INPUT: IMBUE_UNIVERSAL_PRICE,
      }

      const gymDocs = await getBatchOfGyms(userDoc.id)

      // Determine total visits by the user to all gyms combined
      const TOTAL_VISITS = gymDocs.reduce((totalVisits, gymDoc) => {
        return totalVisits + gymDoc.data().times_visited
      }, 0)

      // DEBUG
      USER_DEBUG['TOTAL_VISITS'] = TOTAL_VISITS
      if (TOTAL_VISITS <= 0) {
        USER_DEBUG['__message'] = 'Total visits cannot be 0 or negative.'
        await reports.log(userDoc.id, USER_DEBUG)
        continue usersLoop
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
          continue usersLoop
        }
        if (timesVisited < 0) {
          USER_GYM_DEBUG['__message'] = 'Times visited cannot be a negative number.'
          await reports.log(userDoc.id, USER_GYM_DEBUG)
          continue usersLoop
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
        USER_DEBUG['USER_MONEY_INPUT'] -= Math.round(GROSS_COMPENSATIONS[ id ] + fundsMultiplier * unallocatedFunds)
      })

      // DEBUG
      DEBUG['MEMBERSHIP_INSTANCES_READ']++
      DEBUG['TOTAL_IMBUE_REVENUE'] += USER_DEBUG['USER_MONEY_INPUT']
      p('USER_DEBUG', USER_DEBUG)
    }

    gym_docs_done += DOC_LIMIT_BATCH

    // DEBUG
    DEBUG['DOC_LIMIT_TOTAL'] = DOC_LIMIT_TOTAL
    DEBUG[`gym_docs_done (+0/-${DOC_LIMIT_BATCH - 1})`] = gym_docs_done
  }

  // DEBUG
  DEBUG['TOTAL_GYMS_REVENUE'] = Object.values(GYM_REVENUES).reduce((total, val) => total + val)
  p('GYM_REVENUES', GYM_REVENUES)
  p('DEBUG', DEBUG)

  await reports.log('__GENERAL', DEBUG)



  // Continue with documenting all the payouts,
  // once manual review has been done and fn is run with mode commitment
  if (mode != 'commitment') return

  for (const gymId in GYM_REVENUES) {
    // Commitment stuff with Stripe API
    // here...
  }
}
