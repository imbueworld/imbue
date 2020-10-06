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
const stripe_customers = admin.firestore().collection('stripe_customers')
const membership_instances = admin.firestore().collection('membership_instances')



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

exports.createStripeSeller = functions.firestore
.document('partners/{partnerId}')
.onCreate(async (snap, context) => {
  const p = console.log
  const e = console.error

  const {
    country,
    address,
    email,
    phone,
    first: first_name,
    last: last_name,
    dob,
    ssn_last_4,
    ip,
  } = snap.data()
  const { params: { partnerId } } = context
  const CURRENT_TS = Math.floor(Date.now() / 1000)

  if (!country) {
    p("country", country)
    e("No country found.")
    return
  }

  // Create Custom Stripe account
  const newStripeAccount = await stripe.accounts.create({
    type: 'custom',
    country,
    email,
    business_type: 'individual',
    individual: {
      address,
      email,
      phone,
      first_name,
      last_name,
      dob,
      ssn_last_4,
    },
    requested_capabilities: [
      'card_payments',
      'transfers',
    ],
    business_profile: {
      mcc: '7941', // stands for "Sports Clubs/Fields"
      url: 'https://imbuefitness.com', // default url, changeable in the future
    },
    tos_acceptance: {
      date: CURRENT_TS,
      ip,
    },
  })

  // Save seller stripe account id to their doc
  const { id: stripe_account_id } = newStripeAccount
  await partners.doc(partnerId).set({
    stripe_account_id,
    ip: admin.firestore.FieldValue.delete(),
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
 * Charges the user.
 * 
 * params
 *  data: { cardId, amount, description }
 */
exports.chargeCustomer = functions.https.onCall(async ({ amount, cardId, description }, context) => {
  const uid = context.auth.uid

  const customerData = (await admin
    .firestore()
    .collection("stripe_customers")
    .doc(uid)
    .get()
  ).data()

  const payment = await stripe.charges.create({
    amount: amount,
    currency: "usd",
    customer: customerData.customer_id,
    source: cardId,
    description: description,
  })

  await admin
    .firestore()
    .collection('stripe_customers')
    .doc(uid)
    .collection('payments')
    .add(payment)

  return "200 OK"
})

exports.subscribeCustomer = functions.https.onCall(async ({ gymId, amount, cardId, description }, context) => {
  const uid = context.auth.uid

  let customerGet = admin
    .firestore()
    .collection("stripe_customers")
    .doc(uid)
    .get()

  let gymGet = admin
    .firestore()
    .collection("gyms")
    .doc(gymId)
    .get()

  let res = await Promise.all([
    customerGet,
    gymGet,
  ])

  const customer = res[0].data()
  const gymDoc = res[1].data()
  
  let productId = gymDoc.product_id || null
  if (!productId) {
    const product = await stripe.products.create({
      name: `${gymDoc.name} Gym Online Membership`,
      description: `Grants access to all online content that the gym provides.`,
    })

    admin.firestore().collection("gyms").doc(gymId).set({
      product_id: product.id
    }, { merge: true })

    productId = product.id
    console.log(`[${gymDoc.id}] Creating new Product Object`)
  } else console.log(`[${gymDoc.id}] Using existing Product Object`)

  const sub = await stripe.subscriptions.create({
    customer: customer.customer_id,
    items: [
      {
        price_data: {
          currency: "usd",
          product: productId,
          recurring: {
            interval: "month",
          },
          unit_amount: amount,
        },
      }
    ],
    default_source: cardId,
    metadata: {
      description,
      gym_id: gymId,
    },
  })

  await admin
    .firestore()
    .collection('stripe_customers')
    .doc(uid)
    .collection('subscriptions')
    .add({
      ...sub,
      gym_id: gymId,
    })

  return "200 OK"
})

exports.deleteSubscription = functions.https.onCall(async ({ gymIds }, context) => {
  const uid = context.auth.uid
  const collRef = admin
    .firestore()
    .collection("stripe_customers")
    .doc(uid)
    .collection("subscriptions")

  let updateables = []
  const subIds = (await collRef
    .where("gym_id", "in", gymIds)
    .get()
  ).docs
    .filter(doc => doc.data().status === "active")
    .map(doc => {
      updateables.push(doc.id)
      return doc.data().id
    })

  let promises
  promises = []
  subIds.forEach(id => {
    promises.push(
      stripe.subscriptions.del(id)
    )
  })
  let res = await Promise.all(promises)

  promises = []
  updateables.forEach((id, idx) => {
    promises.push(
      collRef.doc(id).update(res[idx])
    )
  })
  await Promise.all(promises)
})

exports.documentClassPurchase = functions.https.onCall(async ({ classId, timeId, partnerId, amount, user }, context) => {
  const uid = context.auth.uid
  const currentTimestamp = Date.now()
  
  const activeTimesCollectionRef = admin
    .firestore()
    .collection("classes")
    .doc(classId)
    .collection("active_times")
  const clientDocRef = admin
    .firestore()
    .collection("classes")
    .doc(classId)
    .collection("active_times")
    .doc(timeId)
    .collection("clients")
    .doc(uid)
  
  const partnerDocRef = admin
    .firestore()
    .collection("partners")
    .doc(partnerId)

  // Increase pratner's revenue appropriately
  const partnerDoc = ( await partnerDocRef.get() ).data()
  let revenue_total = partnerDoc.revenue_total || 0
  let revenue = partnerDoc.revenue || 0
  await partnerDocRef
    .set({
      revenue_total: revenue_total + amount,
      revenue: Math.round(revenue + (amount * 0.8))
    }, { merge: true })

  // Document the user buying the class inside of active_times in the class doc
  // const user = ( await admin.firestore().collection("users").doc(uid).get() ).data()
  let { first, last, icon_uri } = user
  await clientDocRef
    .set({
      purchase_timestamp: currentTimestamp,
      purchase_method: "class",
      scheduled: true,
      first,
      last,
      icon_uri,
    }, { merge: true })

  // Get current clients
  // const timeDoc = (await activeTimesCollectionRef
  //   .doc(timeId)
  //   .get()
  // )
  // let clients = []
  // if (timeDoc.exists) clients = timeDoc.data().clients

  // Do not add a duplicate, return if caught
  // let duplicate = false
  // clients.forEach(doc => {
  //   if (doc.user_id === uid) duplicate = true
  // })
  // if (duplicate) return

  // Update databases
  // activeTimesCollectionRef
  //   .doc(timeId)
  //   .set({
  //     clients: [
  //       ...clients,
  //       {
  //         user_id: uid,
  //         timestamp: currentTimestamp,
  //         // purchase_method: "class",
  //       },
  //     ],
  //   }, { merge: true })
})

exports.documentMembershipPurchase = functions.https.onCall(async ({ partnerId, gymId, amount }, context) => {
  const uid = context.auth.uid
  // const currentTimestamp = Date.now()

  // partnerId should only be absent on Imbue Universal Gym Membership purchase
  if (partnerId) {
    const partnerDocRef = admin
      .firestore()
      .collection("partners")
      .doc(partnerId)

    const partnerDoc = ( await partnerDocRef.get() ).data()
    let revenue_total = partnerDoc.revenue_total || 0
    let revenue = partnerDoc.revenue || 0
    await partnerDocRef
      .set({
        revenue_total: revenue_total + amount,
        revenue: Math.round(revenue + (amount * 0.8))
      }, { merge: true })
  }

  const gymDocRef = admin
    .firestore()
    .collection("gyms")
    .doc(gymId)
  
  // Get current data
  const gymDoc = ( await gymDocRef.get() ).data()
  const activeClientsMemberships = gymDoc.active_clients_memberships || []

  // Do not add duplicate, return if caught
  if (activeClientsMemberships.includes(uid)) return

  // Update database
  await gymDocRef.set({
    active_clients_memberships: [
      ...activeClientsMemberships,
      uid
    ]
  }, { merge: true })
})

exports.documentScheduledClass = functions.https.onCall(async ({ classId, timeId, user }, context) => {
  const uid = context.auth.uid
  const clientDocRef = admin
    .firestore()
    .collection("classes")
    .doc(classId)
    .collection("active_times")
    .doc(timeId)
    .collection("clients")
    .doc(uid)
  
  // const user = ( await admin.firestore().collection("users").doc(uid).get() ).data()
  let { first, last, icon_uri } = user
  
  await clientDocRef.set({
    purchase_method: "membership",
    scheduled: true,
    first,
    last,
    icon_uri,
  }, { merge: true })
})



/**
 * To keep on top of errors, we should raise a verbose error report with Stackdriver rather
 * than simply relying on console.error. This will calculate users affected + send you email
 * alerts, if you've opted into receiving them.
 */

// [START reporterror]

function reportError(err, context = {}) {
  // This is the name of the StackDriver log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain "err"
  // in order for the error to be picked up by StackDriver Error Reporting.
  const logName = 'errors';
  const log = logging.log(logName);

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: 'cloud_function',
      labels: { function_name: process.env.FUNCTION_NAME },
    },
  };

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: 'cloud_function',
    },
    context: context,
  };

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), (error) => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}

// [END reporterror]

/**
 * Sanitize the error message for the user.
 */
function userFacingMessage(error) {
  return error.type
    ? error.message
    : 'An error occurred, developers have been alerted';
}
