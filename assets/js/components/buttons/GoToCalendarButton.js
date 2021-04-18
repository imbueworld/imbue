import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {simpleShadow} from '../../contexts/Colors';
import {useNavigation, StackActions} from '@react-navigation/native';
import CalendarGoToIcon from '../badges/CalendarGoToIcon';

export default function GoToCalendarButton(props) {
  let navigation = useNavigation();

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
        // onPress={props.onPress || (() => navigation.navigate("ScheduleViewer"))}
        onPress={
          props.onPress ||
          (() => {
            let pushAction = StackActions.push('ScheduleViewer');
            navigation.dispatch(pushAction);
          })
        }>
        <CalendarGoToIcon
          containerStyle={props.imageContainerStyle}
          imageStyle={props.imageStyle}
        />
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({});
