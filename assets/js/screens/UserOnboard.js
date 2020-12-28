import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View, RefreshControl, Text, ScrollView } from 'react-native'

import ProfileLayout from "../layouts/ProfileLayout"
import CustomButton from "../components/CustomButton"
import Icon from '../components/Icon'
import CustomText from "../components/CustomText"
import { TouchableHighlight } from 'react-native-gesture-handler'
import ForwardButton from '../components/ForwardButton'
import { simpleShadow, colors } from '../contexts/Colors'

import User from '../backend/storage/User'
import { FONTS } from '../contexts/Styles'
import { currencyFromZeroDecimal } from '../backend/HelperFunctions'
import PlaidButton from '../components/PlaidButton'
import BankAccountFormWithButtonEntry from '../components/BankAccountFormWithButtonEntry'
import config from '../../../App.config'
import { useNavigation } from '@react-navigation/native'
import functions from '@react-native-firebase/functions'
import firestore from '@react-native-firebase/firestore';



export default function PartnerDashboard(props) {
  const [user, setUser] = useState(null)
  const [hasBankAccountAdded, setHasBankAccountAdded] = useState()
  const [errorMsg, setErrorMsg] = useState('')
  const navigation = useNavigation()
  const [refreshing, setRefreshing] = React.useState(false);

  const [r, refresh] = useState(0)

  useEffect(() => {
    async function init() {
      const user = new User()
      const userDoc = await user.retrieveUser()

    }; init()
  }, [r])

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const user = new User()
    const userDoc = await user.retrieveUser()
    const gym = (
      await user.retrievePartnerGyms()
    ).map(it => it.getAll())[0]

    const newUser = await firestore()
      .collection('partners')
      .doc(gym.partner_id)
      .get();
    setUser(newUser.data())
    wait(2000).then(() => setRefreshing(false));

  }, []);

  if (!user || !gym || hasBankAccountAdded === undefined) return <View />


  return (
    <>
      <ProfileLayout
        innerContainerStyle={{
          padding: 10,
        }}
        hideBackButton={true}
        buttonOptions={{
          logOut: {
            show: false,
          },
        }}
      >
        <View>
          <Text
            style={styles.profileName}
          >
            {user.name}
        </Text>
        </View>
        <View>
          <Text
            style={styles.miniText}
          >
            Welcome to imbue! One last thing before you sign in, we need you to input your Date of Birth!
        </Text>
        </View>

        <CustomTextInputV2
            containerStyle={styles.inputField}
            red={redFields.includes('dob')}
            // keyboardType='numeric'
            placeholder='Date of Birth (MM-DD-YYYY)'
            value={dob}
            // onChangeText={(text) => console.log("text: ", text)}
            onChangeText={setDob}
          />

        <View>
          <TouchableHighlight
            style={styles.forwardButtonContainer}
            underlayColor="#eed"
            onPress={(() => navigation.navigate('PartnerOnboardPhoto'))}
          >
            <ForwardButton
              imageStyle={{
                width: 47,
                height: 47,
                simpleShadow,
              }}
            />
          </TouchableHighlight>
        </View>


      </ProfileLayout>
    </>
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
    marginStart: 5,
    marginEnd: 5,
  },
  miniText: {
    ...config.styles.body,
    fontSize: 12,
    textAlign: 'justify',
  },
  profileName: {
    marginTop: 15,
    marginBottom: 10,
    alignSelf: "center",
    ...FONTS.luloClean,
    fontSize: 16,
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
  forwardButtonContainer: {
    marginBottom: 30,
    alignSelf: "flex-end",
    marginEnd: 5,
    backgroundColor: "#ffffff",
    marginTop: 25,
  },
})
