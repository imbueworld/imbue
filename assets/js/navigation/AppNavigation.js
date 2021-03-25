import React, {useRef, useEffect, useState} from 'react';
import {NavigationContainer, useLinking} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import _TestingGrounds from '../screens/_TestingGrounds';
import Boot from '../screens/Boot';
import MemberHome from '../screens/MemberHome';
import Landing from '../screens/Landing';
import PartnerHome from '../screens/PartnerHome';
import SignUp from '../screens/SignUp';
import Login from '../screens/Login';
import LoginPartner from '../screens/LoginPartner';
import UserDashboard from '../screens/UserDashboard';
import ProfileSettings from '../screens/ProfileSettings';
import PaymentSettings from '../screens/PaymentSettings';
import AddPaymentMethod from '../screens/AddPaymentMethod';
import PartnerSignUpV2 from '../screens/PartnerSignUpV2';
import PartnerDashboard from '../screens/PartnerDashboard';
import PartnerGymSettings from '../screens/PartnerGymSettings';
import PartnerUpdateMemberships from '../screens/PartnerUpdateMemberships';
import ScheduleViewer from '../screens/ScheduleViewer';
import SchedulePopulate from '../screens/SchedulePopulate';
import PartnerRevenueInfo from '../screens/PartnerRevenueInfo';
import GoLive from '../screens/GoLive';
import Livestream from '../screens/Livestream';
import LivestreamWaitScreen from '../screens/LivestreamWaitScreen';
import LivestreamDisconnectedScreen from '../screens/LivestreamDisconnectedScreen';
import SuccessScreen from '../screens/SuccessScreen';
import PurchaseUnlimited from '../screens/PurchaseUnlimited';
import GymDescription from '../screens/GymDescription';
import UserMemberships from '../screens/UserMemberships';
import ClassDescription from '../screens/ClassDescription';
import PartnerCreateClass from '../screens/PartnerCreateClass';
import PartnerEditClasses from '../screens/PartnerEditClasses';
import EditClassForm from '../components/EditClassForm';
import PasswordReset from '../screens/PasswordReset';
import MindbodyActivation from '../screens/MindbodyActivation';
import customRTMP from '../screens/customRTMP';
import postApplicationUnverifiedPartner from '../screens/postApplicationUnverifiedPartner';
import help from '../screens/help';
import PartnerApply from '../screens/PartnerApply';
import PartnerOnboard from '../screens/PartnerOnboard';
import PartnerOnboardPhoto from '../screens/PartnerOnboardPhoto';
import PartnerOnboardStripe from '../screens/PartnerOnboardStripe';
import PartnerOnboardStripeQuestions from '../screens/PartnerOnboardStripeQuestions';
import UserOnboard from '../screens/UserOnboard';
import PreLiveChecklist from '../screens/PreLiveChecklist';
import {PartnerStep} from '../screens/PartnerStep';
import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();

export const AppNavigation = () => {
  const ref = useRef();

  const {getInitialState} = useLinking(ref, {
    prefixes: ['https://imbuefitness.com', 'imbuefitness://'],
    config: {
      screens: {
        GymDescription: {
          path: 'influencer/:id',
          pards: {
            id: String,
          },
        },
      },
    },
  });

  const [initialState, setInitialState] = useState(null);

  useEffect(() => {
    getInitialState().then((state) => {
      console.log('State: ' + state);
      console.log(auth().currentUser);
      if (state !== undefined && auth().currentUser) {
        setInitialState(state);
      } else {
        setInitialState({routes: [{name: 'Boot'}]});
      }
    });
  }, []);

  if (initialState)
    return (
      <NavigationContainer initialState={initialState} ref={ref}>
        <Stack.Navigator
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
          <Stack.Screen
            name="UserDashboard"
            component={UserDashboard}
            initialParams={{}}
          />
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
          <Stack.Screen
            name="PreLiveChecklist"
            component={PreLiveChecklist}
            initialParams={{}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

  return null;
};
