import React from 'react'
import { Text, View } from 'react-native'



export default function FormStatusMessage(props) {
  const {
    containerStyle={},
    textStyle={},
    children,
    type='error',
  } = props

  return (
    <View style={{
      ...containerStyle,
    }}>
      <Text style={{
        color: type == 'error' ? 'red' : type == 'success' ? 'green' : undefined,
        ...textStyle,
      }}>{ children }</Text>
    </View>
  )
}