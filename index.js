/**
 * @see https://reactnavigation.org/docs/getting-started
 */
import 'react-native-gesture-handler';

/**
 * @format
 */

import {AppRegistry, Platform, StatusBar} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

import {colors} from './assets/js/contexts/Colors';

// StatusBar.setBackgroundColor(colors.bg)
StatusBar.setBackgroundColor(`${colors.bg}00`); // 00 stands for alpha channel, making it completely transparent
StatusBar.setBarStyle('dark-content');
if (Platform.OS === 'android') StatusBar.setTranslucent(true);

import {GoogleSignin} from '@react-native-community/google-signin';

GoogleSignin.configure({
  webClientId:
    '736868821-ercn72gvhlopsal4m23b58da4lqu0v7l.apps.googleusercontent.com',
});
