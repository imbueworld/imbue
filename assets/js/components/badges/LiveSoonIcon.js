import React from 'react'
import { View, Text } from 'react-native'
import Icon from '../Icon'
import { FONTS } from '../../contexts/Styles'



export default function LiveSoonIcon(props) {
  return (
    <View style={{
      width: 72,
      height: 72,
      top: -10,
      justifyContent: "center",
      alignItems: "center",
      ...props.containerStyle,
    }}>
      <Icon
        containerStyle={{
          width: "75%",
          height: "75%",
          ...props.imageContainerStyle,
        }}
        imageStyle={props.imageStyle}
        source={require("../img/png/live-inactive.png")}
      />
      <Text style={{
        flex: 1,
        paddingHorizontal: 5,
        position: "absolute",
        bottom: 0,
        backgroundColor: "#00000030",
        ...FONTS.body,
        color: "black",
        textAlign: "center",
        textDecorationLine: "underline",
        fontSize: 9
      }}>in {props.value}min</Text>
    </View>
  )
}
