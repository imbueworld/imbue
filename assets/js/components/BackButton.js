import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { simpleShadow } from '../contexts/Colors'



export default function BackButton(props) {
    return (
        <View style={{
          // ...simpleShadow,
          // backgroundColor: "white",
          borderRadius: 999,
          ...props.style,
          ...props.containerStyle,
        }}>
          <Image
            style={{
              width: 64,
              height: 64,
              ...props.imageStyle,
            }}
            source={require("./img/png/back-button-3.png")}
          />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {},
})