import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import {
  getPlaidLinkToken,
  initOnPlaidLinkSuccess,
  initOnPlaidLinkExit,
} from './PlaidButton.backend'
import PlaidLink from 'react-native-plaid-link-sdk'
import CustomButton from './CustomButton' 
  


export default function PlaidButton(props) {
  const {
    component,
    componentProps,
    onError=() => {},
  } = props
  const [linkToken, setLinkToken] = useState()

  // Init
  useEffect(() => {
    const init = async () => {
      setLinkToken(await getPlaidLinkToken())
    }; init() 
  }, [])

  console.log("linkToken: " + linkToken)

  if (!linkToken) return <View />

  const onSuccess = initOnPlaidLinkSuccess(onError)
  const onExit = initOnPlaidLinkExit(onError)

  return (
    <PlaidLink 
      component={component || CustomButton}
      componentProps={componentProps || { 
        title: 'Add Plaid Account',
      }}
      token={linkToken} 
      onSuccess={onSuccess} 
      onExit={onExit}
    />
  )
}
