import React from 'react';
import {StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {colors, simpleShadow} from '../contexts/Colors';
import {FONTS} from '../contexts/Styles';

export default function CustomDropDownPicker(props) {
  return (
    <DropDownPicker
      {...props}
      style={{
        ...styles.picker,
        ...props.style,
      }}
      dropDownStyle={styles.pickerDropDown}
      itemStyle={styles.pickerItem}
      labelStyle={styles.pickerLabel}
      items={props.items ? props.items : []}
    />
  );
}

const styles = StyleSheet.create({
  picker: {
    height: 72,
    marginVertical: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    // borderColor: colors.gray,
    borderColor: colors.buttonFill,
    backgroundColor: '#ffffff00',
    ...FONTS.body,
  },
  pickerDropDown: {
    // ...simpleShadow,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...FONTS.body,
  },
  pickerItem: {
    paddingHorizontal: 20,
    ...FONTS.body,
  },
  pickerLabel: {
    textAlign: 'center',
    ...FONTS.body,
  },
});
