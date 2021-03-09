import React, { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'



/** 
 * THIS COMPONENT IS BASICALLY DEPRECATED;
 * USE & DEVELOP `<CustomTextInutV2 />` INSTEAD.
 */
export default function CustomTextInput(props) {
  const [isFocused, setIsFocused] = useState(false)

  let multiline = props.value > 15 ? false : true
  if (props.multiline) {
    multiline = true // overrides
  } else {
    multiline = false
  }

  let secureTextEntry = false
  if (props.secureTextEntry) {
    secureTextEntry = true
    multiline = false // overrides
  }

  const ref = useRef()
  const [tapPanel, setTapPanel] = useState(true)
  const { onBlur=() => {} } = props

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  return (
    <View style={[
      styles.container,
      props.containerStyle,
    ]}>
      {isFocused && (
        <View
          // style={(isFocused ? styles.focusedView : styles.blurredView)}
          style={{
            width: '100%',
            height: 30,
            position: 'absolute',
            zIndex: 1,
            borderBottomWidth: 1,
            borderBottomColor: colors.textInputFill
          }}
          onTouchEnd={() => {
            // ref.current.focus()
            setIsFocused(false)
          }}
        />
      )}
      {!isFocused && (
        <View
          // style={(isFocused ? styles.focusedView : styles.blurredView)}
          style={{
            width: '100%',
            height: 30,
            position: 'absolute',
            zIndex: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#D6D9DC"
          }}
          onTouchEnd={() => {
            // ref.current.focus()
            setIsFocused(false)
          }}
        />
      )}
      <TextInput
        style={[
          (multiline) ? styles.input : styles.inputMultilineFalse,
          props.style,
          // (isFocused ? styles.focusedInput : styles.blurredInput),
          styles.input
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
        onFocus={handleFocus}
        onBlur={handleBlur}
        // onBlur={e => {
        //   setTapPanel(true)
        //   onBlur(e)
        // }}
        ref={ref}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 72,
    marginVertical: 10,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    overflow: "hidden",
    // borderBottomWidth: 0.25,
  },
  focusedView: {
    width: '100%',
    height: 30,
    position: 'absolute',
    zIndex: 1,
    borderBottomWidth: 2,
    borderBottomColor: colors.textInputFill
  },
  blurredView: {
    width: '100%',
    height: 30,
    position: 'absolute',
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#D6D9DC"
  },
  input: {
    ...FONTS.textInput,
    textAlign: 'center',
    fontSize: 12,
    // backgroundColor: 'red', // DEBUG
  },
})