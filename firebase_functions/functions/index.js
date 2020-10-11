'use strict';

const algoliasearch = require('algoliasearch')
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const { Logging } = require('@google-cloud/logging');
const logging = new Logging({
  projectId: process.env.GCLOUD_PROJECT,
});
const stripe = require('stripe')(functions.config().stripe.secret, {
  apiVersion: '2020-03-02',
});



const MUX_TOKEN_ID = '45fba3d3-8c60-48c6-a767-e87270351be8'
const MUX_TOKEN_SECRET = 'XRuq11za83MwMYHgbhYYKwktVG7v0bkmHajeB2YglnRZhzPyN85XL5C3oKAog2oGUS3yzo9i9EP'

const GOOGLE_API_KEY = 'AIzaSyBjP2VSTSNfScD2QsEDN1loJf8K1IlM_xM'

const ALGOLIA_ID = 'K75AA7U1MZ'
const ALGOLIA_ADMIN_KEY = 'adc88238cd4fee1c06aec6f83f594870'
const ALGOLIA_SEARCH_KEY = 'c25a5639752b7ab096eeba92f81e99b6'

const ALGOLIA_GYM_INDEX = 'gyms'
const algoliaClient = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY)



const users = admin.firestore().collection('users')
const partners = admin.firestore().collection('partners')
const classes = admin.firestore().collection('classes')
const gyms = admin.firestore().collection('gyms')
//
const membership_instances = admin.firestore().collection('membership_instances')
const stripe_customers = admin.firestore().collection('stripe_customers')
const stripe_products = admin.firestore().collection('stripe_products')
const stripe_prices = admin.firestore().collection('stripe_prices')



function _extractOnlyData(snapshots) {
  snapshots.forEach((item, idx, arr) => {
    arr[ idx ] = item.data() || {}
  })
  return snapshots
}

/**
 * @returns {String} `mm-dd-yyy`
 */
function getEndStringDateOfLastMonth(offset=0) {
  const currentUTCDate = new Date()
  // Last day of last month format, turning it into
  const formattedUTCDate = new Date(Date.UTC(
    currentUTCDate.getUTCFullYear(),
    currentUTCDate.getUTCMonth() + offset,
    0
  ))

  let mm = (formattedUTCDate.getUTCMonth() + 1).toString()
  if (mm.length < 2) mm = `0${mm}` // ascertain two digits
  let dd = formattedUTCDate.getUTCDate().toString()
  if (dd.length < 2) dd = `0${dd}` // ascertain two digits
  let yyyy = formattedUTCDate.getUTCFullYear()

  return `${mm}_${dd}_${yyyy}`
}



/**
 * Calculates all payout information for each gym by going through
 * membership_instances collection.
 * 
 * Objectives for full formula calculation (per user):
 * -  Calculate total visits for user,
 * -  Calculate total visits to all other gyms (per gym),
 * -  Pull gym membership price (per gym),
 * 
 * Write and Read data:
 * -  ..
 * -  ..
 * Total: 
 */
// exports.calculatePayouts = functions.https.onCall(async (data, context) => {
//   async function getBatch(last='') {
//     return (await membership_instances
//       .orderBy('id')
//       .startAfter(last)
//       .limit(50)
//       .get()
//     ).docs
//   }

//   let lastFirebaseDoc

//   const docs = await getBatch(lastFirebaseDoc)
// })

exports.createLivestream = functions.https.onCall(async (data, context) => {
  const { uid } = context.auth
  const { gymId } = data

  let xhr = new XMLHttpRequest()
  xhr.onload = async () => {
    let data = JSON.parse(xhr.responseText).data
    let { stream_key, playback_ids } = data
    let playback_id = playback_ids[ 0 ].id

    // Saving of the stream_key,
    // and playback_id, just in case it is ever needed for partner
    await admin
      .firestore()
      .collection("partners")
      .doc(uid)
      .set({
        stream_key,
        playback_id,
      }, { merge: true })
    
    // Making playback_id accessible to users
    await admin
      .firestore()
      .collection('gyms')
      .doc(gymId)
      .set({
        playback_id,
      }, { merge: true })
  }


  xhr.open(
    "POST",
    "https://api.mux.com/video/v1/live-streams",
    true, MUX_TOKEN_ID, MUX_TOKEN_SECRET)
  xhr.setRequestHeader("Content-Type", "application/json")
  xhr.send(JSON.stringify({
    "playback_policy": ["public"],
    "new_asset_settings": {
      "playback_policy": ["public"]
    }
  }))

  await new Promise(r => setTimeout(r, 4500))
})

/**
 * When a user is created, create a Stripe customer object for them.
 *
 * @see https://stripe.com/docs/payments/save-and-reuse#web-create-customer
 */
exports.createStripeCustomer = functions.auth.user().onCreate(async (user) => {
  const customer = await stripe.customers.create({ email: user.email });
  await admin.firestore().collection('stripe_customers').doc(user.uid).set({
    customer_id: customer.id,
  });

  const defaultIcon = "default-icon.png"

  await admin
    .firestore("users")
    .doc(user.uid)
    .set({
      icon_uri: defaultIcon,
    }, { merge: true })

  return;
});

exports.createStripeSeller = functions.https.onCall(async (data, context) => {
  const p = console.log
  const e = console.error

  const { auth: { uid } } = context
  const {
    // Company details
    company_address,
    company_name,
    product_description,
    tax_id,

    // Person details
    first: first_name,
    last: last_name,
    email,
    phone,
    dob,
    address,
    ssn_last_4,

    // TOS agreement
    ip,
  } = data
  const CURRENT_TS = Math.floor(Date.now() / 1000)

  // Create Custom Stripe account
  const newStripeAccount = await stripe.accounts.create({
    type: 'custom',
    country: company_address.country,
    email,
    business_type: 'company',
    company: {
      name: company_name,
      address: company_address,
      phone,
      tax_id,
    },
    requested_capabilities: [
      'card_payments',
      'transfers',
    ],
    business_profile: {
      mcc: '7941', // stands for "Sports Clubs/Fields"
      product_description,
    },
    tos_acceptance: {
      date: CURRENT_TS,
      ip,
    },
  })
  
  // p("newStripeAccount success")
  const { id: stripe_account_id } = newStripeAccount

  // Create a Stripe Person, linking it to the Custom Account
  const newStripePerson = await stripe.accounts.createPerson(
    stripe_account_id,
    {
      address,
      first_name,
      last_name,
      email,
      phone,
      dob,
      ssn_last_4,
      relationship: {
        title: 'Owner',
        owner: true,
        representative: true,
        executive: true,
      },
    }
  )

  // p("newStripePerson success")
  const { id: stripe_person_id } = newStripePerson
  
  // Update the Custom Account, telling that person has been successfully created
  await stripe.accounts.update(
    stripe_account_id,
    {
      company: {
        owners_provided: true,
        executives_provided: true,
      },
    }
  )

  // Save seller stripe account id to their doc
  await partners.doc(uid).set({
    stripe_account_id,
    stripe_person_id,
  }, { merge: true })
})

/**
 * Sets the [id] field inside of the document to that of doc's actual id, for ease of access
 */
exports.populateGym = functions.firestore
  .document('gyms/{gymId}')
  .onCreate(async (snap, context) => {
    snap.ref.set({ id: snap.id }, { merge: true })

    // Enabling Algolia-provided search service
    const gym = snap.data()
    gym.id = snap.id
    gym.objectID = snap.id

    // Saving index
    const index = algoliaClient.initIndex(ALGOLIA_GYM_INDEX)
    return index.saveObject(gym)
  })

exports.cleanUpAfterGym = functions.firestore
  .document('gyms/{gymId}')
  .onDelete(async (snap, context) => {
    const { id: gymId } = snap

    // Delete Algolia search index
    const index = algoliaClient.initIndex(ALGOLIA_GYM_INDEX)
    return index.deleteObject(gymId)
  })

exports.updateGym = functions.firestore
  .document('gyms/{gymId}')
  .onUpdate(async (snap, context) => {
    const { id: gymId } = snap.after

    // Update Algolia search index
    const index = algoliaClient.initIndex(ALGOLIA_GYM_INDEX)
    return index.partialUpdateObject({
      ...snap.after.data(),
      objectID: gymId,
    }, {
      createIfNotExists: true,
    })
  })

/**
 * Sets the [id] field inside of the document to that of doc's actual id, for ease of access
 */
exports.populateClasses = functions.firestore
  .document('classes/{classId}')
  .onCreate(async (snap, context) => {
    snap.ref.set({ id: snap.id }, { merge: true })
  })

/**
 * Sets the [id] field inside of the document to that of doc's actual id, for ease of access
 */
exports.populateUsers = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    snap.ref.set({ id: snap.id }, { merge: true })
  })

/**
 * Sets the [id] field inside of the document to that of doc's actual id, for ease of access
 */
exports.populatePartners = functions.firestore
  .document('partners/{partnerId}')
  .onCreate(async (snap, context) => {
    snap.ref.set({ id: snap.id }, { merge: true })
  })

/**
 * When 3D Secure is performed, we need to reconfirm the payment
 * after authentication has been performed.
 *
 * @see https://stripe.com/docs/payments/accept-a-payment-synchronously#web-confirm-payment
 */
exports.confirmStripePayment = functions.firestore
  .document('stripe_customers/{userId}/payments/{pushId}')
  .onUpdate(async (change, context) => {
    if (change.after.data().status === 'requires_confirmation') {
      const payment = await stripe.paymentIntents.confirm(
        change.after.data().id
      );
      change.after.ref.set(payment);
    }
  });

/**
 * When a user deletes their account, clean up after them
 */
exports.cleanupUser = functions.auth.user().onDelete(async (user) => {
  const dbRef = admin.firestore().collection('stripe_customers');
  const customer = (await dbRef.doc(user.uid).get()).data();
  await stripe.customers.del(customer.customer_id);
  // Delete the customers payments & payment methods in firestore.
  const snapshot = await dbRef
    .doc(user.uid)
    .collection('payment_methods')
    .get();
  snapshot.forEach((snap) => snap.ref.delete());
  await dbRef.doc(user.uid).delete();

  // If the user was a normal user, the data is deleted from there
  await admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .delete()

  // If the user was a partner, the data is deleted from there
  await admin
    .firestore()
    .collection("partners")
    .doc(user.uid)
    .delete()

  return;
})

exports.cleanUpAfterPartner = functions.firestore
  .document('partners/{partnerId}')
  .onDelete(async (snap, context) => {
    const { stripe_account_id } = snap.data()
    if (stripe_account_id) {
      const res = await stripe.accounts.del(stripe_account_id)
      // const { deleted } = res || {}
    }
  })

/**
 * Must ONLY be called when membership_price has been set in gym doc.
 */
exports.createGymProduct = functions.https.onCall(async (data, context) => {
  const p = console.log

  const { gymId } = data

  const {
    name: gymName,
    membership_price: unit_amount,
  } = (
    await gyms
      .doc(gymId)
      .get()
  ).data()

  p('gymName', gymName)
  p('membership_price', unit_amount)
  if (!unit_amount) {
    console.error('membership_price not in gym doc.')
    return
  }

  const product = await stripe.products.create({
    id: gymId,
    name: `Imbue, Gym Online Membership — ${gymName}`,
    description: `Grants access to all online content that ${gymName} provide.`,
  })

  const recurringPrice = await stripe.prices.create({
    product: gymId,
    currency: 'usd',
    unit_amount,
    recurring: {
      interval: 'month',
    },
    nickname: `Monthly price — ${gymName}`, // Dev-side info
  })

  await Promise.all([
    stripe_products
      .doc(gymId)
      .set(product),
    stripe_prices
      .doc(gymId)
      .set(recurringPrice),
  ])
})

/**
 * Adds a payment method for the user.
 */
exports.addPaymentMethod = functions.https.onCall(async (data, context) => {
  // Authentication / user information is automatically added to the request.
  const uid = context.auth.uid

  console.log("Form data: ", data)

  const customerData =
    (await admin
      .firestore()
      .collection("stripe_customers")
      .doc(uid)
      .get()
    ).data()

  const createRes = await stripe.tokens.create({
    card: {
      object: "card",
      number: data.cardNumber,
      exp_month: data.expMonth,
      exp_year: data.expYear,
      cvc: data.cvc,
      name: data.cardholderName,
      address_zip: data.zip,
    }
  })

  const token = createRes.id
  console.log("credit card token", token)

  const paymentMethod = await stripe.customers.createSource(
    customerData.customer_id,
    { source: token }
  )
  console.log("stripe.createSource()", paymentMethod)

  await admin
    .firestore()
    .collection('stripe_customers')
    .doc(uid)
    .collection('payment_methods')
    .add(paymentMethod)

  return paymentMethod
})

/**
 * One Time Class Purchase
 * Used to charge a known (added) user's credit card.
 */
exports.purchaseClassWithPaymentMethod = functions.https.onCall(async (data, context) => {
  const p = console.log

  const { auth: { uid } } = context
  const {
    paymentMethodId,
    classId,
    timeId,
  } = data
  const IMBUE_PERCENTAGE_CUT = 0.05

  // Do not continue if insufficient parameters
  if (!paymentMethodId || !classId || !timeId)
    throw 'Insufficient params.'

  const { active_classes=[] } = (
    await users
      .doc(uid)
      .get()
  ).data()

  // Do not continue if class, for whatever reason, is already registered.
  active_classes.forEach(({ class_id, time_id }) => {
    if (class_id == classId && time_id == timeId)
      throw 'Class already owned.'
  })

  const { id: source, customer } = (
    await stripe_customers
      .doc(uid)
      .collection('payment_methods')
      .doc(paymentMethodId)
      .get()
  ).data()

  p('source', source)
  p('customer', customer)

  const {
    price: amount,
    name: className,
    partner_id: partnerId,
  } = (
    await classes
      .doc(classId)
      .get()
  ).data()

  p('price', amount)
  p('className', className)
  p('partner_id', partnerId)

  const { stripe_account_id: destination } = (
    await partners
      .doc(partnerId)
      .get()
  ).data()

  p('stripe_account_id', destination)
  
  // variable is INCOMPLETE
  const application_fee_amount = Math.floor(IMBUE_PERCENTAGE_CUT * amount)
  p('application_fee_amount', application_fee_amount)

  if (
    !amount || !customer || !source
    || !destination || !application_fee_amount
  ) throw 'Values can\'t be empty.'

  const payment = await stripe.charges.create({
    currency: 'usd',
    amount,
    customer,
    source,
    description: `Imbue, One Time Class Purchase — ${className}`,
    transfer_data: {
      destination,
    },
    application_fee_amount,
  })

  stripe_customers
    .doc(uid)
    .collection('payments')
    .doc(payment.id)
    .set(payment)
})

exports.purchaseMembership = functions.https.onCall(async (data, context) => {
  const p = console.log
  const e = console.error

  const { auth: { uid } } = context
  const {
    paymentMethodId,
    gymId,
  } = data

  p('gymId', gymId)

  // Do not continue if insufficient parameters have been provided.
  if (!paymentMethodId || !gymId) throw 'Insufficient params.'

  const { active_memberships=[] } = (
    await users
      .doc(uid)
      .get()
  ).data()

  // Do not continue if, for whatever reason, membership is already owned.
  active_memberships.forEach(gym_id => {
    if (gym_id == gymId) throw 'Membership already owned.'
  })

  const [
    { customer, id: default_source },
    { id: price },
    { partner_id: partnerId },
  ] = _extractOnlyData(
    await Promise.all([
      stripe_customers
        .doc(uid)
        .collection('payment_methods')
        .doc(paymentMethodId)
        .get(),
      stripe_prices
        .doc(gymId)
        .get(),
      gyms
        .doc(gymId)
        .get(),
    ])
  )

  p('partnerId', partnerId)

  const { stripe_account_id: destination } = (
    await partners
      .doc(partnerId)
      .get()
  ).data()

  p('customer_id', customer)
  p('default_source_id', default_source)
  p('price_id', price)
  p('destination', destination)
  if (!customer) e('customer_id not found.')
  if (!default_source) e('default_source_id not found.')
  if (!price) e('price_id not found.')
  if (!destination) e('destination not found.')
  if (!customer || !default_source
    || !price || !destination) throw 'Values listed above cannot be empty.'
  
  const subscription = await stripe.subscriptions.create({
    customer,
    default_source,
    items: [{ price }],
    transfer_data: {
      destination,
    },
    application_fee_percent: 5,
  })

  await Promise.all([
    stripe_customers
      .doc(uid)
      .collection('subscriptions')
      .doc(gymId)
      .set(subscription)
  ])
})

exports.cancelMembership = functions.https.onCall(async (data, context) => {
  const { auth: { uid } } = context
  const { gymId } = data

  const { id: subId } = (
    await stripe_customers
      .doc(uid)
      .collection('subscriptions')
      .doc(gymId)
      .get()
  ).data()

  const subscription = await stripe.subscriptions.del(subId)

  // Update subscription object
  await stripe_customers
    .doc(uid)
    .collection('subscriptions')
    .doc(gymId)
    .set(subscription)
})

/**
 * Assumes that if 'imbue' is in USER_DOC.active_memberships,
 * the user is scheduling on the grounds of having Imbue UGM,
 * otherwise -- Gym Online Membership.
 * Read more about determining purchase_type inside of fn code.
 * 
 * Currently scheduling a class is handled by storing it in
 * USER_DOC.scheduled_classes (Array).
 * 
 * *Perhaps* this should be done by creating Schedule objects inside of a new
 * collection 'scheduled_classes'.
 * 
 * Right now, listening to USER_DOC updates.
 * 
 * ____
 * scheduled_classes is Array == [{ class_id, time_id }, ..]
 */
exports.completeClassSignUp = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (snap, context) => {
    const p = console.log
    
    const { params: { userId } } = context
    const {
      scheduled_classes: prevScheduledClasses,
      active_classes: prevActiveClasses,
    } = snap.before.data()
    const {
      scheduled_classes: currScheduledClasses,
      active_classes: currActiveClasses,
      active_memberships,
    } = snap.after.data()
    const timestamp = Date.now()
    const CURR_END_DATE_STRING = getEndStringDateOfLastMonth(1)

    // Determine new active_classes (related to One Time Class Purchase)
    const newlyActivatedClasses = currActiveClasses.filter(({
      class_id,
      time_id,
    }) => {
      let isNew = true
      prevActiveClasses.forEach(({
        class_id: class_id_existing,
        time_id: time_id_existing,
      }) => {
        if (
          class_id == class_id_existing
          && time_id == time_id_existing
        ) isNew = false
      })
      if (isNew) return true
    })

    p('newlyActivatedClasses', newlyActivatedClasses)

    /**
     * purchase_method is determined as follows:
     * 1. if there is a new item in active_classes,
     *    assume -- 'class'
     * 2. otherwise, if 'imbue' in active_memberships,
     *    assume -- 'imbue_membership'
     * 3. else,
     *    assume -- 'gym_membership'
     */
    const purchase_method =
      newlyActivatedClasses.length
        ? 'class'
        : active_memberships.includes('imbue')
            ? 'imbue_membership'
            : 'gym_membership'

    p('purchase_method', purchase_method)

    // Determine newly scheduled classes (core way of determining new classes)
    const newlyScheduledClasses = currScheduledClasses.filter(({
      class_id,
      time_id,
    }) => {
      let isNew = true
      prevScheduledClasses.forEach(({
        class_id: class_id_existing,
        time_id: time_id_existing,
      }) => {
        if (
          class_id == class_id_existing
          && time_id == time_id_existing
        ) isNew = false
      })
      if (isNew) return true
    })

    p('newlyScheduledClasses', newlyScheduledClasses)
    // If there are no new classes, return
    if (!newlyScheduledClasses.length) return

    const { first, last, icon_uri } = (
      await users
        .doc(userId)
        .get()
    ).data()

    const batch = admin.firestore().batch()

    for (let { class_id, time_id } of newlyScheduledClasses) {
      batch.set(
        classes
          .doc(class_id)
          .collection('active_times')
          .doc(time_id)
          .collection('clients')
          .doc(userId),
        {
          purchase_method,
          timestamp,
          first,
          last,
          icon_uri,
        }
      )

      // Increment times_visited in membership_instances to track membership usage by the user
      const { gym_id: gymId } = ( await classes.doc(class_id).get() ).data()
      const { membership_price: membership_price_paid } = ( await gyms.doc(gymId).get() ).data()

      p('gymId', gymId)
      p('membership_price_paid', membership_price_paid)
      p('CURR_END_DATE_STRING', CURR_END_DATE_STRING)

      batch.set(
        membership_instances
          .doc(userId)
          .collection('visits')
          .doc(CURR_END_DATE_STRING)
          .collection('gyms')
          .doc(gymId),
        {
          membership_price_paid,
          times_visited: admin.firestore.FieldValue.increment(1),
        },
        { merge: true }
      )
    }

    await batch.commit()
  })






// /**
//  * To keep on top of errors, we should raise a verbose error report with Stackdriver rather
//  * than simply relying on console.error. This will calculate users affected + send you email
//  * alerts, if you've opted into receiving them.
//  */

// function reportError(err, context = {}) {
//   // This is the name of the StackDriver log stream that will receive the log
//   // entry. This name can be any valid log stream name, but must contain "err"
//   // in order for the error to be picked up by StackDriver Error Reporting.
//   const logName = 'errors';
//   const log = logging.log(logName);

//   // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
//   const metadata = {
//     resource: {
//       type: 'cloud_function',
//       labels: { function_name: process.env.FUNCTION_NAME },
//     },
//   };

//   // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
//   const errorEvent = {
//     message: err.stack,
//     serviceContext: {
//       service: process.env.FUNCTION_NAME,
//       resourceType: 'cloud_function',
//     },
//     context: context,
//   };

//   // Write the error log entry
//   return new Promise((resolve, reject) => {
//     log.write(log.entry(metadata, errorEvent), (error) => {
//       if (error) {
//         return reject(error);
//       }
//       return resolve();
//     });
//   });
// }

// /**
//  * Sanitize the error message for the user.
//  */
// function userFacingMessage(error) {
//   return error.type
//     ? error.message
//     : 'An error occurred, developers have been alerted';
// }
