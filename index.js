/**
 * @format
 */

import { initFirebase } from "./assets/js/backend/main"

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

initFirebase()
AppRegistry.registerComponent(appName, () => App)