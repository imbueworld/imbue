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



  return (
    <View style={[containerStyle, styles.container, {
      borderColor: red ? 'red' : colors.textInputBorder,
    }]}>
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
            // ref.current.focus()
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
          ...FONTS.subtitle,
          fontSize: 12,
          textAlign: 'center',
          ...style,
          // backgroundColor: 'red', // DEBUG
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
    minHeight: 72,
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: colors.textInputFill,
    borderRadius: 30,
    overflow: 'hidden',
  },
})