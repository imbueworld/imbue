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
  } = data

  const {
    mindbody_site_id: siteId,
  } = ( await partners.doc(uid).get() ).data()

  if (!siteId) throw `siteId missing for partner_id ${uid}.`

  const mindbody = new Mindbody(test)
  mindbody.setRequestHeader('SiteId', siteId)
  return await mindbody.getActivationCode()
})

exports.syncMindbodyClasses = functions.https.onCall(async (data, context) => {
  const { auth: { uid } } = context
  let {
    test=false, // Boolean
    gymId,
  } = data
  //
  const DEBUG = {
    userId: uid,
    gymId,
  }
  const reports = new Reports(getDateStringOfTimestamp(), 'mindbody_syncMindbodyClasses')

  if (!gymId) throw 'gymId missing.'

  const NEXT_YEAR_ISO_DATE_STRING =
    // The magic number stands for a year in milliseconds
    new Date(Date.now() + 31536000000).toISOString()

  const {
    mindbody_site_id: siteId,
  } = ( await partners.doc(uid).get() ).data()

  const mindbody = new Mindbody(test)
  mindbody.setRequestHeader('SiteId', siteId)
  mindbody.useSourceCredentials()
  const mindbodyClasses = await mindbody.retrieveClasses({
    EndDateTime: NEXT_YEAR_ISO_DATE_STRING,
  })

  const batch = admin.firestore().batch()

  for (let classDoc of mindbodyClasses) {
    let {
      Id,
      ClassScheduleId,
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

    let ClassId = Id.toString()

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
      active_times: [{
        begin_time,
        end_time,
        time_id: ClassScheduleId.toString(),
      }], // Going to try not to use this, but for safety provide default val
      description: Description,
      instructor,
      name: Name,
      genres: [],
      gym_id: gymId,
      partner_id: uid,
      // unique type of class
      mindbody_integration: true,
      // DEBUG for ease of deletion later
      temporary_entry: true,
    })

    // Add information about clients that's been provided, for ease of access
    for (let clientDoc of Clients) {
      batch.set(classes.doc(ClassId).collection('mindbody_clients'), clientDoc)
    }
  }

  await batch.commit()
})

exports.addMindbodyClientToClass = functions.https.onCall(async (data, context) => {
  const { auth: { uid } } = context
  let {
    test=false, // Boolean
    classId, // String
  } = data
  // 
  const DEBUG = {
    userId: uid,
    classId,
  }
  const reports = new Reports(
    getDateStringOfTimestamp(),
    'mindbody_addMindbodyClientToClass'
  )

  if (!gymId) throw 'gymId was not provided.'

  // Retrieve siteId through gymId
  const { mindbody_site_id: siteId } = ( await partners
    .where('associated_classes', 'array-contains', classId)
    .get()
  ).docs.map(doc => doc.data())[ 0 ]

  if (!siteId) {
    DEBUG['__message'] = 'siteId was not found in partner doc.'
    reports.log(`class_${classId}`, DEBUG, true)
  }

  const mindbody = new Mindbody(test)
  mindbody.setRequestHeader('SiteId', siteId)
  mindbody.useSourceCredentials()

  // Retrieve the user's doc
  const {
    first,
    last,
    email,
    dob,
    gender,
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

  if (missingData.length) {
    return {
      error: {
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
      
      // Update user doc with the newfound Mindbody ClientId
      await users.doc(uid).update({ mindbody_client_id: existingClient.Id })
    }

    const { Id: ClientId } = existingClient
    await mindbody.addClientToClass({ ClientId, ClassId: parseInt(classId) })
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
  } = data

  const { mindbody_site_id: siteId } = ( await partners
    .where('associated_classes', 'array-contains', classId)
    .get()
  ).docs.map(doc => doc.data())[ 0 ]

  const { mindbody_client_id: ClientId } = ( await users.doc(uid).get() ).data()

  const mindbody = new Mindbody(test)
  mindbody.setRequestHeader('SiteId', siteId)
  mindbody.useSourceCredentials()
  await mindbody.removeClientFromClass({ ClientId, ClassId: parseInt(classId) })
})
