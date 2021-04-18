import React from 'react';
import {View} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import Icon from '../Icon';
import {simpleShadow} from '../../contexts/Colors';
import auth from '@react-native-firebase/auth';

export default function EditButton(props) {
  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 999,
        zIndex: 110,
        // ...simpleShadow,
        ...props.containerStyle,
      }}>
      <TouchableHighlight
        style={{
          width: 48,
          height: 48,
          // padding: 10,
          // left: 2,
          borderRadius: 999,
        }}
        underlayColor="#00000020"
        onPress={props.onPress || undefined}
        onLongPress={props.onLongPress || undefined}>
        <>
          {/* <Icon
          containerStyle={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
          source={require("../img/png/circle.png")}
        /> */}
          <Icon
            containerStyle={{
              width: '100%',
              height: '100%',
              padding: 11,
              left: 2,
            }}
            source={require('../img/png/edit.png')}
          />
        </>
      </TouchableHighlight>
    </View>
  );
}
