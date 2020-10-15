import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'



/**
 * THIS COMPONENT IS BASICALLY DEPRECATED;
 * USE & DEVELOP <CustomTextInutV2 /> INSTEAD.
 */
export default function CustomTextInput(props) {
  let multiline = props.value > 15 ? false : true
  if (props.multiline) multiline = true // overrides

  let secureTextEntry = false
  if (props.secureTextEntry) {
    secureTextEntry = true
    multiline = false // overrides
  }

  return (
    <View style={[
      styles.container,
      props.containerStyle,
    ]}>
      <TextInput
        style={[
          styles.input,
          props.style,
        ]}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={props.numberOfLines || 1}
        keyboardType={props.keyboardType || 'default'}
        value={props.value !== undefined ? props.value : undefined}
        placeholder={props.placeholder}
        placeholderTextColor={colors.textInputPlaceholder}
        value={props.value || undefined}
        onChangeText={text => {
          if (props.info) props.info[0] = text
          if (props.onChangeText) props.onChangeText(text)
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    marginVertical: 10,
    justifyContent: "center",
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: colors.textInputFill,
    borderColor: colors.textInputBorder,
    overflow: "hidden",
  },
  input: {
    ...FONTS.subtitle,
    height: "100%",
    // paddingVertical: 20,
    paddingTop: 20,
    paddingBottom: 1,
    textAlign: "center",
    // textAlignVertical: "center",
    fontSize: 20,
    zIndex: 100,
    // fontFamily: fonts.default,
  },
})