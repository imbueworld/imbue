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
      // ...simpleShadow,
      // backgroundColor: "white",
      borderRadius: 999,
      ...style,
      ...containerStyle,
    }}>
      <Image
        style={{
          width: 64,
          height: 64,
          ...imageStyle,
        }}
        source={require("./img/png/back-button-3.png")}
      />
    </View>
  )
}
