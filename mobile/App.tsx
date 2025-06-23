import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { AppNavigator } from './src/navigation/AppNavigator';
import { store, persistor } from './src/store';
import { theme } from './src/theme';
import { LogBox, Image, ActivityIndicator, View } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';

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
        if (result) {
          console.log(`Image ${key} prefetched successfully.`);
        } else {
          console.log(`Failed to prefetch image ${key}.`);
        }
      }).catch((error) => {
        console.error(`Error prefetching image ${key}:`, error);
      });
    });
  });
} else {
  console.warn('Image.queryCache is not available.');
}

// Loading component while persistence is loading
const LoadingComponent = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
);

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
