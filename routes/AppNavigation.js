// TODO:REVAMP THIS Component
import React, { useRef, useEffect, useState } from 'react';
import { NavigationContainer, useLinking } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import _TestingGrounds from '../assets/js/screens/_TestingGrounds';
import Boot from '../assets/js/screens/Boot';
import MemberHome from '../assets/js/screens/MemberHome';
import Landing from '../assets/js/screens/Landing';
import PartnerHome from '../assets/js/screens/PartnerHome';
import SignUp from '../features/auth/SignUp';
import Login from '../features/auth/Login';
import LoginPartner from '../features/auth/LoginPartner';
// Main Screen UserDashboard
import UserDashboard from '../assets/js/screens/UserDashboard';
// Video Screnn should navigate to the video Player Screen
import { VideoScreen } from '../features/boarding/partner/Video/VideoScreen';
import { VideoPlayScreen } from '../features/boarding/partner/Video/VideoPlayer';

// ScheduleClass Screem
import { ScheduleClass } from '../features/scheduleClass/ScheduleClass';
// Create a Class screen
import { CreateClass } from '../features/scheduleClass/createClass/CreateClass';

import ProfileSettings from '../assets/js/screens/ProfileSettings';
import PaymentSettings from '../assets/js/screens/PaymentSettings';
import AddPaymentMethod from '../features/payment/AddPaymentMethod';
import PartnerSignUpV2 from '../assets/js/screens/PartnerSignUpV2';
import PartnerDashboard from '../assets/js/screens/PartnerDashboard';
import PartnerGymSettings from '../assets/js/screens/PartnerGymSettings';
import PartnerUpdateMemberships from '../assets/js/screens/PartnerUpdateMemberships';
import ScheduleViewer from '../assets/js/screens/ScheduleViewer';
import SchedulePopulate from '../assets/js/screens/SchedulePopulate';
import PartnerRevenueInfo from '../assets/js/screens/PartnerRevenueInfo';
import GoLive from '../assets/js/screens/GoLive';
import Livestream from '../assets/js/screens/Livestream';
import LivestreamWaitScreen from '../assets/js/screens/LivestreamWaitScreen';
import LivestreamDisconnectedScreen from '../assets/js/screens/LivestreamDisconnectedScreen';
import SuccessScreen from '../assets/js/screens/SuccessScreen';
import PurchaseUnlimited from '../assets/js/screens/PurchaseUnlimited';
import GymDescription from '../assets/js/screens/GymDescription';
import UserMemberships from '../assets/js/screens/UserMemberships';
// import ClassDescription from '../assets/js/screens/ClassDescription';
import PartnerCreateClass from '../assets/js/screens/PartnerCreateClass';
import PartnerEditClasses from '../assets/js/screens/PartnerEditClasses';
import EditClassForm from '../components/EditClassForm';
import PasswordReset from '../assets/js/screens/PasswordReset';
import MindbodyActivation from '../assets/js/screens/MindbodyActivation';
import customRTMP from '../assets/js/screens/customRTMP';
import postApplicationUnverifiedPartner from '../assets/js/screens/postApplicationUnverifiedPartner';
import help from '../assets/js/screens/help';
import PartnerApply from '../assets/js/screens/PartnerApply';
import PartnerOnboard from '../assets/js/screens/PartnerOnboard';
import PartnerOnboardPhoto from '../assets/js/screens/PartnerOnboardPhoto';
import PartnerOnboardStripe from '../assets/js/screens/PartnerOnboardStripe';
import PartnerOnboardStripeQuestions from '../assets/js/screens/PartnerOnboardStripeQuestions';
import UserOnboard from '../assets/js/screens/UserOnboard';
import PreLiveChecklist from '../assets/js/screens/PreLiveChecklist';
import { PreLiveScreen } from '../features/gymDescription/partner/preLive/PreLive';
import { ClassDescription } from '../features/gymDescription/partner/ClassDescription';

import { PartnerStep } from '../assets/js/screens/PartnerStep';
import auth from '@react-native-firebase/auth';
import { Linking } from 'react-native';
import branch from 'react-native-branch';
import cache from '../backend/storage/cache';
import User from '../backend/storage/User';
import { RegisterWithBuy } from '../features/auth/RegisterWithBuy';

const Stack = createStackNavigator();

export const AppNavigation = () => {
  const ref = useRef();
  const [initialState, setInitialState] = useState(null);

  const linking = {
    prefixes: ['https://imbuefitness.app.link/', 'imbuefitness://'],
    subscribe(listener) {
      branch.subscribe(({ error, params, uri }) => {
        console.log(params);
        if (error) {
          console.error('Error from Branch: ' + error);
          return;
        }
        // https://imbuefitness.app.link/UFilFKH3nfb
        if (params['+non_branch_link']) {
          const nonBranchUrl = params['+non_branch_link'];
          return;
        }

        if (!params['+clicked_branch_link']) {
          return;
        }

        // A Branch link was opened
        const url = params.$desktop_url;
        console.log(url);
        listener(url);
      });

      return () => {
        // branch.unsubscribe();
      };
    },
    config: {
      screens: {
        GymDescription: {
          path: 'influencer/:id',
          pards: {
            id: String,
          },
        },
        ClassDescription: {
          path: 'class/:classId/:timeId',
          pards: {
            classId: String,
            timeId: String,
          },
        },
      },
    },
  };

  const bootWithUser = async () => {
    const user = new User();
    // console.log("await user.retrieveUser(): ", await user.retrieveUser())
    const { account_type } = await user.retrieveUser();
    const { approved } = await user.retrieveUser();
    const { phone } = await user.retrieveUser();
    const { associated_classes } = await user.retrieveUser();
    const userDoc = await user.retrieveUser();

    switch (account_type) {
      case 'user':
        setInitialState({ routes: [{ name: 'UserDashboard' }] });
        break;
      case 'partner':
        if (!approved) {
          setInitialState({
            routes: [{ name: 'postApplicationUnverifiedPartner' }],
          });
          break;
        } else if (approved && !phone) {
          // add to SendGrid accepted influencers
          try {
            let listName = 'accepted influencer';
            let email = userDoc.email;
            let first = userDoc.first;
            let last = userDoc.last;

            // Remove fromt Sendgrid
            const removeFromSendGrid =
              functions().httpsCallable('removeFromSendGrid');
            await removeFromSendGrid({ email, first, last, listName });

            // add to new list
            const addToSendGrid = functions().httpsCallable('addToSendGrid');
            await addToSendGrid({ email, first, last, listName });
          } catch (err) {
            console.log("addToSendGrid didn't work: ", err);
          }

          // remove from SendGrid applied influencers

          setInitialState({ routes: [{ name: 'PartnerOnboard' }] });
          break;
        } else if (approved && associated_classes) {
          setInitialState({ routes: [{ name: 'PartnerDashboard' }] });
          break;
        } else if (approved && phone) {
          setInitialState({ routes: [{ name: 'PartnerDashboard' }] });
          break;
        }
      default:
        setInitialState({ routes: [{ name: 'Landing' }] });
        break;
    }
  };

  useEffect(() => {
    cache()._resetCache();

    const init = async () => {
      if (auth().currentUser) {
        await bootWithUser();
      } else {
        console.log('else');
        setInitialState({ routes: [{ name: 'Landing' }] });
      }
    };
    init();
  }, []);

  if (initialState)
    return (
      <NavigationContainer
        linking={linking}
        initialState={initialState}
        fallback={() => <Text>Loading...</Text>}>
        <Stack.Navigator
          initialRouteName="Boot"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Boot" component={Boot} initialParams={{}} />
          <Stack.Screen name="Landing" component={Landing} initialParams={{}} />
          <Stack.Screen
            name="MemberHome"
            component={MemberHome}
            initialParams={{}}
          />
          <Stack.Screen
            name="PartnerHome"
            component={PartnerHome}
            initialParams={{}}
          />
          <Stack.Screen name="SignUp" component={SignUp} initialParams={{}} />
          <Stack.Screen name="Login" component={Login} initialParams={{}} />
          <Stack.Screen
            name="LoginPartner"
            component={LoginPartner}
            initialParams={{}}
          />
          {/* HERE you have to put UserDashboard */}
          <Stack.Screen
            name="UserDashboard"
            component={UserDashboard}
            initialParams={{}}
          />
          {/* <Stack.Screen
            name="ScheduleClass"
            component={ScheduleClass}
            initialParams={{}}
          /> */}
          <Stack.Screen
            name="createClass"
            component={CreateClass}
            initialParams={{}}
          />
          <Stack.Screen
            name="videoPlay"
            component={VideoPlayScreen}
            initialParams={{}}
          />
          {/* ^^^^^^^^^ */}
          <Stack.Screen
            name="UserMemberships"
            component={UserMemberships}
            initialParams={{}}
          />
          <Stack.Screen
            name="ProfileSettings"
            component={ProfileSettings}
            initialParams={{}}
          />
          <Stack.Screen
            name="PaymentSettings"
            component={PaymentSettings}
            initialParams={{}}
          />
          <Stack.Screen
            name="GymDescription"
            component={GymDescription}
            initialParams={{}}
          />
          <Stack.Screen name={'RegisterWithBuy'} component={RegisterWithBuy} />
          <Stack.Screen
            name="PartnerSignUp"
            component={PartnerSignUpV2}
            initialParams={{}}
          />
          <Stack.Screen
            name="PartnerDashboard"
            component={PartnerDashboard}
            initialParams={{}}
          />
          <Stack.Screen
            name="PartnerGymSettings"
            component={PartnerGymSettings}
            initialParams={{}}
          />
          <Stack.Screen
            name="PartnerUpdateMemberships"
            component={PartnerUpdateMemberships}
            initialParams={{}}
          />
          <Stack.Screen
            name="PartnerRevenueInfo"
            component={PartnerRevenueInfo}
            initialParams={{}}
          />
          <Stack.Screen
            name="PurchaseUnlimited"
            component={PurchaseUnlimited}
            initialParams={{}}
          />
          <Stack.Screen
            name="Livestream"
            component={Livestream}
            initialParams={{}}
          />
          <Stack.Screen
            name="LivestreamWaitScreen"
            component={LivestreamWaitScreen}
            initialParams={{}}
          />
          <Stack.Screen
            name="LivestreamDisconnectedScreen"
            component={LivestreamDisconnectedScreen}
            initialParams={{}}
          />
          <Stack.Screen
            name="SuccessScreen"
            component={SuccessScreen}
            initialParams={{}}
          />
          <Stack.Screen name="GoLive" component={GoLive} initialParams={{}} />
          <Stack.Screen
            name="AddPaymentMethod"
            component={AddPaymentMethod}
            initialParams={{}}
          />
          <Stack.Screen
            name="ScheduleViewer"
            component={ScheduleViewer}
            initialParams={{}}
          />
          <Stack.Screen
            name="ClassDescription"
            component={ClassDescription}
            initialParams={{}}
          />
          <Stack.Screen
            name="PartnerCreateClass"
            component={PartnerCreateClass}
            initialParams={{}}
          />
          <Stack.Screen
            name="PartnerEditClasses"
            component={PartnerEditClasses}
            initialParams={{}}
          />
          <Stack.Screen
            name="EditClassForm"
            component={EditClassForm}
            initialParams={{}}
          />
          <Stack.Screen
            name="SchedulePopulate"
            component={SchedulePopulate}
            initialParams={{}}
          />
          <Stack.Screen
            name="Test"
            component={_TestingGrounds}
            initialParams={{}}
          />
          <Stack.Screen
            name="PasswordReset"
            component={PasswordReset}
            initialParams={{}}
          />
          <Stack.Screen
            name="MindbodyActivation"
            component={MindbodyActivation}
            initialParams={{}}
          />
          <Stack.Screen
            name="customRTMP"
            component={customRTMP}
            initialParams={{}}
          />
          <Stack.Screen
            name="postApplicationUnverifiedPartner"
            component={postApplicationUnverifiedPartner}
            initialParams={{}}
          />
          <Stack.Screen name="help" component={help} initialParams={{}} />
          <Stack.Screen
            name="PartnerApply"
            component={PartnerApply}
            initialParams={{}}
          />
          <Stack.Screen name={'PartnerStep'} component={PartnerStep} />
          <Stack.Screen
            name="PartnerOnboard"
            component={PartnerOnboard}
            initialParams={{}}
          />
          <Stack.Screen
            name="PartnerOnboardPhoto"
            component={PartnerOnboardPhoto}
            initialParams={{}}
          />
          <Stack.Screen
            name="PartnerOnboardStripe"
            component={PartnerOnboardStripe}
            initialParams={{}}
          />
          <Stack.Screen
            name="PartnerOnboardStripeQuestions"
            component={PartnerOnboardStripeQuestions}
          />
          <Stack.Screen
            name="UserOnboard"
            component={UserOnboard}
            initialParams={{}}
          />
          {/* <Stack.Screen
            name="PreLiveChecklist"
            component={PreLiveChecklist}
            initialParams={{}}
          /> */}
          <Stack.Screen
            name="PreLiveChecklist"
            component={PreLiveScreen}
            initialParams={{}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  return null;
};
