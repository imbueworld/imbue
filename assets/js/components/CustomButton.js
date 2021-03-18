import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {simpleShadow, colors} from '../contexts/Colors';
import {fonts, FONTS} from '../contexts/Styles';
import {TouchableHighlight} from 'react-native-gesture-handler';

export default function CustomButton(props) {
  const Icon = props.icon || props.Icon;
  const inverted = props.styleIsInverted;

  return (
    <View>
      <TouchableHighlight
        style={{
          backgroundColor: inverted ? colors.buttonAccent : colors.buttonFill,

          // Icons disabled
          // paddingLeft: Icon ? 24 : undefined,
          // paddingRight: Icon ? 24 : undefined,
          // justifyContent: Icon ? "flex-start" : "center",
          justifyContent: 'center',

          alignItems: 'center',

          ...styles.button,
          ...props.style,
        }}
        underlayColor={`${inverted ? `#00000008` : `${colors.buttonFill}DD`}`}
        disabled={props.disabled}
        onPress={props.onPress || undefined}
        onLongPress={props.onLongPress || undefined}>
        <>
          {Icon}

          <Text
            style={[
              styles.text,
              props.textStyle,
              {
                color: inverted ? colors.buttonFill : colors.buttonAccent,
                paddingLeft: Icon ? 10 : undefined,
                flexShrink: 1,
              },
            ]}>
            {props.title}
          </Text>
        </>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    paddingVertical: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.buttonFill,
    borderRadius: 30,
    // ...simpleShadow,
  },
  text: {
    ...FONTS.subtitle,
    // color: colors.gray,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 18,
    // fontFamily: fonts.default,
  },
});
