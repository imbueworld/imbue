import firestore from '@react-native-firebase/firestore'
import cache from './storage/cache'



export default class DataObject {
  constructor(collection) {
    this._uid = null
    this._collection = collection

    // Initialize object so that it is at least not undefined in cache()
    const obj = this._getCacheObj()
    obj.set({})
  }

  getItem(field) {
    const data = this._getData()
    return data[ field ]
  }
  
  setItem(field, val) {
    const data = this._getData()
    // ... additional processing of new information ?
    data[ field ] = val
  }

  async push () {
    const data = this._getData()

    await this._getDbRef()
      .set(data, { merge: true })
  }

  async delete () {
    await this._getDbRef()
      .set(null)
  }

  _getCacheObj() {
    return cache(`${this._collection}/${this._uid}`)
  }

  _getData () {
    return cache(`${this._collection}/${this._uid}`).get()
  }

  _getDbRef() {
    return firestore().collection(this._collection).doc(this._uid)
  }
}