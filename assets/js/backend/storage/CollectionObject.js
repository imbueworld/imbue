import firestore from '@react-native-firebase/firestore'
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
      additionalData = (await this._getDbRef()
        .where(field, rule, unfulfilledQueries)
        .get()
      ).docs.map(this._entriesStructure)
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
}