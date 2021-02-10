import React from 'react'
import { View, Image } from 'react-native'



export default function Icon(props) {
  const { containerStyle, imageStyle } = props
  const { source } = props

  return (
    <View style={{
      width: 42,
      height: 42,
      alignItems: "center",
      justifyContent: "center",
      ...containerStyle,
    }}>
      <Image
        style={{
          width: "100%",
          height: "100%",
          ...imageStyle,
        }}
        source={source}
      />
    </View>
  )
}