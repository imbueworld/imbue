import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '../Icon';
import { colors } from '../../constants/Colors';

export default function CalendarSuccessIcon(props) {
  return (
    <View>
      <View
        style={{
          width: '100%',
          height: '105%',
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 999,
          zIndex: 10,
        }}>
        <Icon
          containerStyle={{
            width: 17,
            height: 17,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: colors.gray,
          }}
          source={require('../img/png/checkmark.png')}
        />
      </View>
      <Icon
        containerStyle={{
          width: 50,
          height: 50,
          padding: 9,
          ...props.containerStyle,
        }}
        imageStyle={props.imageStyle}
        source={require('../img/png/calendar-4.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
