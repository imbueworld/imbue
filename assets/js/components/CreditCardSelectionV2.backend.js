import { Alert } from 'react-native'



export const selectCard = (onCardSelect, card) => {
  let { paymentMethodId } = card

  Alert.alert(
    'Do you wish to make the purchase?',
    '',
    [
      {
        text: 'Purchase',
        onPress: () => onCardSelect(paymentMethodId),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    { cancelable: false },
  )
}