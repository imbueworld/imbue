import React from 'react'
import { View } from 'react-native'
import {TouchableOpacity } from 'react-native-gesture-handler'
import Icon from '../Icon'
import { useNavigation } from '@react-navigation/native'



export default function GoHomeButon(props) {
  const navigation = useNavigation()
  const {
    containerStyle={},
    imageContainerStyle={},
    imageStyle={},
    //
    onPress=() => navigation.navigate("UserDashboard"),
  } = props


  
  return (
    <View style={{
      backgroundColor: "white",
      borderRadius: 999,
      zIndex: 110,
      // ...simpleShadow,
      ...containerStyle,
    }}>
      <TouchableOpacity
        style={{
          borderRadius: 999,
        }}
        // underlayColor="#00000020"
        onPress={onPress}
      >
        <Icon
          containerStyle={{
            width: 50,
            height: 50,
            ...imageContainerStyle,
          }}
          imageStyle={imageStyle}
          source={require("../img/png/home.png")}
        />
      </TouchableOpacity>
    </View>
  )
}