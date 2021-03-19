import React from 'react';
import {View, Image} from 'react-native';
import {simpleShadow} from '../contexts/Colors';

export default function BackButton(props) {
  const {style = {}, containerStyle = {}, imageStyle = {}, size} = props;

  return (
    <View
      style={{
        // ...simpleShadow,
        backgroundColor: '#242429',
        borderRadius: size / 2,
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        style={{
          width: size - 34,
          height: size - 34,
          ...imageStyle,
        }}
        source={require('./img/png/forward-arrow-white.png')}
      />
    </View>
  );
}
