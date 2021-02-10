import React from 'react'
import { Text, View } from 'react-native'



/**
 * Shows error message over success message.
 */
export default function FormStatusMessageV2(props) {
  const {
    containerStyle={},
    textStyle={},
    error=null,
    success=null,
  } = props

  return (
    <View style={{
      ...containerStyle,
    }}>
      <Text style={{
        color: error ? 'red' : success ? 'green' : undefined,
        ...textStyle,
      }}>{ error || success }</Text>
    </View>
  )
}