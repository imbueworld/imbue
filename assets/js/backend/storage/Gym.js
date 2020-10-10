import DataObject from './DataObject'
import { geocodeAddress } from '../BackendFunctions'



export default class Gym extends DataObject {
  constructor() {
    const collection = 'gyms'
    super(collection)
  }

  async create(details) {
    this.mergeItems(details)
    await this.push({ forceNew: true })
  }

  async retrieveGym(uid) {
    await this.initByUid(uid)
    return this.getAll()
  }

  /**
   * Updates location with geocoordinates based on provided address text string.
   */
  updateLocation(address, callback) {
    geocodeAddress(address, async res => {
      if (!res) {
        callback(null)
        return
      }

      const { location, formatted_address } = res

      this.mergeItems({
        coordinate: location,
        address: formatted_address,
      })
      this.push() // What if this was manually?  Okay. But then this fn should be returning a Promise.

      callback('OK')
    })
  }
}