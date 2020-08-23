import 'react-native-gesture-handler'

import React, { useState } from 'react'
import { View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Boot from "./assets/js/screens/Boot"
import Home from "./assets/js/screens/Home"
import SignUp from "./assets/js/screens/SignUp"
import Login from "./assets/js/screens/Login"
import UserDashboard from "./assets/js/screens/UserDashboard"

// import UserClasses from "./assets/js/screens/UserClasses"
import UserMemberships from "./assets/js/screens/UserMemberships"
import ProfileSettings from "./assets/js/screens/ProfileSettings"
import PaymentSettings from "./assets/js/screens/PaymentSettings"
import AddPaymentMethod from "./assets/js/screens/AddPaymentMethod"
// import PurchaseOnline from "./assets/js/screens/PurchaseOnline"
import PurchaseUnlimited from "./assets/js/screens/PurchaseUnlimited"
import GymDescription from "./assets/js/screens/GymDescription"

import PartnerSignUp from "./assets/js/screens/PartnerSignUp"
import PartnerDashboard from "./assets/js/screens/PartnerDashboard"
import PartnerGymSettings from "./assets/js/screens/PartnerGymSettings"
import PartnerUpdateMemberships from "./assets/js/screens/PartnerUpdateMemberships"
// import ClassesSchedule from "./assets/js/screens/ClassesSchedule"
import ScheduleViewer from "./assets/js/screens/ScheduleViewer"
import SchedulePopulate from "./assets/js/screens/SchedulePopulate"
import PartnerRevenueInfo from "./assets/js/screens/PartnerRevenueInfo"
import PartnerLivestreamDashboard from "./assets/js/screens/PartnerLivestreamDashboard"
import GoLive from "./assets/js/screens/GoLive"

import Livestream from "./assets/js/screens/Livestream"
import ClassDescription from "./assets/js/screens/ClassDescription"


import TestScreen from "./assets/js/TestScreen"
import PartnerUpdateClasses from './assets/js/screens/PartnerUpdateClasses'
const Stack = createStackNavigator()

export default function App() {
    let user = []
    let cache = {
        working: {},
    }

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
                    options={{ title: "Boot" }}
                    initialParams={{ referrer: null, cache }}
                />
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ title: "Welcome" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{ title: "Sign Up" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ title: "Login" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="UserDashboard"
                    component={UserDashboard}
                    options={{ title: "Dashboard" }}
                    initialParams={{ user: user, cache }}
                />
                {/* <Stack.Screen
                    name="UserClasses"
                    component={UserClasses}
                    options={{ title: "My Classes" }}
                    initialParams={{ user: user, cache }}
                /> */}
                <Stack.Screen
                    name="UserMemberships"
                    component={UserMemberships}
                    options={{ title: "Memberships" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="ProfileSettings"
                    component={ProfileSettings}
                    options={{ title: "Profile Settings" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="PaymentSettings"
                    component={PaymentSettings}
                    options={{ title: "Payment Settings" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="GymDescription"
                    component={GymDescription}
                    options={{ title: "Gym Description" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="PartnerSignUp"
                    component={PartnerSignUp}
                    options={{ title: "Sign Up" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="PartnerDashboard"
                    component={PartnerDashboard}
                    options={{ title: "Dashboard" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="PartnerGymSettings"
                    component={PartnerGymSettings}
                    options={{ title: "Gym Settings" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="PartnerUpdateMemberships"
                    component={PartnerUpdateMemberships}
                    options={{ title: "Update Memberships" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="PartnerRevenueInfo"
                    component={PartnerRevenueInfo}
                    options={{ title: "Revenue" }}
                    initialParams={{ user: user, cache }}
                />
                {/* <Stack.Screen
                    name="PurchaseOnline"
                    component={PurchaseOnline}
                    options={{ title: "Purchase A Class" }}
                    initialParams={{ user: user, cache }}
                /> */}
                <Stack.Screen
                    name="PurchaseUnlimited"
                    component={PurchaseUnlimited}
                    options={{ title: "Purchase Universal Membership" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="Livestream"
                    component={Livestream}
                    options={{ title: "Livestream" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="PartnerLivestreamDashboard"
                    component={PartnerLivestreamDashboard}
                    options={{ title: "Livestream Dashboard" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="GoLive"
                    component={GoLive}
                    options={{ title: "Livestream To Audience" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="AddPaymentMethod"
                    component={AddPaymentMethod}
                    options={{ title: "Add a Credit Card" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="ScheduleViewer"
                    component={ScheduleViewer}
                    options={{ title: "Schedule" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="ClassDescription"
                    component={ClassDescription}
                    options={{ title: "Class" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="TestScreen"
                    component={TestScreen}
                    options={{ title: "TestScreen" }}
                    initialParams={{ user: user, cache }}
                />
                <Stack.Screen
                    name="PartnerUpdateClasses"
                    component={PartnerUpdateClasses}
                    options={{ title: "Update Classes" }}
                    initialParams={{ cache }}
                />
                <Stack.Screen
                    name="SchedulePopulate"
                    component={SchedulePopulate}
                    options={{ title: "Add New Classes To Schedule" }}
                    initialParams={{ cache }}
                />
                {/*
                <Stack.Screen
                    name=""
                    component={}
                    options={{ title: "" }}
                    initialParams={{ cache }}
                />
                */}
            </Stack.Navigator>
        </NavigationContainer>
    )
}