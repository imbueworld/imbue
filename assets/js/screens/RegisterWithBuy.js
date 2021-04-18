import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { colors } from '../contexts/Colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CompanyLogo from '../components/CompanyLogo';
import { useRoute, useNavigation, StackActions } from '@react-navigation/core';
import { FONTS } from '../contexts/Styles';
import { Formik } from 'formik';
import CustomTextInputV2 from '../components/CustomTextInputV2';
import * as yup from 'yup';
import CustomButton from '../components/CustomButton';
import User from '../backend/storage/User';
import { handleAuthError } from '../backend/HelperFunctions';
import useStore from '../store/RootStore';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import RNCalendarEvents from 'react-native-calendar-events';
import Modal from 'react-native-modal'
import LottieView from 'lottie-react-native';
import functions from '@react-native-firebase/functions'

export const RegisterWithBuy = () => {
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const { step, classData, prevForm } = route.params;
  const [redFields, setRedFields] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const { userStore } = useStore();
  console.log('Data for test: ' + JSON.stringify(classData));
  const paymentValidationSchema = yup.object().shape({
    name: yup.string().required('Name of Holder is required.'),
    card_number: yup.string().required('Credit Card Number is required.'),
    date: yup.string().required('Expired date is required.'),
    ccv: yup.string().required('CCV is required.'),
    zip: yup.string().required('ZIP code is required.'),
  });

  const userValidationSchema = yup.object().shape({
    first: yup.string().required('First Name is required.'),
    last: yup
      .string()
      .required('Last Name is required.')
      .matches(
        /[A-Za-z]{2,100}/,
        'Last Name should consist of only letters, and at least two.',
      ),
    dob: yup
      .string()
      .required('First Name is required.')
      .max(10, 'Must be exactly 10 characters.'),
    email: yup
      .string()
      .required('Email is required.')
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Email is not valid.',
      ),
    password: yup
      .string()
      .required('Password is required.')
      .matches(
        /(?:(?:(?=.*?[0-9])(?=.*?[-!@#$%&*ˆ+=_])|(?:(?=.*?[0-9])|(?=.*?[A-Z])|(?=.*?[-!@#$%&*ˆ+=_])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%&*ˆ+=_]))[A-Za-z0-9-!@#$%&*ˆ+=_]{6,15}/,
        'The given password is invalid.',
      ),
    passwordConfirm: yup
      .string()
      .required('Confirm password is required.')
      .test('match', 'Passwords do not match', function () {
        return this.parent.password === this.parent.passwordConfirm;
      }),
  });

  const buyClassForUser = async (form) => {
    setLoading(true)
    setErrorMsg('');
    try {
      let type = 'user';
      const user = new User();
      await user.create({
        first: form.first,
        last: form.last,
        email: form.email,
        password: form.password,
        type,
      });
      const DateMoment = moment(form.dob, 'MM-DD-YYYY');
      let dobInfo = {
        day: DateMoment.date(),
        month: DateMoment.month() + 1,
        year: DateMoment.year(),
      };
      await firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          dob: dobInfo,
        });
      let [expMonth, expYear] = prevForm.date.split(/[/\-\.]/);
      let cardForm = {
        cardNumber: prevForm.card_number,
        expMonth,
        expYear,
        cvc: prevForm.ccv,
        name: prevForm.name,
        address_zip: prevForm.zip,
      };
      const paymentMethod = await user.addPaymentMethod(cardForm);
      await user.purchaseClass({
        paymentMethodId: paymentMethod.id,
        classId: classData.id,
        timeId: classData.time_id,
      });
      userStore.getUserClasses();
      navigation.reset({
        index: 0,
        routes: [{ name: 'UserDashboard' }],
      })
    } catch (err) {
      if (!errorMsg) {
        let [errorMsg, redFields] = handleAuthError(err);
        setRedFields(redFields);
        setErrorMsg(errorMsg);
        return;
      }
      setErrorMsg(errorMsg);
    } finally {
      setLoading(false)
    }
  }

  const reserveClassForUser = async (form) => {
    try {
      let type = 'user';
      setLoading(true)
      setErrorMsg('')
      const { time_id, begin_time, end_time } = classData;

      const updatedClass = await firestore().collection('classes').doc(classData.id).get();

      let calendarId = updatedClass.data().calendarId;

      if (calendarId) {
        RNCalendarEvents.removeEvent(calendarId)
      }
      const permissionCalendar = await RNCalendarEvents.checkPermissions()
      console.log({
        classId: classData.id,
        timeId: classData.time_id,
      })
      if (permissionCalendar != "authorized") {
        RNCalendarEvents.requestPermissions();
      }
      let response = await RNCalendarEvents.saveEvent(
        classData.name + ' Imbue Class',
        {
          startDate: begin_time,
          endDate: end_time,
          notes: 'Open the Imbue app at class time to join'
        }
      )

      firestore().collection('classes').doc(classData.id).update({ calendarId: response })

      const user = new User();
      await user.create({
        first: form.first,
        last: form.last,
        email: form.email,
        password: form.password,
        type,
      });
      const DateMoment = moment(form.dob, 'MM-DD-YYYY');
      let dobInfo = {
        day: DateMoment.date(),
        month: DateMoment.month() + 1,
        year: DateMoment.year(),
      };
      await firestore()
        .collection('users')
        .doc(user.uid)
        .update({
          dob: dobInfo,
        });
      await user.addClassToCalender({
        classId: classData.id,
        timeId: classData.time_id,
      });
      try {
        console.log(
          'sendGridMemberPurchasedClass???',
        );
        const sendGridMemberPurchasedClass = functions().httpsCallable(
          'sendGridMemberPurchasedClass',
        );
        await sendGridMemberPurchasedClass(classData.gym_id);
      } catch (err) {
        console.log(err)
        setErrorMsg('Email could not be sent');
      }
      try {
        console.log('IDDDD: ', user.uid);

        // initiate SendGrid email
        console.log('user.id: ', user.uid);
        const sendGridMemberAddedClass = functions().httpsCallable(
          'sendGridMemberAddedClass',
        );
        await sendGridMemberAddedClass(user.uid);
      } catch (err) {
        console.log(err)
        setErrorMsg('Email could not be sent');
      }
      userStore.getUserClasses();
      navigation.reset({
        index: 0,
        routes: [{ name: 'UserDashboard' }],
      })
      navigation.dispatch(pushAction)
    } catch (err) {
      console.log(err);
      switch (err.code) {
        case 'busy':
          setErrorMsg(err.message);
          break;
        case 'class-already-added':
          setSuccessMsg(err.message);
          break;
        default:
          setErrorMsg(
            'Something prevented the action.',
          );
          break;
      }
    } finally {
      setLoading(false)
    }
  }

  const getStepForm = () => {
    switch (step) {
      case 'card':
        return (
          <Formik
            validationSchema={paymentValidationSchema}
            initialValues={{
              name: 'Oleksandr Volynets',
              card_number: '5375414104561229',
              date: '09/24',
              ccv: '479',
              zip: '35-301',
            }}
            onSubmit={form =>
              navigation.push('RegisterWithBuy', {
                classData: classData,
                step: 'user',
                prevForm: form,
              })
            }>
            {({ handleChange, errors, touched, handleSubmit, values }) => (
              <View style={styles.form}>
                <CustomTextInputV2
                  containerStyle={styles.inputField}
                  placeholder="Name of Holder"
                  value={values.name}
                  style={{
                    ...FONTS.textInput,
                    fontSize: 12,
                    width: '100%',
                  }}
                  containerStyle={{ marginBottom: 10 }}
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
                  containerStyle={{ marginBottom: 10 }}
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
                  containerStyle={{ marginBottom: 10 }}
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
                  containerStyle={{ marginBottom: 10 }}
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
                  containerStyle={{ marginBottom: 10 }}
                  onChangeText={handleChange('zip')}
                />
                {errors.zip && touched.zip && (
                  <Text style={styles.errorText}>{errors.zip}</Text>
                )}
                <CustomButton
                  style={{ width: '100%', marginVertical: 20 }}
                  title="Next"
                  onPress={handleSubmit}
                />
              </View>
            )}
          </Formik>
        );
      case 'user':
        return (
          <Formik
            validationSchema={userValidationSchema}
            initialValues={{
              first: 'Oleksander',
              last: 'Vonnserer',
              email: 'vonsworktest@gmail.com',
              dob: '11-24-1999',
              password: 'Fvbhrf0211@',
              passwordConfirm: 'Fvbhrf0211@',
            }}
            onSubmit={async form => classData.priceType === 'free' ? reserveClassForUser(form) : buyClassForUser(form)}>
            {({ handleChange, errors, touched, handleSubmit, values }) => (
              <View style={styles.form}>
                {errorMsg !== '' ? (
                  <Text style={{ color: 'red', textAlign: 'center' }}>
                    {errorMsg}
                  </Text>
                ) : null}
                <CustomTextInputV2
                  containerStyle={styles.inputField}
                  placeholder="First Name"
                  value={values.first}
                  style={{
                    ...FONTS.textInput,
                    fontSize: 12,
                    width: '100%',
                  }}
                  containerStyle={{ marginBottom: 10 }}
                  onChangeText={handleChange('first')}
                />
                {errors.first && touched.first && (
                  <Text style={styles.errorText}>{errors.first}</Text>
                )}
                <CustomTextInputV2
                  containerStyle={styles.inputField}
                  placeholder="Last Name"
                  value={values.last}
                  style={{
                    ...FONTS.textInput,
                    fontSize: 12,
                    width: '100%',
                  }}
                  containerStyle={{ marginBottom: 10 }}
                  onChangeText={handleChange('last')}
                />
                {errors.last && touched.last && (
                  <Text style={styles.errorText}>{errors.last}</Text>
                )}
                <CustomTextInputV2
                  containerStyle={styles.inputField}
                  placeholder="Email"
                  value={values.email}
                  style={{
                    ...FONTS.textInput,
                    fontSize: 12,
                    width: '100%',
                  }}
                  containerStyle={{ marginBottom: 10 }}
                  onChangeText={handleChange('email')}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
                <CustomTextInputV2
                  containerStyle={styles.inputField}
                  placeholder="Date of Birth (MM-DD-YYYY)"
                  value={values.dob}
                  isMask={true}
                  mask={'[00]-[00]-[0000]'}
                  style={{
                    ...FONTS.textInput,
                    fontSize: 12,
                    width: '100%',
                  }}
                  containerStyle={{ marginBottom: 10 }}
                  onChangeText={handleChange('dob')}
                />
                {errors.dob && touched.dob && (
                  <Text style={styles.errorText}>{errors.dob}</Text>
                )}
                <CustomTextInputV2
                  containerStyle={styles.inputField}
                  placeholder="Password"
                  value={values.password}
                  style={{
                    ...FONTS.textInput,
                    fontSize: 12,
                    width: '100%',
                  }}
                  containerStyle={{ marginBottom: 10 }}
                  onChangeText={handleChange('password')}
                />
                {errors.password && touched.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
                <CustomTextInputV2
                  containerStyle={styles.inputField}
                  placeholder="Confirm Password"
                  value={values.passwordConfirm}
                  style={{
                    ...FONTS.textInput,
                    fontSize: 12,
                    width: '100%',
                  }}
                  containerStyle={{ marginBottom: 10 }}
                  onChangeText={handleChange('passwordConfirm')}
                />
                {errors.passwordConfirm && touched.passwordConfirm && (
                  <Text style={styles.errorText}>{errors.passwordConfirm}</Text>
                )}
                <CustomButton
                  style={{ width: '100%', marginVertical: 20 }}
                  title="Sign Up"
                  onPress={handleSubmit}
                />
              </View>
            )}
          </Formik>
        );
      default:
        return <Text>{'Default'}</Text>;
    }
  };

  return (
    <>
      <Modal visible={loading} animationType={'fade'} style={{ margin: 0 }} transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.8)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <LottieView
            source={require('../components/img/animations/cat-loading.json')}
            style={{ height: 100, width: 100 }}
            autoPlay
            loop
          />
        </View>
      </Modal>
      <SafeAreaView style={{ backgroundColor: 'white' }}>
        <KeyboardAwareScrollView>
          <CompanyLogo />
          <Text
            style={styles.title}>{`Buy One Time Class\n${classData.name}`}</Text>
          {getStepForm()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </>
  );
};

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  title: {
    ...FONTS.luloClean,
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  form: {
    flex: 1,
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    ...FONTS.textInput,
    fontSize: 12,
    width: '100%',
  },
});
