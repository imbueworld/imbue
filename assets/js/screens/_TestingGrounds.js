import React, { useEffect } from 'react';
import { View } from 'react-native';
import { geocodeAddress } from '../backend/BackendFunctions';



export default function _TestingGrounds(props) {
  useEffect(() => {
    const init = async () => {
      geocodeAddress('Restaurant', res => {
        if (res === null) return
        console.log("!!!", res.location)
      })
    }
    init()
  }, [])

  return (
    <View />
  )
}