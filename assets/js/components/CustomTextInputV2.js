import React, { useRef, useState } from 'react'
import { View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'



/**
 * The only prop atm you cannot use with this Component is 'ref',
 * because of the inner dependency on it.
 */
export default function CustomTextInputV2(props) {
  const {
    style={},
    containerStyle={},
    //
    red=false,
    secureTextEntry,
    onBlur=() => {},
  } = props

  const ref = useRef()
  const [tapPanel, setTapPanel] = useState(true)



  return (
    <View style={containerStyle}>
      {tapPanel && (
        <View
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            borderRadius: 20,
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
        // Prop order is important here,
        // with regards to what `{...props}` overrides, and not
        placeholderTextColor={colors.textInputPlaceholder}
        multiline={secureTextEntry ? false : true} // multiline can never be
                                                   // enabled if there is a desire
                                                   // to use secureTextEntry
        {...props}
        style={{
          minHeight: 72,
          borderRadius: 30,
          borderWidth: 1,
          borderColor: red ? 'red' : colors.textInputBorder,
          backgroundColor: colors.textInputFill,
          overflow: 'hidden',
          ...FONTS.subtitle,
          fontSize: 20,
          textAlign: 'center',
          ...style,
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
