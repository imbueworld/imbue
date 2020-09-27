import firestore from '@react-native-firebase/firestore'
import cache from './storage/cache'



export default class Gym {
  constructor() {
    this._gymId = null

    // Initialize gym object so that it is at least not undefined in cache()
    const gymObj = this._getGymCacheObj()
    gymObj.set({})
  }

  getById(gymId) {
    // ...
    // this.gym = ..
    // cache(`gyms/${this._gymId}`).set(..)
  }

  getItem(field) {
    const gym = this._getGym()
    return gym[ field ]
  }
  
  setItem(field, val) {
    const gym = this._getGym()
    // ... additional processing of new information
    gym[ field ] = val
  }

  async push () {
    const gym = this._getGym()

    await this._getGymDbRef()
      .set(gym, { merge: true })
  }

  async delete () {
    await this._getGymDbRef()
      .set(null)
  }

  _getGymCacheObj() {
    return cache(`gyms/${this._gymId}`)
  }

  _getGym () {
    return cache(`gyms/${this._gymId}`).get()
  }

  _getGymDbRef() {
    return firestore().collection('gyms').doc(this._gymId)
  }
}