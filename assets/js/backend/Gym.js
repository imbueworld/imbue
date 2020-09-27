import DataObject from './DataObject'
import firestore from '@react-native-firebase/firestore'



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
}