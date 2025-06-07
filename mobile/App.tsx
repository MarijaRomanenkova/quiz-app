import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import { Navigator } from './src/navigator/Navigator';
import { store, persistor } from './src/store';
import { theme } from './src/theme';
import { LogBox, Image, ActivityIndicator, View } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  return (
    <StoreProvider store={store}>
      <PersistGate loading={<LoadingComponent />} persistor={persistor}>
        <PaperProvider 
          theme={theme}
          settings={{
            icon: (props: any) => <MaterialCommunityIcons {...props} />
          }}
        >
          <Navigator />
        </PaperProvider>
      </PersistGate>
    </StoreProvider>
  );
};

export default App;
