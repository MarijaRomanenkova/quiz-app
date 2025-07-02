/**
 * @fileoverview Main application entry point for the mobile quiz app
 * 
 * This is the root component that initializes the React Native application,
 * sets up all necessary providers (Redux, React Native Paper, Redux Persist),
 * loads custom fonts, and configures the navigation system.
 * 
 * The component handles:
 * - Application state management with Redux
 * - UI theming with React Native Paper
 * - Data persistence with Redux Persist
 * - Custom font loading
 * - Navigation setup
 * - Performance optimizations
 * - Image prefetching
 * 
 * @module App
 */

import React, { useEffect, useState } from 'react';
import { LogBox, Image, ActivityIndicator, View } from 'react-native';

import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';

import { store, persistor } from './src/store';
import { theme } from './src/theme';
import { AppNavigator } from './src/navigation/AppNavigator';

// Enable screens for better performance
enableScreens();

// Ignore specific warnings
LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
  'accessibilityLabel',
  'accessibilityRole',
  'accessibilityLiveRegion',
]);

// Check if queryCache is defined before calling it
if (Image.queryCache) {
  Image.queryCache(['yourImageKey1', 'yourImageKey2']).then((cached) => {
    Object.keys(cached).forEach((key) => {
      Image.prefetch(key).then((result) => {
        // Image prefetch result handled
      }).catch((error) => {
        // Error prefetching image
      });
    });
  });
} else {
  console.warn('Image.queryCache is not available.');
}

/**
 * Loading component displayed while persistence is loading
 * 
 * Shows a centered activity indicator with the app's primary color
 * while Redux Persist is rehydrating the application state.
 * 
 * @returns {JSX.Element} Loading screen with activity indicator
 */
const LoadingComponent = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
);

/**
 * Main application component
 * 
 * The root component that initializes the entire application. It sets up
 * all necessary providers, loads custom fonts, and renders the main
 * navigation structure. The component ensures proper initialization
 * before rendering the main app content.
 * 
 * Key responsibilities:
 * - Font loading and initialization
 * - Provider setup (Redux, Paper, Persist)
 * - Navigation initialization
 * - Performance optimizations
 * - Error handling and loading states
 * 
 * @returns {JSX.Element} The fully initialized application
 * 
 * @example
 * ```tsx
 * // Entry point in index.js
 * import App from './App';
 * 
 * registerRootComponent(App);
 * ```
 */
const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  /**
   * Loads custom fonts required by the application
   * 
   * Asynchronously loads the Baloo2 font family with different weights
   * for consistent typography across the app. Updates the loading state
   * when fonts are ready.
   */
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'Baloo2-Regular': require('./assets/fonts/Baloo2-Regular.ttf'),
        'Baloo2-Medium': require('./assets/fonts/Baloo2-Medium.ttf'),
        'Baloo2-SemiBold': require('./assets/fonts/Baloo2-SemiBold.ttf'),
        'Baloo2-Bold': require('./assets/fonts/Baloo2-Bold.ttf'),
        'Baloo2-ExtraBold': require('./assets/fonts/Baloo2-ExtraBold.ttf'),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <LoadingComponent />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StoreProvider store={store}>
        <PersistGate loading={<LoadingComponent />} persistor={persistor}>
          <PaperProvider 
            theme={theme}
            settings={{
              icon: (props: any) => <MaterialCommunityIcons {...props} />
            }}
          >
            <AppNavigator />
          </PaperProvider>
        </PersistGate>
      </StoreProvider>
    </GestureHandlerRootView>
  );
};

export default App;
