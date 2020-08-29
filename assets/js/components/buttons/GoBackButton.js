import React from 'react'
import { View } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from '../Icon'
import { simpleShadow } from '../../contexts/Colors'
import { useNavigation } from '@react-navigation/native'



export default function GoBackButton(props) {
  let navigation = useNavigation()

  return (
    <View style={{
      backgroundColor: "white",
      borderRadius: 999,
      zIndex: 110,
      ...simpleShadow,
      ...props.containerStyle,
    }}>
      <TouchableHighlight
        style={{
          borderRadius: 999,
        }}
        underlayColor="#00000020"
        onPress={props.onPress || (() => navigation.goBack())}
      >
        <Icon
          containerStyle={{
            width: 50,
            height: 50,
            ...props.imageContainerStyle,
          }}
          imageStyle={{
            ...props.imageStyle,
          }}
          source={require("../img/png/back-button-4.png")}
        />
      </TouchableHighlight>
    </View>
  )
}