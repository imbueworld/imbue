import React, { useState, useRef } from 'react'
import { StyleSheet, View, Image, TextInput } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { simpleShadow, colors } from "../contexts/Colors"

import CustomCapsule from "./CustomCapsule"
import { FONTS } from '../contexts/Styles'
import LivestreamMessages from './LivestreamMessages'
import { TouchableHighlight } from 'react-native-gesture-handler'



/**
 * props.data -- CHAT DATA
 * props.profileData -- FROM WHICH PROFILE'S PERSPECTIVE TO RENDER
 */
export default function Chat(props) {
  const gymId = props.gymId
  const user = props.user

  const SendMessage = (props) => {
    const [msg, setMsg] = useState("")

    return (

      <View style={{
        // margin: 10,
        flexDirection: "row",
        backgroundColor: "#00000058",
        borderWidth: 1,
        // borderColor: colors.gray,
        borderColor: colors.buttonFill,
        borderRadius: 25,
        ...props.containerStyle,
      }}>
        <View style={{
          flex: 1,
          justifyContent: "center",
          borderTopLeftRadius: 40,
          borderBottomLeftRadius: 40,
          borderWidth: 3,
          borderColor: "#ffffff00"
        }}>
          <TextInput
            style={{
              paddingHorizontal: 10,
              ...FONTS.body,
              color: "white",
              ...props.style,
            }}
            multiline
            blurOnSubmit={false}
            placeholder="Enter Message..."
            placeholderTextColor="white"
            value={msg}
            onChangeText={setMsg}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
          />

          <View style={{
            width: 50,
            height: 50,
            position: "absolute",
            right: 0,
            bottom: 0,
            backgroundColor: "white",
            borderRadius: 999,
            ...simpleShadow,
          }}>
            <TouchableHighlight
              style={{
                padding: 10,
                borderRadius: 999,
              }}
              underlayColor="#00000012"
              onPress={() => {
                if (props.onSend) props.onSend(msg)
                setMsg("")
              }}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  right: 2,
                }}
                source={require("./img/png/send-3.png")}
              />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }

  const inpRef = useRef(null)
  function setTextFocus(textFocus) {
    if (!inpRef.current) return

    let style = {
      ...styles.container,
      ...props.containerStyle,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
    }
    let modifiedStyle = {}
    if (textFocus) {
      modifiedStyle = {
        width: "100%",
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        height: "100%",
      }
      scrollAppropriately()
    }
    style = {
      ...style,
      ...modifiedStyle,
    }

    inpRef.current.setNativeProps({ style })
  }

  const scrollViewRef = useRef(null)
  function scrollAppropriately() {
    if (!scrollViewRef.current) return
    scrollViewRef.current.scrollToEnd()
  }

  const currentScrollValue = []

  return (

    <CustomCapsule
      containerStyle={{
        ...styles.container,
        ...props.containerStyle,
      }}
      innerContainerStyle={{
        height: "100%",
        paddingHorizontal: 0,
      }}
      containerRef={inpRef}
    >
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
        alwaysBounceVertical={false} >
        <LivestreamMessages
          user={user}
          scrollToBottom={scrollAppropriately}
          currentScrollValue={currentScrollValue}
          scrollViewRef={scrollViewRef}
        />

        <SendMessage
          containerStyle={styles.msgInputContainer}
          style={styles.msgInput}
          onSend={props.onSend}
          onFocus={() => {
            setTextFocus(true)
            scrollAppropriately()
          }}
          onBlur={() => {
            setTextFocus(false)
          }}
        />
      </KeyboardAwareScrollView>
    </CustomCapsule>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: "100%",
  },
  container: {
    backgroundColor: colors.buttonAccent,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.buttonFill,
    overflow: "hidden",
  },
  msgInputContainer: {
    marginBottom: 11,
    marginHorizontal: "6%",
    position: "absolute",
    alignSelf: "center",
    bottom: 0,
  },
  msgInput: {
    fontSize: 17,
  },
  msgSendImg: {},
})