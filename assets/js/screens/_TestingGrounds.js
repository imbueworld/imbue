import React, { useEffect } from 'react'
import { View } from 'react-native'
import Class from '../backend/storage/Class';
import CollectionObject from '../backend/storage/CollectionObject';
import Gym from '../backend/storage/Gym'
import cache from '../backend/storage/cache';
import User from '../backend/storage/User';
import STRUCTURE from '../backend/storage/STRUCTURE';
import { geocodeAddress } from '../backend/BackendFunctions';
import firestore from '@react-native-firebase/firestore'
import { initializeApp } from 'geofirestore'
const geofirestore = initializeApp(firestore())



export default function _TestingGrounds(props) {
  useEffect(() => {
    const init = async () => {
      const p = console.log
      let x, y

      // const geofirestore = initializeApp(firestore())
      // await geofirestore.collection('test123').add({
      //   val: 'hello',
      //   coordinates: new firestore.GeoPoint(60, -40),
      // })

      x = (
        await geofirestore
          .collection('test123')
          .near({
            center: new firestore.GeoPoint(60, -40),
            radius: 1000,
          })
          .get()
      ).docs.map(doc => doc.data())
      
      p(x[ 0 ].coordinates.latitude)

    }; init()
  }, [])

  return (
    <View />
  )
}