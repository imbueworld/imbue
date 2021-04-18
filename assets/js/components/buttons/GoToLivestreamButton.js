import React from 'react';
import {View} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {simpleShadow, colors} from '../../contexts/Colors';
import Icon from '../Icon';

export default function GoToLivestreamButton(props) {
  let backgroundColor;
  let source;
  if (props.inactive) {
    backgroundColor = colors.grayInactive;
    source = require('../img/png/live-inactive.png');
  } else {
    backgroundColor = '#ee0000';
    source = require('../img/png/live.png');
  }

  return (
    <View
      style={{
        backgroundColor: `${backgroundColor}60`,
        borderRadius: 999,
        zIndex: 110,
        // ...simpleShadow,
        ...props.containerStyle,
      }}>
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '65%',
            height: '65%',
            backgroundColor: `${backgroundColor}80`,
            borderRadius: 999,
            zIndex: -10,
          }}
        />
      </View>

      <TouchableHighlight
        style={{
          borderRadius: 999,
        }}
        underlayColor="#00000020"
        onPress={props.onPress || undefined}>
        <Icon
          containerStyle={{
            padding: 5,
            ...props.imageContainerStyle,
          }}
          imageStyle={props.imageStyle}
          source={source}
        />
      </TouchableHighlight>
    </View>
  );
}
