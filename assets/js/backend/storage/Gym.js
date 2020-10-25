import DataObject from './DataObject'
import { geocodeAddress } from '../BackendFunctions'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { initializeApp } from 'geofirestore'
import User from './User'
const geofirestore = initializeApp(firestore())



export default class Gym extends DataObject {
  constructor() {
    const collection = 'gyms'
    super(collection)
  }

  async create(details) {
    this.mergeItems(details)
    await this.push({ forceNew: true })
    return this.getAll()
  }

  async retrieveGym(uid) {
    await this.initByUid(uid)
    return this.getAll()
  }

  async retrievePartnerGym() {
    const { associated_gyms } = await (new User).retrieveUser()
    await this.initByUid(associated_gyms[ 0 ])
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

      await this.updateCoordinates(location)
      this.mergeItems({ address: formatted_address })
      await this.push() // What if this was manually?  Okay. But then this fn should be returning a Promise.

      callback('OK')
    })
  }

  async updateCoordinates(coordinates) {
    let { latitude, longitude } = coordinates
    await geofirestore.collection(this.collection).doc(this.uid).update({
      coordinates: new firestore.GeoPoint(latitude, longitude),
    })
  }
}