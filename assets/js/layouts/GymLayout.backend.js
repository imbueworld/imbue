
Alert.alert(
  'Unschedule this class?',
  '',
  [
    {
      text: 'No',
      onPress: () => console.log('NO'),
      style: 'cancel',
    },
    {
      text: 'Yes',
      onPress: () => console.log('YES'),
    },
  ],
  { cancelable: true }
)