import React, {useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import {StyleSheet} from 'react-native';
import {FONTS} from '../contexts/Styles';
import functions from '@react-native-firebase/functions';
import {PartnerApplyBackground} from '../components/PartnerApplyBackground';
import CustomTextInputV2 from '../components/CustomTextInputV2';
import {useNavigation, useRoute} from '@react-navigation/core';
import {NetworkInfo} from 'react-native-network-info';
import CustomButton from '../components/CustomButton';
import {Formik} from 'formik';
import User from '../backend/storage/User';
import Gym from '../backend/storage/Gym';
import {showMessage, hideMessage} from 'react-native-flash-message';
import * as yup from 'yup';
import LottieView from 'lottie-react-native';

export const PartnerStep = () => {
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState(ip);
  const navigation = useNavigation();
  const {params} = useRoute();

  const {step, form} = params;

  useEffect(() => {
    // Stripe TOS agreement requirement
    NetworkInfo.getIPV4Address().then(setIp);
  }, []);

  const nameValidationSchema = yup.object().shape({
    firstName: yup.string().required('First Name is required.'),
    lastName: yup
      .string()
      .required('Last Name is required.')
      .matches(
        /[A-Za-z]{2,100}/,
        'Last Name should consist of only letters, and at least two.',
      ),
  });

  const emailValidationSchema = yup.object().shape({
    email: yup
      .string()
      .required('Email is required.')
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Email is not valid.',
      ),
  });

  const gymValidationSchema = yup.object().shape({
    gym_description: yup.string().required('Your workouts is required.'),
  });

  const socialMediaValidationSchema = yup.object().shape({
    social_media: yup.string().required('Social Media is required.'),
  });

  const partnerSumbitButton = async (values) => {
    if (loading) return;
    setLoading(true);
    const updated_form = {
      ...values,
      ...form,
    };
    const {
      firstName,
      lastName,
      password,
      confirm_password,
      gym_description,
      social_media,
      email,
      ...USER
    } = updated_form;

    const partner = new User();
    let errMsg = await partner.create({
      ...USER,
      first: firstName,
      last: lastName,
      name: firstName + ' ' + lastName,
      password,
      social_media,
      email: email,
      type: 'partner',
    });

    if (errMsg === 'Email is taken.') {
      showMessage({
        message: errMsg,
        type: 'default',
        backgroundColor: 'red',
        color: '#fff',
      });
      navigation.setParams({
        step: 'email',
        form: form,
      });
      setLoading(false);
      return;
    }

    try {
      const createStripeSeller = functions().httpsCallable(
        'createStripeSeller',
      );
      await createStripeSeller({
        ...USER,
        firstName,
        lastName,
        product_description: gym_description,
        ip,
      });
    } catch (err) {
      console.log(err);
      showMessage({
        message: 'Try later',
        type: 'default',
        backgroundColor: 'red',
        color: '#fff',
      });
      await partner.delete();
      setLoading(false);
      return;
    }

    // Create gym
    const gym = new Gym();
    await gym.create({
      image_uri: 'imbueProfileLogoBlack.png',
      name: firstName + ' ' + lastName,
      description: gym_description,
      partner_id: partner.uid,
      social_media: social_media,
    });

    partner.mergeItems({
      associated_gyms: [gym.uid],
    });
    await partner.push();

    try {
      let listName = 'applied influencer';
      // Add to Sendgrid
      const addToSendGrid = functions().httpsCallable('addToSendGrid');
      await addToSendGrid({
        email,
        first: firstName,
        last: lastName,
        listName,
      });
    } catch (err) {
      console.log("addToSendGrid didn't work: ", err);
    }
    setLoading(false);
    navigation.push('PartnerStep', {step: 'end'});
  };

  const passwordValidationSchema = yup.object().shape({
    password: yup
      .string()
      .required('Password is required.')
      .matches(
        /(?:(?:(?=.*?[0-9])(?=.*?[-!@#$%&*ˆ+=_])|(?:(?=.*?[0-9])|(?=.*?[A-Z])|(?=.*?[-!@#$%&*ˆ+=_])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%&*ˆ+=_]))[A-Za-z0-9-!@#$%&*ˆ+=_]{6,15}/,
        'The given password is invalid.',
      ),
    confirm_password: yup
      .string()
      .required('Confirm password is required.')
      .test('match', 'Passwords do not match', function () {
        return this.parent.password === this.parent.confirm_password;
      }),
  });

  switch (step) {
    case 'name':
      return (
        <Formik
          validationSchema={nameValidationSchema}
          initialValues={{
            firstName: '',
            lastName: '',
          }}
          onSubmit={(values) =>
            navigation.push('PartnerStep', {step: 'email', form: values})
          }>
          {({handleChange, errors, touched, handleSubmit, values}) => (
            <PartnerApplyBackground onNextButton={handleSubmit}>
              <Text style={styles.body}>
                TO START, WHAT'S YOUR FIRST & LAST NAME?
              </Text>
              <View style={{alignItems: 'center'}}>
                <CustomTextInputV2
                  containerStyle={styles.inputField}
                  placeholder="FIRST NAME"
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                />
                {errors.firstName && touched.firstName && (
                  <Text style={styles.errorText}>{errors.firstName}</Text>
                )}
                <CustomTextInputV2
                  containerStyle={styles.inputField}
                  placeholder="LAST NAME"
                  value={values.lastName}
                  onChangeText={handleChange('lastName')}
                />
                {errors.lastName && touched.lastName && (
                  <Text style={styles.errorText}>{errors.lastName}</Text>
                )}
              </View>
            </PartnerApplyBackground>
          )}
        </Formik>
      );
    case 'email':
      return (
        <Formik
          validationSchema={emailValidationSchema}
          initialValues={{email: form.email ? form.email : ''}}
          onSubmit={(values) =>
            navigation.push('PartnerStep', {
              step: 'workout',
              form: {
                ...form,
                ...values,
              },
            })
          }>
          {({handleChange, errors, touched, handleSubmit, values}) => (
            <PartnerApplyBackground onNextButton={handleSubmit}>
              <Text style={styles.body}>ENTER YOUR EMAIL</Text>
              <View style={{alignItems: 'center'}}>
                <CustomTextInputV2
                  containerStyle={styles.inputField}
                  placeholder="EMAIL"
                  keyboardType="email-address"
                  secureTextEntry={false}
                  value={values.email}
                  onChangeText={handleChange('email')}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>
            </PartnerApplyBackground>
          )}
        </Formik>
      );
    case 'workout':
      return (
        <Formik
          validationSchema={gymValidationSchema}
          initialValues={{
            gym_description: form.gym_description ? form.gym_description : '',
          }}
          onSubmit={(values) => {
            navigation.push('PartnerStep', {
              step: 'social',
              form: {
                ...form,
                ...values,
              },
            });
          }}>
          {({handleChange, errors, touched, handleSubmit, values}) => (
            <PartnerApplyBackground onNextButton={handleSubmit}>
              <Text style={styles.body}>DESCRIBE YOUR WORKOUTS</Text>
              <View style={{alignItems: 'center'}}>
                <CustomTextInputV2
                  multiline
                  containerStyle={styles.inputField}
                  placeholder="DESCRIBE YOUR WORKOUTS"
                  value={values.gym_description}
                  onChangeText={handleChange('gym_description')}
                />
                {errors.gym_description && touched.gym_description && (
                  <Text style={styles.errorText}>{errors.gym_description}</Text>
                )}
              </View>
            </PartnerApplyBackground>
          )}
        </Formik>
      );
    case 'social':
      return (
        <Formik
          validationSchema={socialMediaValidationSchema}
          initialValues={{
            social_media: form.social_media ? form.social_media : '',
          }}
          onSubmit={(values) => {
            navigation.push('PartnerStep', {
              step: 'password',
              form: {
                ...form,
                ...values,
              },
            });
          }}>
          {({handleChange, errors, touched, handleSubmit, values}) => (
            <PartnerApplyBackground onNextButton={handleSubmit}>
              <Text style={styles.body}>
                WHERE CAN WE FIND YOU ON SOCIAL MEDIA?
              </Text>
              <View style={{alignItems: 'center'}}>
                <CustomTextInputV2
                  containerStyle={styles.inputField}
                  placeholder="SOCIAL MEDIA"
                  value={values.social_media}
                  onChangeText={handleChange('social_media')}
                />
                {errors.social_media && touched.social_media && (
                  <Text style={styles.errorText}>{errors.social_media}</Text>
                )}
              </View>
            </PartnerApplyBackground>
          )}
        </Formik>
      );
    case 'password':
      return (
        <Formik
          validationSchema={passwordValidationSchema}
          initialValues={{password: '', confirm_password: ''}}
          onSubmit={partnerSumbitButton}>
          {({handleChange, errors, touched, handleSubmit, values}) => (
            <PartnerApplyBackground onNextButton={handleSubmit}>
              <Text style={styles.body}>NOW, CREATE A PASSWORD</Text>
              {loading ? (
                <View
                  style={{
                    flex: 1,
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
              ) : (
                <View style={{alignItems: 'center'}}>
                  <CustomTextInputV2
                    secureTextEntry={true}
                    style={{
                      ...FONTS.textInput,
                    }}
                    containerStyle={styles.inputField}
                    placeholder="PASSWORD"
                    value={values.password}
                    onChangeText={handleChange('password')}
                  />
                  {errors.password && touched.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                  <CustomTextInputV2
                    secureTextEntry={true}
                    style={{
                      ...FONTS.textInput,
                    }}
                    containerStyle={styles.inputField}
                    placeholder="CONFIRM PASSWORD"
                    value={values.confirm_password}
                    onChangeText={handleChange('confirm_password')}
                  />
                  {errors.confirm_password && touched.confirm_password && (
                    <Text style={styles.errorText}>
                      {errors.confirm_password}
                    </Text>
                  )}
                </View>
              )}
            </PartnerApplyBackground>
          )}
        </Formik>
      );
    case 'end':
      return (
        <PartnerApplyBackground>
          <Text style={[styles.body, {textTransform: 'uppercase'}]}>
            Thank you so much for applying to imbue! we’re excited for this
            fitness journey together. Give us a few hours to look over your
            application.
          </Text>
          <CustomButton
            style={{
              marginTop: 20,
              marginBottom: 0,
            }}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{name: 'Boot'}],
              })
            }
            title="BACK TO HOME"
          />
        </PartnerApplyBackground>
      );
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  body: {
    alignSelf: 'center',
    textAlign: 'center',
    ...FONTS.body,
    fontSize: 12,
    paddingBottom: 10,
    width: '80%',
  },
  inputField: {
    marginBottom: 14,
    marginRight: 30,
    marginLeft: 30,
    fontSize: 6,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    ...FONTS.body,
    fontSize: 10,
    width: '100%',
  },
});
