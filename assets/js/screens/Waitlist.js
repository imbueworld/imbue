// import React, { useEffect, useState } from 'react'
// import { StyleSheet, Text, View } from 'react-native'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import config from '../../../App.config'
// import User from '../backend/storage/User'
// import AppBackground from '../components/AppBackground'
// import LogOutButton from '../components/buttons/LogOutButton'
// import CompanyLogo from '../components/CompanyLogo'



// // export default function Waitlist(props) {
// //   const [waitlistStatus, setWaitlistStatus] = useState()

// //   // Init
// //   useEffect(() => {
// //     const init = async () => {
// //       const user = new User
// //       setWaitlistStatus(await user.retrieveWaitlistStatus())
// //     }; init()
// //   }, [])



// //   const {
// //     referral_token,
// //     waitlist_threshhold,
// //   } = waitlistStatus || {}
// //   let {
// //     current_priority,
// //     total_waiters_currently,
// //   } = waitlistStatus || {}
// //   current_priority -= waitlist_threshhold
// //   total_waiters_currently -= waitlist_threshhold

// //   return (
// //     <KeyboardAwareScrollView
// //       keyboardShouldPersistTaps='handled'
// //       contentContainerStyle={{ minHeight: '100%' }}
// //     >
// //       <AppBackground />
// //       <CompanyLogo />
// //       <LogOutButton
// //         // onPress={}
// //         containerStyle={styles.LogOutButton}
// //       />

// //       <View style={styles.container}>
// //         <Text style={styles.subtitle}>Your waitlist position:</Text>
// //         <Text style={styles.title}>{ current_priority } / { total_waiters_currently }</Text>
// //         <Text style={styles.subtitle}>Your referral token:</Text>
// //         <Text style={styles.title}>{ referral_token }</Text>
// //         <Text style={styles.body}>By referring through a token, you jump 5 positions in the waitlist!</Text>
// //       </View>
// //     </KeyboardAwareScrollView>
// //   )
// // }

// const styles = StyleSheet.create({
//   container: {
//     width: '88%',
//     alignSelf: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     ...config.styles.title,
//     marginBottom: 10,
//   },
//   subtitle: {
//     ...config.styles.subtitle,
//     marginBottom: 10,
//   },
//   body: {
//     ...config.styles.body,
//     textAlign: 'justify',
//     marginTop: 30,
//     paddingHorizontal: '6%',
//   },
//   LogOutButton: {
//     ...config.styles.GoBackButton_rightSide_screenDefault,
//   },
// })