import React, { useEffect } from 'react'
import { View } from 'react-native'
import Class from '../backend/storage/Class';
import CollectionObject from '../backend/storage/CollectionObject';
import Gym from '../backend/storage/Gym'
import cache from '../backend/storage/cache';
import User from '../backend/storage/User';
import STRUCTURE from '../backend/storage/STRUCTURE';
import { geocodeAddress } from '../backend/BackendFunctions';



export default function _TestingGrounds(props) {
  useEffect(() => {
    const init = async () => {
      const p = console.log
      let x, y
    }; init()
  }, [])

  return (
    <View />
  )
}