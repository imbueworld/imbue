import React from 'react';
import {AppNavigation} from './assets/js/navigation/AppNavigation';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import {StoreProvider} from './assets/js/store/RootStore';

export default function App() {
  return (
    <StoreProvider>
      <SafeAreaProvider>
        <AppNavigation />
        <FlashMessage position="top" />
      </SafeAreaProvider>
    </StoreProvider>
  );
}
