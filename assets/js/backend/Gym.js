import DataObject from './DataObject'
import { geocodeAddress } from './BackendFunctions'



export default class Gym extends DataObject {
  constructor() {
    const collection = 'gyms'
    super(collection)
  }

  async getById(gymId) {
    // ...
    // this.gym = ..
    // cache(`gyms/${this._gymId}`).set(..)
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
      this.push()

      callback('OK')
    })
  }
}