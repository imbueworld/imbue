import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { colors } from '../constants/Colors';
import { FONTS } from '../constants/Styles';

export default function Hyperlink(props) {
  const {
    containerStyle = {},
    textStyle = {},
    //
    href = '',
    children,
  } = props;

  const goTo = async () => {
    if (!href) return;
    await Linking.openURL(href);
  };

  return (
    <View style={containerStyle}>
      <TouchableWithoutFeedback onPress={goTo}>
        <Text style={[styles.text, styles.href, textStyle]}>{children}</Text>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    ...FONTS.body,
    color: colors.accent,
    fontSize: 16,
  },
  href: {
    textDecorationLine: 'underline',
  },
});
