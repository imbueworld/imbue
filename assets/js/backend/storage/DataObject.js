import firestore from '@react-native-firebase/firestore'
import cache from './cache'
import { BusyError } from '../Errors'
import { getRandomId } from '../HelperFunctions'



export default class DataObject {
  constructor(collection) {
    this.uid = null
    this.collection = collection
    this._tempUid = getRandomId()
    this._modifiedFields = []
  }

  /**
   * Must be called right after instantiation, if called at all
   */
  async initByUid(uid) {
    if (!uid) return
    
    this.uid = uid
    if (Object.keys(this._getData()).length) return

    // If data hasn't been cached, get it from database, cache it
    await this._forcePull()
  }

  getAll() {
    return this._getData()
  }

  getItem(field) {
    const data = this._getData()
    return data[ field ]
  }
  
  /**
   * Alternative to mergeItems(), but
   * currently do not know why use this method instead.
   */
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

    this._setData(data)
  }

  /**
   * Meant for constructing a Data Object from an existing piece of data,
   * assuming it as up-to-date and in no need of a push
   */
  fromEntry([ id, doc ]) {
    this.uid = id
    this.mergeItems(doc)
    this._modifiedFields = []
  }

  async push(options={}) {
    const data = this._getData()

    const { forceNew } = options

    // It will not be premitted to push manually a new entry,
    // rather the developer has to use the appropriate .create() methods
    if (!this.uid && !forceNew) {
      console.warn('Push was not done, manual pushing is not permitted. Use or create method: .create()')
      this.__DEBUG()
      return
    }

    let modifiedData = this._getModifiedData()
    if (!Object.keys(modifiedData).length) return // Do not push an empty doc

    // If uid is not present, add new entry
    if (!this.uid) {
      let firebaseDoc = await this._getCollectionDbRef().add(data)
      this._modifiedFields = [] // update

      // this is important: when changing internal uid here,
      // pass on existing data to the new uid in cache
      this.uid = firebaseDoc.id
      this._setData(data)
      return firebaseDoc
    }

    // Else just merge changed data,
    // by sending only the new data over to the server
    let firebaseDoc = await this._getDocDbRef()
      .set(modifiedData, { merge: true })
    this._modifiedFields = [] // update

    return firebaseDoc
  }

  async delete() {
    await this._getDocDbRef()
      .set(null)
  }

  _getCacheObj() {
    return cache(`${this.collection}/${this.uid || this._tempUid}`)
  }

  _getData() {
    return this._getCacheObj().get() || {}
  }

  _setData(data) {
    this._getCacheObj().set(data)
  }

  _getCollectionDbRef() {
    return firestore().collection(this.collection)
  }

  _getDocDbRef() {
    return firestore().collection(this.collection).doc(this.uid)
  }

  _getModifiedData() {
    const data = this._getData()
    const modifiedData = {}
    this._modifiedFields.forEach(field => {
      modifiedData[ field ] = data[ field ]
    })
    return modifiedData
  }

  async _forcePull() {
    const data = ( await this._getDocDbRef().get() ).data()
    this._setData(data)
  }


  _appendedIdStructure(doc) {
    let data = doc.data()
    data.id = doc.id
    return data
  }


  async _BusyErrorWrapper(fnIdentifier, exec) {
    const cacheObj = cache(`working/${fnIdentifier}`)

    if (cacheObj.get()) throw BusyError
    else cacheObj.set(true)

    try {
      return await exec()
    } catch(err) {
      throw err
    } finally {
      cacheObj.set(false)
    }
  }


  __DEBUG() {
    console.log(this)
    console.log(this.getAll())
  }
}