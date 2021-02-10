import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, RefreshControl, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"
import CustomText from "../components/CustomText"
import CustomButton from "../components/CustomButton"

import { FONTS } from '../contexts/Styles'
import { currencyFromZeroDecimal } from '../backend/HelperFunctions'
import User from '../backend/storage/User' 
import PlaidButton from '../components/PlaidButton'
import BankAccountFormWithButtonEntry from '../components/BankAccountFormWithButtonEntry'
import config from '../../../App.config'
import { useNavigation } from '@react-navigation/native'
import functions from '@react-native-firebase/functions'
import firestore from '@react-native-firebase/firestore';


export default function PartnerRevenueInfo(props) {
  const [user, setUser] = useState(null)
  const [gym, setGym] = useState(null)
  const [hasBankAccountAdded, setHasBankAccountAdded] = useState()
  const [errorMsg, setErrorMsg] = useState('')
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = React.useState(false);


  const [r, refresh] = useState(0)

  useEffect(() => {
    const init = async () => {
      const user = new User()
      const userDoc = await user.retrieveUser()
      const gym = (
        await user.retrievePartnerGyms()
      ).map(it => it.getAll())[ 0 ]
      setUser(userDoc)
      setGym(gym) 
      setHasBankAccountAdded(Boolean(userDoc.stripe_bank_account_id))
      // setHasBankAccountAdded(true)

      console.log("user (useEffect): ", user)

      // update Stripe balance revenue
      if (gym) {
        const updateStripeAccountRevenue = functions().httpsCallable('updateStripeAccountRevenue')
        await updateStripeAccountRevenue(gym.id)
      }
    }; init()
  }, [r])

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
  
  // Gets new partner data from firestore
  const onRefresh = React.useCallback(async() => {
    setRefreshing(true);
    const user = new User()
      const userDoc = await user.retrieveUser()
      const gym = (
        await user.retrievePartnerGyms()
    ).map(it => it.getAll())[ 0 ]

    const newUser = await firestore()
      .collection('partners')
      .doc(gym.partner_id)
      .get();
    setUser(newUser.data())
    wait(2000).then(() => setRefreshing(false));

  }, []);

  if (!user || !gym || hasBankAccountAdded === undefined) return <View />
   
  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} color="#333"/>
      }
      >
    <ProfileLayout
      innerContainerStyle={{
        paddingBottom: 10,
      }}
    >
      
        {/* Current Balance */}
        <CustomText
          style={styles.text}
          containerStyle={styles.textContainer}
          label='Current Balance'
        > 
          {`$${currencyFromZeroDecimal(user.revenue)}`}
        </CustomText>

        {/* Total Earnings */}
        <CustomText
          style={styles.text}
          containerStyle={styles.textContainer} 
          label='Total Earnings'
        > 
          {`$${currencyFromZeroDecimal(user.total_revenue)}`}
        </CustomText>
        {/* <CustomText
          style={styles.text}
          containerStyle={styles.textContainer}
          label="Member Count"
        >
          ?
        </CustomText> */}

        <CustomButton
          style={styles.button}
          textStyle={styles.buttonText}
          title="Memberships"
          onPress={() => navigation.navigate('PartnerUpdateMemberships')}
        />

        <Text style={{
          paddingTop: 15,
          paddingBottom: 10, 
          ...FONTS.subtitle,
          textAlign: "center",
          fontSize: 22,
        }}>Payouts</Text>

        <Text style={styles.error}>{ errorMsg }</Text>
  
        { !hasBankAccountAdded ? <> 
          <BankAccountFormWithButtonEntry
            onError={setErrorMsg} 
            onSuccess={() => refresh(r => r + 1)}
          />
          <PlaidButton onError={setErrorMsg} onSuccess={setHasBankAccountAdded}/> 
        </> : <>
          <Text style={styles.confirmation}>Your bank account has been linked.</Text>
          </>
        }

      <Text style={styles.miniText}>In order to receive payouts, you must also make sure to have provided all necessary information in the Profile Settings.</Text>
      </ProfileLayout>
      </ScrollView>

  )
}

const styles = StyleSheet.create({
  text: {
    paddingVertical: 8,
    alignSelf: "center",
    fontSize: 22,
  },
  textContainer: {
    marginVertical: 10,
  },
  miniText: {
    ...config.styles.body,
    fontSize: 12,
    textAlign: 'justify',
  },
  confirmation: {
    ...config.styles.body,
    color: 'green',
    textAlign: 'center',
    paddingBottom: 10,
  },
  error: {
    ...config.styles.body,
    color: 'red',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
})