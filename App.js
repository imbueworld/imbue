import 'react-native-gesture-handler'

import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import _TestingGrounds from './assets/js/screens/_TestingGrounds'

import Boot from "./assets/js/screens/Boot"
import Home from "./assets/js/screens/Home"
import SignUp from "./assets/js/screens/SignUp"
import Login from "./assets/js/screens/Login"
import UserDashboard from "./assets/js/screens/UserDashboard"
import ProfileSettings from "./assets/js/screens/ProfileSettings"
import PaymentSettings from "./assets/js/screens/PaymentSettings"
import AddPaymentMethod from "./assets/js/screens/AddPaymentMethod"
import PartnerSignUp from "./assets/js/screens/PartnerSignUp"
import PartnerDashboard from "./assets/js/screens/PartnerDashboard"
import PartnerGymSettings from "./assets/js/screens/PartnerGymSettings"
import PartnerUpdateMemberships from "./assets/js/screens/PartnerUpdateMemberships"
import ScheduleViewer from "./assets/js/screens/ScheduleViewer"
import SchedulePopulate from "./assets/js/screens/SchedulePopulate"
import PartnerRevenueInfo from "./assets/js/screens/PartnerRevenueInfo"
import GoLive from "./assets/js/screens/GoLive"
import Livestream from "./assets/js/screens/Livestream"
import PurchaseUnlimited from "./assets/js/screens/PurchaseUnlimited"
import GymDescription from "./assets/js/screens/GymDescription"
import UserMemberships from "./assets/js/screens/UserMemberships"
import ClassDescription from "./assets/js/screens/ClassDescription"
import PartnerUpdateClasses from './assets/js/screens/PartnerUpdateClasses'

import { StatusBar } from 'react-native'
import { colors } from './assets/js/contexts/Colors'

const Stack = createStackNavigator()



export default function App() {
  useEffect(() => {
    StatusBar.setBackgroundColor(colors.bg)
    StatusBar.setBarStyle('dark-content')
  }, [])



  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Boot"
          component={Boot}
          initialParams={{ referrer: null }}
          options={{ title: "Boot" }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          initialParams={{}}
          options={{ title: "Welcome" }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          initialParams={{}}
          options={{ title: "Sign Up" }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          initialParams={{}}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="UserDashboard"
          component={UserDashboard}
          initialParams={{}}
          options={{ title: "Dashboard" }}
        />
        <Stack.Screen
          name="UserMemberships"
          component={UserMemberships}
          initialParams={{}}
          options={{ title: "Memberships" }}
        />
        <Stack.Screen
          name="ProfileSettings"
          component={ProfileSettings}
          initialParams={{}}
          options={{ title: "Profile Settings" }}
        />
        <Stack.Screen
          name="PaymentSettings"
          component={PaymentSettings}
          initialParams={{}}
          options={{ title: "Payment Settings" }}
        />
        <Stack.Screen
          name="GymDescription"
          component={GymDescription}
          initialParams={{}}
          options={{ title: "Gym Description" }}
        />
        <Stack.Screen
          name="PartnerSignUp"
          component={PartnerSignUp}
          initialParams={{}}
          options={{ title: "Sign Up" }}
        />
        <Stack.Screen
          name="PartnerDashboard"
          component={PartnerDashboard}
          initialParams={{}}
          options={{ title: "Dashboard" }}
        />
        <Stack.Screen
          name="PartnerGymSettings"
          component={PartnerGymSettings}
          initialParams={{}}
          options={{ title: "Gym Settings" }}
        />
        <Stack.Screen
          name="PartnerUpdateMemberships"
          component={PartnerUpdateMemberships}
          initialParams={{}}
          options={{ title: "Update Memberships" }}
        />
        <Stack.Screen
          name="PartnerRevenueInfo"
          component={PartnerRevenueInfo}
          initialParams={{}}
          options={{ title: "Revenue" }}
        />
        <Stack.Screen
          name="PurchaseUnlimited"
          component={PurchaseUnlimited}
          initialParams={{}}
          options={{ title: "Purchase Universal Membership" }}
        />
        <Stack.Screen
          name="Livestream"
          component={Livestream}
          initialParams={{}}
          options={{ title: "Livestream" }}
        />
        <Stack.Screen
          name="GoLive"
          component={GoLive}
          initialParams={{}}
          options={{ title: "Livestream To Audience" }}
        />
        <Stack.Screen
          name="AddPaymentMethod"
          component={AddPaymentMethod}
          initialParams={{}}
          options={{ title: "Add a Credit Card" }}
        />
        <Stack.Screen
          name="ScheduleViewer"
          component={ScheduleViewer}
          initialParams={{}}
          options={{ title: "Schedule" }}
        />
        <Stack.Screen
          name="ClassDescription"
          component={ClassDescription}
          initialParams={{}}
          options={{ title: "Class" }}
        />
        <Stack.Screen
          name="PartnerUpdateClasses"
          component={PartnerUpdateClasses}
          initialParams={{}}
          options={{ title: "Update Classes" }}
        />
        <Stack.Screen
          name="SchedulePopulate"
          component={SchedulePopulate}
          initialParams={{}}
          options={{ title: "Add New Classes To Schedule" }}
        />
        <Stack.Screen
          name="Test"
          component={_TestingGrounds}
          initialParams={{}}
        />
        {/*
        <Stack.Screen
          name=""
          component={}
          initialParams={{}}
        />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
