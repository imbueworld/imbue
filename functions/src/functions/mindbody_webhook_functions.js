const admin = require('firebase-admin')
const functions = require('firebase-functions')
const {
  classes,
} = require('../Collections')
const {
  p, w, e,
} = require('../HelperFunctions')
const {
  coreSyncMindbodyClasses,
} = require('./mindbody_functions')



/**
 * Sync classes upon a partner linking through Mindbody.
 * Mindbody eventId: `site.created`
 */
exports.webhookSyncMindbodyClasses = functions.https.onRequest(async (req, res) => {
  if (req.method != 'POST') res.send()

  let { siteId } = req.body || {}

  if (!siteId) {
    w('Did not receive the kind of body that was expected.')
    p('body:', req.body)
    res.status(400).send()
  }

  await coreSyncMindbodyClasses(siteId)
})

/**
 * Update some information about the class, but not name or description.
 * Mindbody eventId: `class.updated`
 */
exports.webhookUpdateMindbodyClasses1 = functions.https.onRequest(async (req, res) => {
  if (req.method != 'POST') res.send()

  let {
    classId,
    isCanceled=false,
    startDateTime,
    endDateTime,
    staffName,
  } = req.body || {}

  if (!classId || !startDateTime || !endDateTime || !staffName) {
    w('Did not receive the kind of body that was expected.')
    p('body:', req.body)
    res.status(400).send()
  }

  const newBeginTime = new Date(startDateTime).getTime()
  const newEndTime = new Date(endDateTime).getTime()

  // Retrieve the class that is to be operated on
  // (plus its duplicates, if that ever unfortunately becomes a thing)
  const docs = ( await classes.where('mindbody_id', '==', classId).select('active_times').get() ).docs
  const batch = admin.firestore().batch()

  // Delete the class from Cloud Firestore, if it has been cancelled
  if (isCanceled) {
    for (let firebaseDoc of docs) {
      batch.delete(firebaseDoc.ref)
    }
    await batch.commit()
    res.send()
  }

  // Update necessary class fields accodringly to the just-received information
  // Note: mindbody integrated classes are to have only one active_times entry
  // in our Cloud Firestore
  for (let firebaseDoc of docs) {
    const {
      active_times,
    } = firebaseDoc.data()
    const currentActiveTime = active_times[ 0 ]

    // Check whether the times have been updated at all,
    // only then add to writes
    let { begin_time, end_time } = currentActiveTime
    if (begin_time != newBeginTime || end_time != newEndTime) {
      batch.update(firebaseDoc.ref, {
        active_times: [{
          begin_time: newBeginTime,
          end_time: newEndTime,
          time_id: classId.toString(),
        }],
      })
    }

    // Misc.
    batch.update(firebaseDoc.ref, {
      instructor: staffName,
    })
  }

  await batch.commit()
  res.send()
})

/**
 * Update name and description of the class
 * Mindbody eventId: `classDescription.updated`
 */
exports.webhookUpdateMindbodyClasses2 = functions.https.onRequest(async (req, res) => {
  if (req.method != 'POST') res.send()

  let {
    classId,
    name,
    description,
  } = req.body || {}

  if (!classId || !name || !description) {
    w('Did not receive the kind of body that was expected.')
    p('body:', req.body)
    res.status(400).send()
  }

  // Update necessary classes based on the received information
  const docs = ( await classes.where('mindbody_id', '==', classId).select().get() ).docs
  const batch = admin.firestore().batch()

  for (let firebaseDoc of docs) {
    batch.update(firebaseDoc.ref, {
      name,
      description,
    })
  }

  await batch.commit()
  res.send()
})
