import CollectionObject from './CollectionObject'
import Class from './Class'



export default class ClassesCollection extends CollectionObject {
  constructor() {
    const collection = 'classes'
    const DataObject = Class
    super(collection, DataObject)
  }
}