import functions from '@react-native-firebase/functions'
import User from '../backend/storage/User'



export const getOnProcceed = (data, onError, onSuccess) => {
  const addBankAccount = async () => {
    try {
      const add = functions().httpsCallable('linkBankAccountToStripeAccount')
      const stripe_bank_account_id = await add(data)
      const user = new User
      await user.init()
      user.mergeItems({ stripe_bank_account_id })
      onSuccess(stripe_bank_account_id)
    } catch(err) {
      onError('Something prevented the action.')
    }
  }; return addBankAccount
}
