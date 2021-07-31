import DataObject from './DataObject'
import { geocodeAddress } from '../BackendFunctions'
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
  async updateLocation(address) {
    const res = await geocodeAddress(address)
    if (!res) return

    const { location, formatted_address } = res

    await this.updateCoordinates(location)
    this.mergeItems({ formatted_address })
    await this.push()

    return 'OK'
  }

  async updateCoordinates(coordinates) {
    let { latitude, longitude } = coordinates
    await geofirestore.collection(this.collection).doc(this.uid).update({
      coordinates: new firestore.GeoPoint(latitude, longitude),
    })
  }
}