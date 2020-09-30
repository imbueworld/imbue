import DataObject from './DataObject'
import User from './User'
import {
  clockFromTimestamp,
  dateStringFromTimestamp,
  shortDateFromTimestamp
} from '../HelperFunctions'



export default class Class extends DataObject {
  constructor() {
    const collection = 'classes'
    super(collection)
  }

  async retrieveClass(uid) {
    await this.initByUid(uid)
    return this.getFormatted()
  }

  getFormatted() {
    // const processedClasses = this.getAll().map(classDoc => {
    //   classDoc = { ...classDoc } // do not affect cache
    //   // classDoc.active_times = { ...classDoc.active_times } // do not affect cache
    //   classDoc.active_times = classDoc.active_times.map(timeDoc => ({ ...timeDoc })) // do not affect cache
    //   const { active_times } = classDoc
    //   const currentTs = Date.now()
    //   let additionalFields

    //   active_times.forEach(timeDoc => {
    //     const { begin_time, end_time } = timeDoc

    //     // Add formatting to class,
    //     // which is later used by <ScheduleViewer />, and potentially others.
    //     additionalFields = {
    //       dateString: dateStringFromTimestamp(begin_time),
    //       formattedDate: shortDateFromTimestamp(begin_time),
    //       formattedTime:
    //         `${clockFromTimestamp(begin_time)} – `
    //         + `${clockFromTimestamp(end_time)}`,
    //     }; Object.assign(timeDoc, additionalFields)
  
    //     // Add functionality, same reasons
    //     // ... not here, most likely!

    //     // Add state identifiers~
    //     timeDoc.livestreamState = 'offline' // default
    //     let timePassed = currentTs - begin_time // Positive if class has started or already ended

    //     // If time for class has come, but class has not ended yet
    //     if (timePassed > 0 && currentTs < end_time) {
    //       timeDoc.livestreamState = 'live'
    //     }

    //     // If livestream is starting soon (30min before)
    //     if (timePassed > -30 * 60 * 1000 && currentTs < begin_time) {
    //       timeDoc.livestreamState = 'soon'
    //     }
    //   })

    //   return classDoc
    // })

    // return processedClasses


    const processedClass = { ...this.getAll() } // do not affect cache
    // processedClass.active_times = { ...processedClass.active_times } // do not affect cache
    processedClass.active_times = processedClass.active_times
      .map(timeDoc => ({ ...timeDoc })) // do not affect cache
    const { active_times } = processedClass
    const currentTs = Date.now()
    let additionalFields

    active_times.forEach(timeDoc => {
      const { begin_time, end_time } = timeDoc

      // Add formatting to class,
      // which is later used by <ScheduleViewer />, and potentially others.
      additionalFields = {
        dateString: dateStringFromTimestamp(begin_time),
        formattedDate: shortDateFromTimestamp(begin_time),
        formattedTime:
          `${clockFromTimestamp(begin_time)} – `
          + `${clockFromTimestamp(end_time)}`,
      }; Object.assign(timeDoc, additionalFields)

      // Add functionality, same reasons
      // ... not here, most likely!

      // Add state identifiers~
      timeDoc.livestreamState = 'offline' // default
      let timePassed = currentTs - begin_time // Positive if class has started or already ended

      // If time for class has come, but class has not ended yet
      if (timePassed > 0 && currentTs < end_time) {
        timeDoc.livestreamState = 'live'
      }

      // If livestream is starting soon (30min before)
      if (timePassed > -30 * 60 * 1000 && currentTs < begin_time) {
        timeDoc.livestreamState = 'soon'
      }
    })

    return processedClass
  }

  async retrieveAttendees(timeId) {
    return await this._BusyErrorWrapper('retrieveAttendees', async () => {
      const cacheObj = this._getCacheObj().ref('attendees')

      // If has been cached => return it
      const data = cacheObj.get()
      if (Object.keys(data).length) return data

      // Retrieve from database
      const attendees = (await this._getActiveTimesDbRef()
        .doc(timeId)
        .collection('clients')
        .get()
      ).docs.map(this._appendedIdStructure)

      // Update cache
      cacheObj.set(attendees)

      return attendees
    })
  }

  /**
   * Does:
   *      [Write]  classes > (+) > CLASS_ENTITY_DOC
   *      [Read]   partners > (uid)
   *      [Write]  partners > (uid) > { associated_classes }
   * 
   * Compiles the form data of <NewClassForm />,
   * pushes it to database and updates cache.
   */
  async create(form) {
    let {
      instructor,
      name,
      description,
      genres,
      type,
      price,
      gym_id,
    } = form
    let pushables = []

    const partner = new User()
    await partner.init()
    const {
      id: partner_id,
      associated_classes=[],
    } = partner.getAll()

    this.mergeItems({
      ...form,
      partner_id,
      active_times: [],
    })

    // Push the new class
    const { id: classId } = pushables.push(this.push({ forceNew: true }))

    // Update partner's associated classes
    partner.mergeItems({
      associated_classes: [...associated_classes, classId],
    })
    pushables.push(partner.push())

    await Promise.all(pushables)
  }

  /**
   * Does:
   *      [Read]   classes > (class_id)
   *      [Write]  classes > (class_id) > { active_times }
   */
  async populate(details) {
    let {
      activeTimes: newActiveTimes,
    } = details

    const {
      active_times=[],
    } = this.getAll()

    // Make sure that the times don't overlap; it's not allowed
    active_times.forEach(({ begin_time, end_time }) => {
      newActiveTimes.forEach(({
        begin_time: begin_time_NEW,
        end_time: end_time_NEW
      }) => {
        const err = new Error('Some class times overlap with already existing class times.')

        if (begin_time_NEW > begin_time
          && begin_time_NEW < end_time) {
          throw err
        }
        if (end_time_NEW > begin_time
          && end_time_NEW < end_time) {
          throw err
        }
        if (end_time_NEW === end_time
          && begin_time_NEW === begin_time) {
          throw err
        }
      })
    })

    // Populate class with the new times
    this.mergeItems({
      active_times: [...active_times, ...newActiveTimes],
    })
    await this.push()
  }

  _getActiveTimesDbRef() {
    return this._getDocDbRef().collection('active_times')
  }
}