import React from 'react';
import { AppNavigation } from './routes/AppNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import { StoreProvider } from './store/RootStore';

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
