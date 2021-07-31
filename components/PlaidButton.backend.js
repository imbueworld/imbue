import functions from '@react-native-firebase/functions'



export const getPlaidLinkToken = async () => {
  const getPlaidLinkToken = functions().httpsCallable('getPlaidLinkToken') 
  return ( await getPlaidLinkToken() ).data
}
 
/** 
 * @see https://plaid.com/docs/link/react-native/#onsuccess
 */
export const initOnPlaidLinkSuccess = (onError) => {
  console.log("onError: ", onError)
  const onSuccess = async ({ public_token, metadata }) => {
    let { accounts } = metadata || {}
    let { id: plaid_account_id } = accounts[0] // Gets first account

    try {
      const connectPlaid = functions().httpsCallable('connectPlaidAccountToStripeSeller')
      await connectPlaid({ public_token, plaid_account_id })
    } catch(err) {
      onError('Something prevented the action.')
    }
  }; return onSuccess
}

/**
 * @see https://plaid.com/docs/link/react-native/#onexit
 */
export const initOnPlaidLinkExit = (onError) => {
  const onExit = ({ error, metadata }) => {
    if (error) onError(error.display_message || 'Something prevented the action.')
  }; return onExit
}
