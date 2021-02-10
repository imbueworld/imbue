import React from 'react'
import { View, Image } from 'react-native'
import { simpleShadow } from '../contexts/Colors'



export default function BackButton(props) {
  const {
    style={},
    containerStyle={},
    imageStyle={},
  } = props

  return (
    <View style={{
      ...simpleShadow,
      backgroundColor: "#242429",
      borderRadius: 999,
      ...style,
      ...containerStyle,
    }}>
      <Image
        style={{
          width: 64,
          height: 64,
          marginBottom: 10,
          marginTop: 10,
          marginLeft: 10,
          marginRight: 10,
          ...imageStyle,
        }}
        source={require("./img/png/forward-arrow-white.png")}
      />
    </View>
  )
}
