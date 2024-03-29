import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '../Icon';
import { colors } from '../../constants/Colors';

export default function CalendarGoToIcon(props) {
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
            left: -5,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.gray,
          }}
          imageStyle={{
            width: 24,
            height: 24,
          }}
          source={require('../img/png/forward-button.png')}
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
