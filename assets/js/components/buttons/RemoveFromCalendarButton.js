import React from 'react';
import {View} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {simpleShadow} from '../../contexts/Colors';
import Icon from '../Icon';

export default function RemoveFromCalendarButton(props) {
  const {
    containerStyle = {},
    imageContainerStyle = {},
    imageStyle = {},
    //
    onPress = () => {},
  } = props;

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 999,
        zIndex: 110,
        // ...simpleShadow,
        ...containerStyle,
      }}>
      <TouchableHighlight
        style={{
          borderRadius: 999,
        }}
        underlayColor="#00000020"
        onPress={onPress}>
        <Icon
          containerStyle={imageContainerStyle}
          imageStyle={imageStyle}
          source={require('../img/png/cancel.png')}
        />
      </TouchableHighlight>
    </View>
  );
}
