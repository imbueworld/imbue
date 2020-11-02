const admin = require('firebase-admin')
const functions = require('firebase-functions')
const Mindbody = require('../Mindbody').Mindbody
const Reports = require('../Reports').Reports
const {
  partners,
  classes,
  users,
} = require('../Collections')
const {
  p,
  getDateStringOfTimestamp,
} = require('../HelperFunctions')



/**
 * Field 'mindbody_site_id' on the partner doc must be filled,
 * in order for this fn to work.
 */
exports.getMindbodyActivationCode = functions.https.onCall(async (data, context) => {
  const { auth: { uid } } = context
  let {
    test=false, // Boolean
    siteId, // String
  } = data || {}

  if (!siteId) throw 'siteId was not provided.'

  const mindbody = new Mindbody(test)
  mindbody.setRequestHeader('SiteId', siteId)
  const res = await mindbody.getActivationCode()

  // Update partner's doc with their just-validated siteId
  await partners.doc(uid).update({ mindbody_site_id: siteId })

  return res
})

/**
 * @param {Object} queryParams
 * Specifies how to retrieve the Mindbody classes
 * @see https://developers.mindbodyonline.com/PublicDocumentation/V6?python#get-classes
 */
exports.coreSyncMindbodyClasses = async (siteId, queryParams={}) => {
  const DEBUG = {}
  const reports = new Reports(getDateStringOfTimestamp(), 'mindbody_syncMindbodyClasses')

  const partnerDocs = (
    await partners
      .where('mindbody_site_id', '==', siteId)
      .select('associated_classes', 'associated_gyms')
      .get()
  ).docs

  if (!partnerDocs.length) {
    DEBUG['__message'] = 'mindbody_site_id was not found on any single partner doc.'
    await reports.log(siteId, DEBUG, true)
  }

  const {
    associated_classes=[],
    associated_gyms=[],
  } = partnerDocs[ 0 ].data() // There should be only one doc that was found.
                              // This could also not be the case, but only if
                              // partner tried using siteId on another account.

  const uid = partnerDocs[ 0 ].id
  const gymId = associated_gyms[ 0 ] // Currently App functions with 1 gym per partner

  const mindbody = new Mindbody()
  mindbody.setRequestHeader('SiteId', siteId)
  await mindbody.useSourceCredentials()
  const mindbodyClasses = await mindbody.retrieveClasses(queryParams)

  const batch = admin.firestore().batch()
  let newlyAssociatedClasses = []

  for (let classDoc of mindbodyClasses) {
    let {
      Id,
      StartDateTime=null,
      EndDateTime=null,
      ClassDescription: {
        Program: {
          // A potential way to determine whether class type is 'Online' or
          // 'In Studio'
          // But.. only known values, currently: ['InPerson', ..?]
          ContentFormats=[],
        }={},
        Description='',
        Name='',
      }={},
      Staff: {
        Name: instructor='',
      }={},
      //
      Clients=[],
    } = classDoc

    // Generate a ClassId by combining partner's uid,
    // and the provided class id by Mindbody
    let ClassId = `${uid}_${Id}`
    newlyAssociatedClasses.push(ClassId)

    DEBUG['ClassId'] = ClassId
    DEBUG['StartDateTime'] = StartDateTime
    DEBUG['EndDateTime'] = EndDateTime

    if (!StartDateTime || !EndDateTime) {
      DEBUG['__message'] = 'StartDateTime & EndDateTime cannot be empty.'
      await reports.log(ClassId, DEBUG)
      continue
    }

    let begin_time = new Date(StartDateTime).getTime()
    let end_time = new Date(EndDateTime).getTime()

    // Add the class to Imbue's Cloud Firestore
    batch.set(classes.doc(ClassId), {
      id: ClassId,
      active_times: [{
        begin_time,
        end_time,
        time_id: Id.toString(),
      }],
      description: Description,
      instructor,
      name: Name,
      genres: [],
      gym_id: gymId,
      partner_id: uid,
      // unique type of class
      mindbody_integration: true,
      mindbody_id: Id,
      // DEBUG for ease of deletion later
      temporary_entry: true,
    })

    // Add information about clients that's been provided, for ease of access
    for (let clientDoc of Clients) {
      batch.set(classes.doc(ClassId).collection('mindbody_clients'), clientDoc)
    }
  }

  // "Associate" the class with the partner, by updating the partner's doc
  batch.update(partners.doc(uid), {
    associated_classes: [...associated_classes, ...newlyAssociatedClasses],
  })

  await batch.commit()
  p(`Added ${newlyAssociatedClasses.length} new classes to the classes collection.`) // DEBUG
}

exports.syncMindbodyClasses = functions.https.onCall(async (data, context) => {
  let { siteId } = data

  const NEXT_YEAR_ISO_DATE_STRING =
    // The magic number stands for a year in milliseconds
    new Date(Date.now() + 31536000000).toISOString()
  
  await exports.coreSyncMindbodyClasses(siteId, {
    EndDateTime: NEXT_YEAR_ISO_DATE_STRING,
    limit: 25, // A HARD CAP OF 25
  })
})

exports.addMindbodyClientToClass = functions.https.onCall(async (data, context) => {
  const { auth: { uid } } = context
  let {
    test=false, // Boolean
    classId, // String
  } = data || {}
  //
  const DEBUG = {
    userId: uid,
    classId,
  }
  const reports = new Reports(
    getDateStringOfTimestamp(),
    'mindbody_addMindbodyClientToClass'
  )

  if (!classId) throw 'classId was not provided.'

  // Retrieve siteId through classId
  const { mindbody_site_id: siteId } = ( await partners
    .where('associated_classes', 'array-contains', classId)
    .get()
  ).docs.map(doc => doc.data())[ 0 ]

  if (!siteId) {
    DEBUG['__message'] = 'siteId was not found in partner doc.'
    await reports.log(`class_${classId}`, DEBUG, true)
  }

  const mindbody = new Mindbody(test)
  mindbody.setRequestHeader('SiteId', siteId)
  await mindbody.useSourceCredentials()

  // Retrieve the user's doc
  const {
    first,
    last,
    email,
    dob,
    gender,
    // mindbody_client_ids={},
  } = ( await users.doc(uid).get() ).data()

  // Understand what are the required fields in order to book an appoinment for
  // the user
  const requiredFields = await mindbody.retrieveRequiredClientFields()
  const providedFields = {
    FirstName: first,
    LastName: last,
    Email: email,
  }

  DEBUG['requiredFields'] = requiredFields
  let missingData = []

  for (let fieldName of requiredFields) {
    switch (fieldName) {
      case 'BirthDate':
        if (dob) providedFields['BirthDate'] =
          new Date(dob.year, dob.month, dob.day).toISOString()
        else missingData.push('dob')
        break
      case 'Gender':
        if (gender) providedFields['Gender'] = gender
        else missingData.push('gender')
        break
      // case 'EmergContact':
      //   providedFields['EmergencyContactInfoEmail'] = ?
      //   providedFields['EmergencyContactInfoName'] = ?
      //   providedFields['EmergencyContactInfoPhone'] = ?
      //   providedFields['EmergencyContactInfoRelationship'] = ?
      // break
    }
  }

  // If missing data,
  // return error, which has to be checked by the front-end.
  if (missingData.length) {
    return {
      error: {
        code: 'insufficient_fields',
        message: 'Insufficient fields in user doc.',
        context: missingData,
      }
    }
  }

  try {
    // First try to find an already existing client within Gym's Mindbody DB
    const clientsFound = await mindbody.retrieveClients({
      searchText: email, // Search by email
    })

    // First client that fully matches is it
    let existingClient
    for (let client of clientsFound) {
      let { FirstName, LastName } = client
      if (FirstName == first && LastName == last) {
        existingClient = client
        break
      }
    }

    // If it doesn't exist, create a new one
    if (!existingClient) {
      existingClient = await mindbody.addClient(providedFields)
      
      // Make sure to save Minbody doc of the client,
      // in order to know which Imbue user has which ClientId
      await classes.doc(classId).collection('mindbody_clients').doc(uid)
        .set(existingClient)
    }

    const { Id: ClientId } = existingClient
    // format of Integrated-from-Mindbody class uid is `${partner_id}_${ClassId}`
    const ClassId = parseInt(classId.split('_')[ 1 ])
    await mindbody.addClientToClass({ ClientId, ClassId })
  } catch(err) {
    DEBUG['__message'] = err.Message
    DEBUG['_context'] = err
    await reports.log(`user_${uid}`, DEBUG, true)
  }
})

exports.removeMindbodyClientFromClass = functions.https.onCall(async (data, context) => {
  const { auth: { uid } } = context
  let {
    test=false, // Boolean
    classId, // String
  } = data || {}

  const { mindbody_site_id: siteId } = ( await partners
    .where('associated_classes', 'array-contains', classId)
    .get()
  ).docs.map(doc => doc.data())[ 0 ]

  const { Id: ClientId } = ( await classes
    .doc(classId).collection('mindbody_clients').doc(uid).get() ).data()

  const mindbody = new Mindbody(test)
  mindbody.setRequestHeader('SiteId', siteId)
  await mindbody.useSourceCredentials()

  // format of Integrated-from-Mindbody class uid is `${partner_id}_${ClassId}`
  const ClassId = parseInt(classId.split('_')[ 1 ])
  await mindbody.removeClientFromClass({ ClientId, ClassId })
})

exports.scheduleSyncMindbodyClasses = functions.pubsub.schedule('every 24 hours').onRun(async context => {
  let allSiteIds = (
    await partners.select('mindbody_site_id').get()
  ).docs.map(doc => doc.data().mindbody_site_id).filter(Boolean)

  // Remove duplicates, if there are any (there shouldn't be)
  allSiteIds = [...new Set(allSiteIds)]

  const opts = {
    limit: 10, // Something for now... (default would be 100)
  }

  await Promise.all(
    allSiteIds.map(siteId => exports.coreSyncMindbodyClasses(siteId, opts))
  )
})