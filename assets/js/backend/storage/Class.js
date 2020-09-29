import DataObject from './DataObject'
import User from './User'



export default class Class extends DataObject {
  constructor() {
    const collection = 'classes'
    super(collection)
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
      active_times: newActiveTimes,
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