import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {colors, simpleShadow} from '../contexts/Colors';
import {FONTS} from '../contexts/Styles';

export default function CustomOptionSelector(props) {
  /**
   * props
   * .options -- {label: repr_string, ..}
   * .info -- transfers information over to parent component
   * .containerStyle -- style of <View /> container
   * .textStyle -- style of text
   */

  const gap = 100 / Object.keys(props.options).length;
  const buttonStates = [];

  Object.entries(props.options).forEach((item, idx, arr) => {
    const [buttonToggled, setButtonToggled] = useState(false);
    buttonStates.push([buttonToggled, setButtonToggled]);
  });

  function toggleButton(idx) {
    if (buttonStates[idx][0]) buttonStates[idx][1](false);
    else buttonStates[idx][1](true);
  }

  // With each render, reset the info array and push correct values
  props.info.forEach(() => props.info.shift());
  buttonStates.forEach(([state, setFn], idx, arr) => {
    if (state) props.info.push(idx);
  });

  const options = Object.entries(props.options).map((arr, idx) => {
    return (
      <View
        style={[
          styles.buttonContainer,
          {
            width: `${gap}%`,
            height: 40 + 10, // +10 for user accommodation
            left: `${gap * idx}%`,
          },
        ]}
        key={arr[0]}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              width: 40 + 10, // +10 for user accommodation
            },
          ]}
          key={arr[0]}
          onPress={() => toggleButton(idx)}>
          <Text
            style={{
              ...props.textStyle,
              ...styles.font,
            }}>
            {arr[1]}
          </Text>
        </TouchableOpacity>
      </View>
    );
  });

  const buttonBackgrounds = Object.entries(props.options).map((arr, idx) => {
    return (
      <View
        style={[
          styles.buttonBgContainer,
          {
            width: `${gap}%`,
            height: 40,
            left: `${gap * idx}%`,
          },
        ]}
        key={arr[0]}>
        <View
          style={[
            buttonStates[idx][0] ? styles.selected : styles.unselected,
            {
              width: 40,
              height: '100%',
            },
          ]}
          key={arr[0]}
        />
      </View>
    );
  });

  return (
    <View style={[styles.container, props.containerStyle]}>
      {options}
      {buttonBackgrounds}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    // height: "100%",
    position: 'absolute',
    alignItems: 'center',
  },
  button: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBgContainer: {
    // height: "100%",
    position: 'absolute',
    alignItems: 'center',
    zIndex: -100,
  },
  selected: {
    backgroundColor: 'white',
    // borderWidth: 1,
    // borderColor: colors.gray,
    // ...simpleShadow,
    borderRadius: 999,
  },
  unselected: {
    // backgroundColor: "lightgray",
    borderWidth: 1,
    // borderColor: colors.gray,
    borderColor: colors.buttonFill,
    borderRadius: 999,
  },
  font: {
    ...FONTS.body,
  },
});
