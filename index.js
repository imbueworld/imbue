/**
 * @format
 */

import { AppRegistry, StatusBar } from 'react-native'
import App from './App'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => App)



import { colors } from './assets/js/contexts/Colors'

StatusBar.setBackgroundColor(colors.bg)
StatusBar.setBarStyle('dark-content')



import { GoogleSignin } from '@react-native-community/google-signin'

GoogleSignin.configure({
    webClientId: '736868821-ercn72gvhlopsal4m23b58da4lqu0v7l.apps.googleusercontent.com',
})