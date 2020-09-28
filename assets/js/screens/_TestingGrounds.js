import React, { useEffect } from 'react'
import { View } from 'react-native'
import Gym from '../backend/Gym'
import cache from '../backend/storage/cache';



export default function _TestingGrounds(props) {
  useEffect(() => {
    const init = async () => {
      const gym = new Gym()
      const p = console.log
      let x
    }; init()
  }, [])

  return (
    <View />
  )
}