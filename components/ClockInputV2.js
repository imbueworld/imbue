import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, View, Text, TextInput, Platform} from 'react-native';
import TextInputMask from 'react-native-text-input-mask';

export const ClockInputV2 = ({onChangeText, containerStyle}) => {
  const hourFirstRef = useRef();
  const hourSecondRef = useRef();
  const minuteFirstRef = useRef();
  const minuteSecondRef = useRef();
  const [hourFirst, setHourFirst] = useState('');
  const [hourSecond, setHourSecond] = useState('');
  const [minuteFirst, setMinuteFirst] = useState('');
  const [minuteSecond, setMinuteSecond] = useState('');

  useEffect(() => {
    onChangeText(
      Number(
        `${hourFirst !== '' ? hourFirst : 0}${
          hourSecond !== '' ? hourSecond : 0
        }`,
      ),
      Number(
        `${minuteFirst !== '' ? minuteFirst : 0}${
          minuteSecond !== '' ? minuteSecond : 0
        }`,
      ),
    );
  }, [hourFirst, hourSecond, minuteFirst, minuteSecond]);

  return (
    <View
      style={[
        styles.inputContainer,
        containerStyle,
        Platform.OS === 'ios' && {paddingVertical: 10},
      ]}>
      <TextInput
        ref={hourFirstRef}
        style={[styles.input, Platform.OS === 'ios' && {marginRight: 8}]}
        placeholder={'0'}
        onChangeText={(text) => {
          const hourFirstReg = /^[0-2]$/;
          if (!text) setHourFirst('');
          if (hourFirstReg.test(text)) {
            setHourFirst(text);
            hourSecondRef.current.focus();
          }
        }}
        value={hourFirst}
        keyboardType={'number-pad'}
        maxLength={1}
      />
      <TextInput
        ref={hourSecondRef}
        style={[styles.input, Platform.OS === 'ios' && {marginRight: 8}]}
        placeholder={'0'}
        onKeyPress={({nativeEvent}) => {
          if (nativeEvent.key === 'Backspace' && hourSecond === '') {
            hourFirstRef.current.focus();
          }
        }}
        onChangeText={(text) => {
          const hourSecondFullReg = /^[0-9]$/;
          const hourSecondReg = /^[0-3]$/;
          if (!text) setHourSecond('');
          if (hourFirst === '2' && hourSecondReg.test(text)) {
            setHourSecond(text);
            minuteFirstRef.current.focus();
          }
          if (hourFirst !== '2' && hourSecondFullReg.test(text)) {
            setHourSecond(text);
            minuteFirstRef.current.focus();
          }
        }}
        value={hourSecond}
        keyboardType={'number-pad'}
        maxLength={1}
      />
      <Text style={styles.seperator}>:</Text>
      <TextInput
        ref={minuteFirstRef}
        style={[styles.input, Platform.OS === 'ios' && {marginRight: 8}]}
        placeholder={'0'}
        onKeyPress={({nativeEvent}) => {
          if (nativeEvent.key === 'Backspace' && minuteFirst === '') {
            hourSecondRef.current.focus();
          }
        }}
        onChangeText={(text) => {
          const hourSecondReg = /^[0-5]$/;

          if (!text) setMinuteFirst('');
          if (hourSecondReg.test(text)) {
            setMinuteFirst(text);
            minuteSecondRef.current.focus();
          }
        }}
        value={minuteFirst}
        keyboardType={'number-pad'}
        maxLength={1}
      />
      <TextInput
        ref={minuteSecondRef}
        style={[styles.input, Platform.OS === 'ios' && {marginRight: 8}]}
        placeholder={'0'}
        onKeyPress={({nativeEvent}) => {
          if (nativeEvent.key === 'Backspace' && minuteSecond === '') {
            minuteFirstRef.current.focus();
          }
        }}
        onChangeText={(text) => {
          const hourSecondReg = /^[0-9]$/;

          if (!text) setMinuteSecond('');
          if (hourSecondReg.test(text)) setMinuteSecond(text);
        }}
        value={minuteSecond}
        keyboardType={'number-pad'}
        maxLength={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 24,
  },
  seperator: {
    marginRight: 8,
    fontSize: 20,
  },
});
