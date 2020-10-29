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

  return (
    <View style={[
      styles.container,
      props.containerStyle,
    ]}>
      {tapPanel && (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 1,
            // backgroundColor: 'blue', // DEBUG
          }}
          onTouchEnd={() => {
            ref.current.focus()
            setTapPanel(false)
          }}
        />
      )}
      <TextInput
        style={[
          (multiline) ? styles.input : styles.inputMultilineFalse,
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
        onBlur={e => {
          setTapPanel(true)
          onBlur(e)
        }}
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
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: colors.textInputFill,
    borderColor: colors.textInputBorder,
    overflow: "hidden",
  },
  input: {
    ...FONTS.subtitle,
    textAlign: 'center',
    fontSize: 20,
    // backgroundColor: 'red', // DEBUG
  },
})