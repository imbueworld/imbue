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
            height: '100%',
            position: 'absolute',
            zIndex: 0,
            borderBottomWidth: 2,
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
            height: '100%',
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
        // Prop order is important here,
        // with regards to what `{...props}` overrides, and not
        placeholderTextColor={colors.textInputPlaceholder}
        multiline={secureTextEntry ? false : true} // multiline can never be
        // enabled if there is a desire
        // to use secureTextEntry
        {...props}
        style={{
          ...FONTS.subtitle,
          fontSize: 12,
          textAlign: 'center',
          ...style,
          // backgroundColor: 'red', // DEBUG
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