import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import { colors } from '../contexts/Colors'
import { FONTS } from '../contexts/Styles'



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
      props.containerStyle
    ]}>

      {/* <View style={styles.placeholderContainer}>
        <Text style={[
          styles.placeholder,
          {
            display: msg ? "none" : "flex",
          },
        ]}>
          {props.placeholder}
        </Text>
      </View> */}

      <TextInput
        style={[
          styles.input,
          props.style,
        ]}
        secureTextEntry={secureTextEntry}
        // multiline={multiline}
        // numberOfLines={props.numberOfLines || 1}
        keyboardType={props.keyboardType || 'default'}
        value={props.value !== undefined ? props.value : undefined}
        placeholder={props.placeholder}
        placeholderTextColor={colors.textInputPlaceholder}
        value={props.value || undefined}
        onChangeText={text => {
          if (props.info) props.info[0] = text
          if (props.onChangeText) props.onChangeText(text)
        }}
      // {...props}
      />

      {/* <View style={styles.inputBg} /> */}

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
    // borderColor: colors.gray,
    borderColor: colors.textInputBorder,
    overflow: "hidden",
  },
  input: {
    ...FONTS.subtitle,
    height: "100%",
    // paddingVertical: 20,
    paddingTop: 0,
    paddingBottom: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 20,
    zIndex: 100,
    // fontFamily: fonts.default,
  },
  // placeholderContainer: {
  //     width: "100%",
  //     height: "100%",
  //     position: "absolute",
  //     zIndex: 50,
  // },
  // placeholder: {
  //     flex: 1,
  //     color: "white",
  //     textAlign: "center",
  //     textAlignVertical: "center",
  //     fontSize: 20,
  // },
  // inputBg: {
  //     width: "100%",
  //     height: "100%",
  //     position: "absolute",
  //     borderRadius: 30,
  //     // backgroundColor: "lightgray",
  //     borderWidth: 1,
  //     borderColor: colors.gray,
  // },
})