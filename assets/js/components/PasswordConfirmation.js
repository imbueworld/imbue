import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

import {simpleShadow} from '../contexts/Colors';

import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import CustomCapsule from '../components/CustomCapsule';

export default function PasswordConfirmation(props) {
  const [pw, setPw] = useState('');
  const [confPw, setConfPw] = useState('');

  function evaluate() {
    if (pw === confPw) props.onSuccess(pw);
    else props.onFail('password/does-not-match');
  }

  return (
    <CustomCapsule style={[styles.container, props.capsuleStyle]}>
      <CustomTextInput placeholder="Password" onChangeText={setPw} />
      <CustomTextInput
        placeholder="Confirm Password"
        onChangeText={setConfPw}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity style={[styles.X]} onPress={props.onX}>
          <Text style={{fontSize: 20}}>X</Text>
        </TouchableOpacity>
        <CustomButton style={{flex: 3}} title="Confirm" onPress={evaluate} />
      </View>
    </CustomCapsule>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingBottom: 0,
    zIndex: 100,
  },
  // This version has some issues with boundries and click-ability
  // X: {
  //     width: 48,
  //     height: 48,
  //     position: "absolute",
  //     top: -18,
  //     right: -18,
  //     alignItems: "center",
  //     justifyContent: "center",
  //     backgroundColor: "white",
  //     borderRadius: 999,
  //     zIndex: 110,
  // },
  X: {
    width: 60,
    height: 60,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 999,
  },
});
