import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from "./assets/js/screens/Home"
import Test from "./assets/js/screens/Test"
import SignUp from "./assets/js/screens/SignUp"
import Login from "./assets/js/screens/Login"
import UserDashboard from "./assets/js/screens/UserDashboard"

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
                    name="Test"
                    component={Test}
                    options={{ title: "Test Screen" }}
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