import 'react-native-gesture-handler'
import React from 'react'
import { View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from "./assets/js/screens/Home"
import SignUp from "./assets/js/screens/SignUp"
import Login from "./assets/js/screens/Login"
import UserDashboard from "./assets/js/screens/UserDashboard"

import UserClasses from "./assets/js/screens/UserClasses"
import UserMemberships from "./assets/js/screens/UserMemberships"
import ProfileSettings from "./assets/js/screens/ProfileSettings"
import PaymentSettings from "./assets/js/screens/PaymentSettings"

import GymDescription from "./assets/js/screens/GymDescription"

import PartnerSignUp from "./assets/js/screens/PartnerSignUp"
import PartnerDashboard from "./assets/js/screens/PartnerDashboard"
import PartnerGymSettings from "./assets/js/screens/PartnerGymSettings"

const Stack = createStackNavigator()

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{ title: "Welcome" }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{ title: "Sign Up" }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ title: "Login" }}
                />
                <Stack.Screen
                    name="UserDashboard"
                    component={UserDashboard}
                    options={{ title: "Dashboard" }}
                />
                <Stack.Screen
                    name="UserClasses"
                    component={UserClasses}
                    options={{ title: "My Classes" }}
                />
                <Stack.Screen
                    name="UserMemberships"
                    component={UserMemberships}
                    options={{ title: "Memberships" }}
                />
                <Stack.Screen
                    name="ProfileSettings"
                    component={ProfileSettings}
                    options={{ title: "Profile Settings" }}
                />
                <Stack.Screen
                    name="PaymentSettings"
                    component={PaymentSettings}
                    options={{ title: "Payment Settings" }}
                />
                <Stack.Screen
                    name="GymDescription"
                    component={GymDescription}
                    options={{ title: "Gym Description" }}
                />
                <Stack.Screen
                    name="PartnerSignUp"
                    component={PartnerSignUp}
                    options={{ title: "Sign Up" }}
                />
                <Stack.Screen
                    name="PartnerDashboard"
                    component={PartnerDashboard}
                    options={{ title: "Dashboard" }}
                />
                <Stack.Screen
                    name="PartnerGymSettings"
                    component={PartnerGymSettings}
                    options={{ title: "Gym Settings" }}
                />
                {/*
                <Stack.Screen
                    name=""
                    component={}
                    options={{ title: "" }}
                />
                */}
            </Stack.Navigator>
        </NavigationContainer>
    )
}