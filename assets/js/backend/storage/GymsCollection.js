import CollectionObject from './CollectionObject'
import Gym from './Gym'

import firestore from '@react-native-firebase/firestore'
import { initializeApp } from 'geofirestore'
const geofirestore = initializeApp(firestore())



export default class GymsCollection extends CollectionObject {
  constructor() {
    const collection = 'gyms'
    const DataObject = Gym
    super(collection, DataObject)
  }

  /**
   * @param {Object} coordinates
   * Consists of longitude, latitude, longitudeDelta, latitudeDelta.
   * E.g. something that `<MapView />`'s `onRegionChangeComplete` returns.
   */
  async retrieveGymsBasedOnLocation(coordinates) {
    return await this._BusyErrorWrapper('retrieveGymsBasedOnLocation', async () => {
      let {
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
      } = coordinates
  
      // 1 degree = 111km
      const radius = Math.min(
        Math.max(latitudeDelta, longitudeDelta) * 111,
        500, // Capping the data at this amount of km
      )
  
      const docs = (await geofirestore
        .collection(this.collection)
        .near({
          center: new firestore.GeoPoint(latitude, longitude),
          radius,
        })
        .get()
      ).docs
  
      // Saving newly fetched data into cache with the .fromEntry() function
      for (const firebaseDoc of docs) {
        (new this.DataObject).fromEntry([firebaseDoc.id, firebaseDoc.data()])
      }
  
      const gyms = docs.map(doc => doc.data())
      return gyms
    })
  }
}