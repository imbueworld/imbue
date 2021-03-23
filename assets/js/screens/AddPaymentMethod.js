import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Modal, ScrollView} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput} from 'react-native-gesture-handler';

import ProfileLayout from '../layouts/ProfileLayout';

import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';
import LottieView from 'lottie-react-native';
import User from '../backend/storage/User';
import {Formik} from 'formik';
import * as yup from 'yup';
import CustomTextInputV2 from '../components/CustomTextInputV2';
import {FONTS} from '../contexts/Styles';

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

  async function validateAndProceed(values) {
    setLoading(true);
    let [expMonth, expYear] = values.date.split(/[/\-\.]/);

    let form = {
      cardNumber: values.card_number,
      expMonth,
      expYear,
      cvc: values.ccv,
      name: values.name,
      address_zip: values.zip,
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

  const paymentValidationSchema = yup.object().shape({
    name: yup.string().required('Name of Holder is required.'),
    card_number: yup.string().required('Credit Card Number is required.'),
    date: yup.string().required('Expired date is required.'),
    ccv: yup.string().required('CCV is required.'),
    zip: yup.string().required('ZIP code is required.'),
  });

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
        <Formik
          validationSchema={paymentValidationSchema}
          initialValues={{
            name: '',
            card_number: '',
            date: '',
            ccv: '',
            zip: '',
          }}
          onSubmit={(values) => validateAndProceed(values)}>
          {({handleChange, errors, touched, handleSubmit, values}) => (
            <View style={{alignItems: 'center', flex: 1}}>
              <Text style={{color: 'red'}}>{errorMsg}</Text>

              <CustomTextInputV2
                containerStyle={styles.inputField}
                placeholder="Name of Holder"
                value={values.name}
                style={{
                  ...FONTS.textInput,
                  fontSize: 12,
                  width: '100%',
                }}
                containerStyle={{marginBottom: 10}}
                onChangeText={handleChange('name')}
              />
              {errors.name && touched.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
              <CustomTextInputV2
                containerStyle={styles.inputField}
                placeholder="Credit Card Number"
                value={values.card_number}
                isMask={true}
                mask={'[0000] [0000] [0000] [0000]'}
                style={{
                  ...FONTS.textInput,
                  fontSize: 12,
                  width: '100%',
                }}
                containerStyle={{marginBottom: 10}}
                onChangeText={handleChange('card_number')}
              />
              {errors.card_number && touched.card_number && (
                <Text style={styles.errorText}>{errors.card_number}</Text>
              )}
              <CustomTextInputV2
                containerStyle={styles.inputField}
                placeholder="MM/YY"
                value={values.date}
                isMask={true}
                mask={'[00]/[00]'}
                style={{
                  ...FONTS.textInput,
                  fontSize: 12,
                  width: '100%',
                }}
                containerStyle={{marginBottom: 10}}
                onChangeText={handleChange('date')}
              />
              {errors.date && touched.date && (
                <Text style={styles.errorText}>{errors.date}</Text>
              )}
              <CustomTextInputV2
                containerStyle={styles.inputField}
                placeholder="CCV"
                value={values.ccv}
                keyboardType="number-pad"
                style={{
                  ...FONTS.textInput,
                  fontSize: 12,
                  width: '100%',
                }}
                containerStyle={{marginBottom: 10}}
                onChangeText={handleChange('ccv')}
              />
              {errors.ccv && touched.ccv && (
                <Text style={styles.errorText}>{errors.ccv}</Text>
              )}
              <CustomTextInputV2
                containerStyle={styles.inputField}
                placeholder="ZIP"
                value={values.zip}
                keyboardType="number-pad"
                style={{
                  ...FONTS.textInput,
                  fontSize: 12,
                  width: '100%',
                }}
                containerStyle={{marginBottom: 10}}
                onChangeText={handleChange('zip')}
              />
              {errors.zip && touched.zip && (
                <Text style={styles.errorText}>{errors.zip}</Text>
              )}
              <CustomButton
                style={{width: '100%'}}
                title="Save"
                onPress={handleSubmit}
              />
            </View>
          )}
        </Formik>
      </ProfileLayout>
    </>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    paddingBottom: 10,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    ...FONTS.textInput,
    fontSize: 12,
    width: '100%',
  },
});
