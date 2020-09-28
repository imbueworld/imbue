import firestore from '@react-native-firebase/firestore'
import cache from './storage/cache'
import { getRandomId } from './HelperFunctions'



export default class DataObject {
  constructor(collection) {
    this._uid = null
    this._collection = collection
    this._tempUid = getRandomId()
    this._modifiedFields = []
  }

  /**
   * Must be called right after instantiation, if called at all
   */
  async initByUid(uid) {
    this._uid = uid
    if (Object.keys(this._getData()).length) return

    // If data hasn't been cached, get it from database, cache it
    const data = (
      await this._getDocDbRef().get()
    ).data()

    this._setData(data)
  }

  getAll() {
    return this._getData()
  }

  getItem(field) {
    const data = this._getData()
    return data[ field ]
  }
  
  setItem(field, val) {
    const data = this._getData()

    // ... additional processing of new information ?

    data[ field ] = val
    this._modifiedFields.push(field)
  }

  mergeItems(doc) {
    const data = this._getData()

    for (let field in doc) {
      data[ field ] = doc[ field ]
      this._modifiedFields.push(field)
    }
  }

  async push() {
    const data = this._getData()

    // If uid is not present, add new entry,
    // importantly: when changing internal uid,
    // pass on existing data to the new uid in cache
    if (!this._uid) {
      const { id } = await this._getCollectionDbRef().add(data)
      this._modifiedFields = [] // update
      this._uid = id
      this._setData(data)
      return
    }

    let modifiedData = this._getModifiedData()
    if (!Object.keys(modifiedData).length) return // Do not push an empty doc

    // Else just merge changed data,
    // by sending only the new data over to the server
    await this._getDocDbRef()
      .set(modifiedData, { merge: true })
    this._modifiedFields = [] // update
  }

  async delete() {
    await this._getDocDbRef()
      .set(null)
  }

  _getCacheObj() {
    return cache(`${this._collection}/${this._uid || this._tempUid}`)
  }

  _getData() {
    return this._getCacheObj().get()
  }

  _setData(data) {
    this._getCacheObj().set(data)
  }

  _getCollectionDbRef() {
    return firestore().collection(this._collection)
  }

  _getDocDbRef() {
    return firestore().collection(this._collection).doc(this._uid)
  }

  _getModifiedData() {
    const data = this._getData()
    const modifiedData = {}
    this._modifiedFields.forEach(field => {
      modifiedData[ field ] = data[ field ]
    })
    return modifiedData
  }
}