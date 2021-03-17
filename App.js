import React from 'react'
import { AppNavigation } from './assets/js/navigation/AppNavigation'
import { SafeAreaProvider } from 'react-native-safe-area-context'
/**
 * Always keep initialParams initialized for each screen,
 * otherwise may run into cannot read <property> of null/undefined error.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <AppNavigation />
    </SafeAreaProvider>
  )
}
