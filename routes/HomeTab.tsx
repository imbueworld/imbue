import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
// import {HomeScreen} from '../features/home/HomeScreen';

export type HomeStackParamList = {
  homeScreen: undefined;
};
const HomeStack = createStackNavigator<HomeStackParamList>();

export const HomeTab: React.FC = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="homeScreen"
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
        headerBackTitleVisible: false,
        headerTitleAllowFontScaling: true,
        animationTypeForReplace: 'pop',
        cardStyle: { backgroundColor: 'white' },
      }}>
      {/* <HomeStack.Screen name="homeScreen" component={HomeScreen} /> */}
    </HomeStack.Navigator>
  );
};
