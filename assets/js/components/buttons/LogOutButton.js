import React from 'react'
import { View } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from '../Icon'
import { simpleShadow } from '../../contexts/Colors'
import auth from "@react-native-firebase/auth"



export default function LogOutButton(props) {
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
          width: 48,
          height: 48,
          padding: 10,
          left: 2,
          borderRadius: 999,
        }}
        underlayColor="#00000012"
        onPress={props.onPress || (() => auth().signOut())}
        onLongPress={props.onLongPress || undefined}
      >
        {/* <LogOut
          containerStyle={{
            width: 48,
            height: 48,
          }}
        /> */}
        <Icon
          containerStyle={{
            width: "100%",
            height: "100%",
          }}
          source={require("../img/png/sign-out-5.png")}
        />
      </TouchableHighlight>
    </View>
  )
}