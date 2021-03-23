import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Keyboard} from 'react-native';

import ProfileLayout from '../layouts/ProfileLayout';

import CustomTextInput from '../components/CustomTextInput';
import CustomButton from '../components/CustomButton';

import auth from '@react-native-firebase/auth';
import {FONTS} from '../contexts/Styles';
import moment from 'moment';
import {useNavigation, useRoute} from '@react-navigation/native';
import {handleAuthError} from '../backend/HelperFunctions';
import User from '../backend/storage/User';
import CustomTextInputV2 from '../components/CustomTextInputV2';
import config from '../../../App.config';
import {useForm} from 'react-hook-form';
import {geocodeAddress} from '../backend/BackendFunctions';
import Gym from '../backend/storage/Gym';
import PlaidButton from '../components/PlaidButton';
import BankAccountFormWithButtonEntry from '../components/BankAccountFormWithButtonEntry';
import functions from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';
import {Formik} from 'formik';
import * as yup from 'yup';
const p = console.log;

export default function ProfileSettings(props) {
  const {params} = useRoute();
  const {form, type} = params;
  const [user, setUser] = useState(null);
  const [isForeignUser, setIsForeignUser] = useState();
  const navigation = useNavigation();
  const [hasBankAccountAdded, setHasBankAccountAdded] = useState(false);
  const [gym, setGym] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [r, refresh] = useState(0);

  useEffect(() => {
    const init = async () => {
      const user = new User();
      const userDoc = await user.retrieveUser();
      setUser(userDoc);
      setIsForeignUser(userDoc.icon_uri_foreign ? true : false);
      const gym = (await user.retrievePartnerGyms()).map((it) =>
        it.getAll(),
      )[0];
      setUser(userDoc);
      setGym(gym);
    };
    init();
  }, [r]);

  // useEffect(() => {
  //   if (!user) return;
  //   setEmailField(user.email);
  //   let {day, month, year} = user.dob || {};
  //   let dobString = user.dob ? `${month}-${day}-${year}` : '';
  //   setDob(dobString);
  //   setAddress(user.formatted_address);
  //   setPhone(user.phone);
  //   setSSNLast4(user.ssn_last_4);
  // }, [user]);

  const [redFields, setRedFields] = useState([]);

  const [successMsg, setSuccessMsg] = useState('');
  const [changing, change] = useState('safeInfo');

  const updateSafeInfoForPartner = async (form) => {
    console.log(form);
    const gym = new Gym();
    await gym.retrievePartnerGym(); // Loads (or instantly accesses cached) data, finishes instantiation
    setErrorMsg('');
    setSuccessMsg('');

    const DateMoment = moment(form.dob, 'MM-DD-YYYY');

    try {
      let updatables = {
        dob: {
          day: DateMoment.date(),
          month: DateMoment.month() + 1,
          year: DateMoment.year(),
        },
      };

      let pfGeocodeAddress;
      if (form.address) pfGeocodeAddress = await geocodeAddress(form.address);
      if (pfGeocodeAddress) {
        const {address, formatted_address} = pfGeocodeAddress;

        updatables.address = address;
        updatables.formatted_address = formatted_address;
      }

      if (form.phone) updatables.phone = form.phone.replace(/[^0-9]/g, '');
      if (form.ssn_last_4) updatables.ssn_last_4 = form.ssn_last_4;

      console.log('UPDATABLES: ', updatables);

      const userObj = new User();
      await userObj.init();
      userObj.mergeItems(updatables);

      await Promise.all([
        userObj.push(),
        gym.push(),

        // Update stripe details, the function will automatically avoid calling
        // Cloud Function endpoint if there was nothing to update.
        //
        // note: Currently only minimum required fields are updated in stripe
        // (ones that weren't added during Partner Sign Up).

        // userObj.updateStripeAccount(updatables, { pfGeocodeAddress, pfGeocodeCompanyAddress }),
        userObj.updateStripeAccount(updatables, {pfGeocodeAddress}),
        navigation.navigate('SuccessScreen', {
          successMessageType: 'PartnerAccountCreated',
          userName: user.name,
        }),
      ]);
      Keyboard.dismiss();
    } catch (err) {
      if (config.DEBUG) console.error(err);
      let [errorMsg, redFields] = handleAuthError(err);
      setErrorMsg(errorMsg);
    }
  };

  if (!user || isForeignUser === undefined) return <View />;

  const birthValidationSchema = yup.object().shape({
    dob: yup
      .string()
      .required('Date of birth is required.')
      .matches(
        /^(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])(-)\d{4}$/,
        'The given date of birth is invalid. Required format MM-DD-YYYY',
      ),
    ssn_last_4: yup
      .string()
      .required('Last 4 SSN is required.')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(4, 'Must be exactly 4 digits')
      .max(4, 'Must be exactly 4 digits'),
    address: yup.string().required('Address is required.'),
    phone: yup
      .string()
      .required('Phone number is required')
      .matches(
        /^[0-9]{3}-[0-9]{7}$/,
        'The given phone number is invalid. Required format XXX-XXXXXXX',
      ),
  });

  const stripeValidationSchema = yup.object().shape({
    routing: yup.string().required('Routing is required.'),
    account: yup.string().required('Account is required.'),
  });

  if (type === 'birth')
    return (
      <Formik
        validationSchema={birthValidationSchema}
        initialValues={{
          dob: '',
          ssn_last_4: '',
          address: '',
          phone: '',
        }}
        onSubmit={(values) =>
          navigation.push('PartnerOnboardStripeQuestions', {
            type: 'bank',
            form: values,
          })
        }>
        {({handleChange, errors, touched, handleSubmit, values}) => (
          <ProfileLayout
            hideBackButton={true}
            buttonOptions={{
              logOut: {
                show: false,
              },
            }}
            onNextButton={handleSubmit}>
            <View>
              <Text style={styles.profileName}>{user.name}</Text>
            </View>

            <View>
              <Text
                style={{
                  ...FONTS.subtitle,
                  textAlign: 'center',
                  fontSize: 12,
                  marginBottom: 10,
                }}
                textAlign="center">
                enter your date of birth
              </Text>
            </View>
            <View
              style={{width: '100%', alignItems: 'center', marginBottom: 100}}>
              <CustomTextInputV2
                containerStyle={styles.inputField}
                placeholder="Date of Birth"
                value={values.dob}
                isMask={true}
                mask={'[00]-[00]-[0000]'}
                onChangeText={handleChange('dob')}
                maxLength={10}
              />
              {errors.dob && touched.dob && (
                <Text style={styles.errorText}>{errors.dob}</Text>
              )}
              <CustomTextInputV2
                containerStyle={styles.inputField}
                placeholder="SSN Last 4"
                value={values.ssn_last_4}
                onChangeText={handleChange('ssn_last_4')}
                keyboardType="numeric"
                maxLength={10}
              />
              {errors.ssn_last_4 && touched.ssn_last_4 && (
                <Text style={styles.errorText}>{errors.ssn_last_4}</Text>
              )}
              <CustomTextInputV2
                containerStyle={styles.inputField}
                placeholder="Address"
                value={values.address}
                onChangeText={handleChange('address')}
              />
              {errors.address && touched.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}
              <CustomTextInputV2
                containerStyle={styles.inputField}
                placeholder="Phone Number"
                value={values.phone}
                isMask={true}
                mask={'[000]-[0000000]'}
                onChangeText={handleChange('phone')}
              />
              {errors.phone && touched.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}
            </View>

            {/* <CustomTextInputV2
            containerStyle={styles.inputField}
            red={redFields.includes('address')}
            placeholder="Personal Address"
            value={address}
            onChangeText={setAddress}
          />

          <CustomTextInputV2
            containerStyle={styles.inputField}
            red={redFields.includes('phone')}
            placeholder="Phone"
            value={phone}
            onChangeText={(text) => setPhone(handlePhone(text))}
          />

          <CustomTextInputV2
            containerStyle={styles.inputField}
            red={redFields.includes('ssn_last_4')}
            placeholder="SSN Last 4"
            value={ssn_last_4}
            onChangeText={setSSNLast4}
          />
          <Text
            style={{
              paddingTop: 20,
              paddingBottom: 10,
              ...FONTS.subtitle,
              textAlign: 'center',
              fontSize: 16,
            }}>
            Add bank account
          </Text>

          {!hasBankAccountAdded ? (
            <>
              <BankAccountFormWithButtonEntry
                onError={setErrorMsg}
                onSuccess={() => refresh((r) => r + 1)}
              />
              <PlaidButton
                onError={setErrorMsg}
                onSuccess={setHasBankAccountAdded(true)}
              />
            </>
          ) : (
            <>
              <Text style={styles.confirmation}>
                Your bank account has been linked.
              </Text>
            </>
          )}

          <Text style={styles.error}>{errorMsg}</Text>

          {hasBankAccountAdded ? (
            <CustomButton
              style={styles.button}
              title="Finish 
        Your Account!"
              onPress={updateSafeInfoForPartner}
            />
          ) : null} */}
          </ProfileLayout>
        )}
      </Formik>
    );

  if (type === 'bank')
    return (
      <Formik
        validationSchema={stripeValidationSchema}
        initialValues={{
          routing: '',
          account: '',
        }}
        onSubmit={(values) => updateSafeInfoForPartner({...form, ...values})}>
        {({handleChange, errors, touched, handleSubmit, values}) => (
          <ProfileLayout
            hideBackButton={true}
            buttonOptions={{
              logOut: {
                show: false,
              },
            }}
            onNextButton={handleSubmit}>
            <View>
              <Text style={styles.profileName}>{user.name}</Text>
            </View>
            {errorMsg ? (
              <Text
                style={{color: 'red', textAlign: 'center', marginBottom: 10}}>
                {errorMsg}
              </Text>
            ) : (
              <Text style={{color: 'green'}}>{successMsg}</Text>
            )}
            <View>
              <Text
                style={{
                  ...FONTS.subtitle,
                  textAlign: 'center',
                  fontSize: 12,
                  marginBottom: 10,
                }}
                textAlign="center">
                finally, connect your bank account
              </Text>
            </View>
            <View style={{width: '100%', alignItems: 'center'}}>
              <CustomTextInputV2
                containerStyle={styles.inputField}
                placeholder="routing #"
                value={values.routing}
                onChangeText={handleChange('routing')}
              />
              {errors.routing && touched.routing && (
                <Text style={styles.errorText}>{errors.routing}</Text>
              )}
              <CustomTextInputV2
                containerStyle={styles.inputField}
                placeholder="account #"
                value={values.account}
                onChangeText={handleChange('account')}
              />
              {errors.account && touched.account && (
                <Text style={styles.errorText}>{errors.account}</Text>
              )}
            </View>
            <Text
              style={{
                ...FONTS.subtitle,
                textAlign: 'center',
                fontSize: 12,
                marginVertical: 10,
              }}
              textAlign="center">
              or connect using plaid
            </Text>
            {/* {!hasBankAccountAdded ? (
              <View style={{marginBottom: 100}}>
                <PlaidButton
                  onError={setErrorMsg}
                  onSuccess={() => setHasBankAccountAdded(true)}
                />
              </View>
            ) : (
              <>
                <Text style={styles.confirmation}>
                  Your bank account has been linked.
                </Text>
              </>
            )} */}
          </ProfileLayout>
        )}
      </Formik>
    );
}

const styles = StyleSheet.create({
  text: {
    paddingVertical: 8,
    alignSelf: 'center',
    fontSize: 22,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  textContainer: {
    marginVertical: 10,
    marginStart: 5,
    marginEnd: 5,
  },
  miniText: {
    ...config.styles.body,
    fontSize: 12,
    alignSelf: 'center',
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
  profileName: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    ...FONTS.subtitle,
    fontSize: 17,
  },
  forwardButtonContainer: {
    marginBottom: 30,
    alignSelf: 'flex-end',
    marginEnd: 5,
    backgroundColor: '#ffffff',
    marginTop: 5,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  inputField: {
    marginBottom: 14,
    marginRight: 30,
    marginLeft: 30,
    fontSize: 6,
  },
});
