import React, { useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'



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
    onBlur = () => { },
  } = props

  const ref = useRef()
  const [tapPanel, setTapPanel] = useState(true)
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)

  return (
    <View style={[containerStyle, styles.container, {
      borderColor: red ? 'red' : colors.textInputBorder,
    }]}>
      {isFocused && (
        <View
          // style={(isFocused ? styles.focusedView : styles.blurredView)}
          style={{
            width: '100%',
            height: 30,
            position: 'absolute',
            zIndex: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.textInputFill
          }}
          onTouchEnd={() => {
            // ref.current.focus()
            setIsFocused(false)
          }}
        />
      )}
      
      {!isFocused &&  (
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
        placeholderTextColor={colors.textInputPlaceholder}
        multiline={secureTextEntry ? false : true}
        {...props}
        style={{
          ...FONTS.subtitle,
          fontSize: 17,
          textAlign: 'center',
          paddingBottom: 6,
          ...style,
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        ref={ref}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 72,
    justifyContent: 'center',
    backgroundColor: "white",
    overflow: 'hidden',
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
})