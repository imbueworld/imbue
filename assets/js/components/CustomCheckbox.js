import CheckBox from '@react-native-community/checkbox'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { colors } from '../contexts/Colors'



/**
 * The only prop atm you cannot use with this Component is 'ref',
 * because of the inner dependency on it.
 */
export default function CustomCheckbox(props) {

  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  return (
    <View style={[containerStyle, styles.container]}>

      <CheckBox
          value={toggleCheckBox}
          onValueChange={(newValue) => setToggleCheckBox(newValue)}
          onCheckColor='#f9f9f9'
          onFillColor='#242429'
          onTintColor='#242429'
          tintColor='#242429'
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