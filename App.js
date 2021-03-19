import React from 'react';
import {AppNavigation} from './assets/js/navigation/AppNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigation />
      <FlashMessage position="top" />
    </SafeAreaProvider>
  );
}
