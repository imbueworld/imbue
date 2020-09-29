import CollectionObject from './CollectionObject'
import Gym from './Gym'



export default class GymsCollection extends CollectionObject {
  constructor() {
    const collection = 'gyms'
    const DataObject = Gym
    super(collection, DataObject)
  }
}