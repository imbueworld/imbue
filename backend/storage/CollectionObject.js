import firestore from '@react-native-firebase/firestore'
import { BusyError } from '../Errors'
import cache from './cache'



export default class CollectionObject {
  constructor(collection, DataObject) {
    this.collection = collection
    this.DataObject = DataObject
  }

  /**
   * Currently operational rules:
   * -  in
   * 
   * Does not request from server the value in query more than once per session,
   * rather retrieves it from cache.
   * 
   * E.g. if a Class with uid `123` is already in cache and fits that query,
   * it is returned, rather than requested again from the server.
   * 
   * LIMITS:
   *    in: Max queue entries of 10 allowed
   */
  async retrieveWhere(field, rule, query) {
    // Fetch from cache all that can
    let availableData = this._getCacheObj().where(field, rule, query)
    // console.log("availableData", availableData) // DEBUG

    // Determine fulfilled and unfulfilled queries
    let fulfilledQueries = availableData.map(doc => doc[ field ])
    // console.log("fulfilledQueries", fulfilledQueries) // DEBUG

    let unfulfilledQueries = query.filter(query => !fulfilledQueries.includes(query))
    // console.log("unfulfilledQueries", unfulfilledQueries) // DEBUG

    // Request from server missing pieces, if there are any
    let additionalData = []
    if (unfulfilledQueries.length) {
      // unfulfilledQueries has to be split into batches of 10,
      // because that is the limit for query param of .where()
      let batches = []
      let i = 0
      let j = 0
      for (let query of unfulfilledQueries) {
        batches[ i ] = batches[ i ] || []
        batches[ i ].push(query)
        j++
        if (j == 10) {
          j = 0
          i++
        }
      }

      for (let idBatch of batches) {
        additionalData.push(
          ...(await this._getDbRef()
            .where(field, rule, idBatch)
            .get()
          ).docs.map(this._entriesStructure)
        )
      }
    }

    // console.log("additionalData", additionalData) // DEBUG

    // Cache the just-received missing pieces, by insantiating DataObject,
    // which does it automatically.
    //
    // Take all data and return DataObjects based on it.
    availableData = availableData.map(doc => ([doc.id, doc])) // This is unoptimal, and relatively unorganized, but necessary atm

    // console.log("availableData2", availableData) // DEBUG
    let allData = [...availableData, ...additionalData]
    const dataObjects = []

    allData.forEach(entry => {
      const dataObject = new this.DataObject()
      dataObject.fromEntry(entry)
      dataObjects.push(dataObject)
    })


    return dataObjects
  }

  /**
   * @param {Array} docUids
   */
  async retrieveDocs(docUids) {
    // Fetch from cache all that can
    let availableData = []
    for (let uid of docUids) {
      availableData.push(
        this._getCacheObj().ref(uid).get() // returns undefined if not found
      )
    }
    availableData = availableData.filter(Boolean) // filters out that undefined
    // console.log('availableData', availableData) // DEBUG
    let putAsideData = []

    // console.log(1, 'docUids', docUids) // DEBUG
    // Subtract docs that are already available from those to be queried yet
    docUids = docUids.filter(uid => {
      for (let availDoc of availableData) {
        if (availDoc.id == uid) {
          putAsideData.push(availDoc)
          return false
        }
      }
      return true
    })
    // console.log(2, 'docUids', docUids) // DEBUG

    // Retrieve the ones that hadn't been cached
    let reads = []
    for (let uid of docUids) {
      reads.push(
        firestore()
          .collection(this.collection)
          .doc(uid)
          .get()
      )
    }
    const docs = ( await Promise.all(reads) ).map(doc => doc.data()).filter(Boolean)
    // console.log('docs', docs) // DEBUG
    
    // Make sure to save them on cache, which can be accompished by
    // instantiating `DataObject` with .fromEntry
    // console.log('docs', docs) // DEBUG
    // console.log('putAsideData', putAsideData) // DEBUG
    let allData = [...docs, ...putAsideData]
    const dataObjects = []
    allData.forEach(doc => {
      const dataObject = new this.DataObject
      dataObject.fromEntry([doc.id, doc])
      dataObjects.push(dataObject)
    })

    // Return classes in their according DataObject form
    // console.log('dataObjects', dataObjects) // DEBUG
    return dataObjects
  }

  /**
   * This should never be used, because it retrieves all documents from a collection,
   * as well as this has a limitation, that if any data is already present,
   * it assumes it has retrieved "all" already.
   */
  async __retrieveAll() {
    let availableData = this._getCacheObj().getChildren()
    const dataObjects = []

    if (availableData.length) {
      const newDataObjects = availableData.map(doc => {
        let entry = [doc.id, doc]
        const dataObject = new this.DataObject()
        dataObject.fromEntry(entry)
        return dataObject
      })
      dataObjects.push(...newDataObjects)
    } else {
      const newDataObjects = ( await this._getDbRef().get() )
        .docs.map(this._dataObjectStructure.bind(this))
      dataObjects.push(...newDataObjects)
    }

    return dataObjects
  }

  _getCacheObj() {
    return cache(`${this.collection}`)
  }

  _getData() {
    return this._getCacheObj().get() || {}
  }

  _setData(data) {
    this._getCacheObj().set(data)
  }

  _getDbRef() {
    return firestore().collection(this.collection)
  }


  _idAsKeyStructure(doc) {
    let newStructure = {}
    newStructure[ doc.id ] = doc.data()
    return newStructure
  }

  _entriesStructure(doc) {
    return [doc.id, doc.data()]
  }

  // Must .bind(this) when used
  _dataObjectStructure(doc) {
    let entry = [doc.id, doc.data()]
    const dataObject = new this.DataObject()
    dataObject.fromEntry(entry)
    return dataObject
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
}