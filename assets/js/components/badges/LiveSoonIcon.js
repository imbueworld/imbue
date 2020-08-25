import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Icon from '../Icon'
import { colors } from '../../contexts/Colors'
import { fonts } from '../../contexts/Styles'



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
        paddingHorizontal: 5,
        position: "absolute",
        color: "white",
        backgroundColor: "#00000030",
        textAlign: "center",
        textDecorationLine: "underline",
        bottom: 0,
        fontFamily: fonts.default,
      }}>in {props.value}min</Text>
    </View>
  )
}

const styles = StyleSheet.create({})