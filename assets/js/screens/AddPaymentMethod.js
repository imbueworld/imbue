import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Modal, ScrollView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput} from 'react-native-gesture-handler';

import ProfileLayout from '../layouts/ProfileLayout';

import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import LottieView from 'lottie-react-native';
import User from '../backend/storage/User';

// 4000000760000002 // Visa
// 5555555555554444 // Mastercard
// 6011111111111117 // Discover
// const exampleUser = {
//     cardNumber: "4000 0007 6000 0002",
//     expMonth: "12",
//     expYear: "69",
//     cvc: "699",
//     name: "Oskar Tree",
//     address_zip: "699",
// }

export default function AddPaymentMethod(props) {
  const {referrer} = props.route.params;
  const [loading, setLoading] = useState(false);
  const [holderNameText, setHolderNameText] = useState('');
  const [creditCardText, setCreditCard] = useState('');
  const [expireDateText, setExpireDateText] = useState('');
  const [CVCText, setCVCText] = useState('');
  const [zipCodeText, setZipCodeText] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const user = new User();
      setUser(await user.retrieveUser());
    };
    init();
  }, []);

  async function validateAndProceed() {
    setLoading(true);
    let [expMonth, expYear] = expireDateText.split(/[/\-\.]/);

    let form = {
      cardNumber: creditCardText,
      expMonth,
      expYear,
      cvc: CVCText,
      name: holderNameText,
      address_zip: zipCodeText,
    };

    try {
      const userObj = new User();
      console.log(form);
      await userObj.addPaymentMethod(form);
      if (!referrer) {
        props.navigation.goBack();
        return;
      }
      setLoading(false);
      props.navigation.navigate(referrer, {referrer: 'AddPaymentSettings'});
    } catch (err) {
      console.log(err);
      setLoading(false);
      setErrorMsg('Something prevented the action.');
    }
  }

  // adds hyphens in text input
  const handleExp = (text) => {
    if (text.length == 2) {
      text = text += '-';
      return text;
    }

    return text;
  };

  if (!user) return <View />;

  return (
    <>
      <Modal visible={loading} animationType={'fade'} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <LottieView
            source={require('../components/img/animations/cat-loading.json')}
            style={{height: 100, width: 100}}
            autoPlay
            loop
          />
        </View>
      </Modal>
      <ProfileLayout innerContainerStyle={styles.innerContainer}>
        <Text style={{color: 'red'}}>{errorMsg}</Text>

        <CustomTextInput
          placeholder="Name of Holder"
          multiline={true}
          value={holderNameText}
          onChangeText={(text) => setHolderNameText(text)}
        />
        <CustomTextInput
          placeholder="Credit Card Number"
          multiline={true}
          value={creditCardText}
          keyboardType="number-pad"
          onChangeText={(text) =>
            setCreditCard(text.replace(/\W/gi, '').replace(/(.{4})/g, '$1 '))
          }
        />
        <CustomTextInput
          placeholder="MM-YY"
          multiline={true}
          value={expireDateText}
          onChangeText={(text) => setExpireDateText(handleExp(text))}
        />
        <CustomTextInput
          multiline={true}
          keyboardType="number-pad"
          placeholder="CCV"
          value={CVCText}
          onChangeText={(text) => setCVCText(text)}
        />
        <CustomTextInput
          multiline={true}
          keyboardType="number-pad"
          placeholder="ZIP"
          value={zipCodeText}
          onChangeText={(text) => setZipCodeText(text)}
        />
        <CustomButton title="Save" onPress={validateAndProceed} />
      </ProfileLayout>
    </>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    paddingBottom: 10,
  },
});
