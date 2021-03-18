import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {colors} from '../contexts/Colors';
import {FONTS} from '../contexts/Styles';

/**
 * The only prop atm you cannot use with this Component is 'ref',
 * because of the inner dependency on it.
 */
export default function CustomTextInputV2(props) {
  const {
    style = {},
    containerStyle = {},
    //
    red = false,
    secureTextEntry,
    onBlur = () => {},
  } = props;

  const ref = useRef();
  const [tapPanel, setTapPanel] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <View
      style={[
        containerStyle,
        styles.container,
        {
          borderColor: isFocused ? colors.textInputFill : '#D6D9DC',
        },
      ]}>
      <TextInput
        placeholderTextColor={colors.textInputPlaceholder}
        {...props}
        style={{
          ...FONTS.subtitle,
          fontSize: 17,
          textAlign: 'center',
          ...style,
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={ref}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    justifyContent: 'center',
    backgroundColor: 'white',
    overflow: 'hidden',
    borderBottomWidth: 0.5,
    width: '80%',
  },
});
