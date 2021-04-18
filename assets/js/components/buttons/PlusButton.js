import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {simpleShadow} from '../../contexts/Colors';
import Icon from '../Icon';

export default function PlusButton(props) {
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
          borderRadius: 999,
        }}
        underlayColor="#00000020"
        onPress={props.onPress || undefined}>
        <Icon
          containerStyle={{
            width: 50,
            height: 50,
            // padding: 6,
            ...props.imageContainerStyle,
          }}
          imageStyle={{
            ...props.imageStyle,
          }}
          source={require('../img/png/plus-2.png')}
        />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({});
