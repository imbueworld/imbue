import React from 'react'
import { View, StyleSheet } from 'react-native'
import GoogleLoginButton from './buttons/GoogleLoginButton'
import FacebookLoginButton from './buttons/FacebookLoginButton'



export default function SocialLogin(props) {
  let cache = props.cache
  const onAuthChange = props.onAuthChange
  const onError = props.onError

  if (props.options) {
    for (let option in props.options) {
      options[ option ] = props.options[ option ]
    }
  }

  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-around",
      ...props.containerStyle,
    }}>
      <GoogleLoginButton
        cache={cache}
        accountType={options.accountType}
        imageStyle={styles.socialIcon}
        onAuthChange={onAuthChange}
        onError={onError}
      />
      <FacebookLoginButton
        cache={cache}
        accountType={options.accountType}
        imageStyle={styles.socialIcon}
        onAuthChange={onAuthChange}
      />
    </View>
  )
}



const options = {
  accountType: "user"
}

const styles = StyleSheet.create({
  socialIcon: {
    width: 64,
    height: 64,
  },
})