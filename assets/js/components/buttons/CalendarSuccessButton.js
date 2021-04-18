import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {simpleShadow} from '../../contexts/Colors';
import CalendarSuccessIcon from '../badges/CalendarSuccessIcon';

export default function CalendarSuccessButton(props) {
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
        <CalendarSuccessIcon
          containerStyle={props.imageContainerStyle}
          imageStyle={props.imageStyle}
        />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({});
