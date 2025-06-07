import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { useAuth } from '../hooks/useAuth';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Categories: undefined;
  // Add other screens here
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isAuthenticated ? (
          // Auth screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // App screens
          <>
            <Stack.Screen name="Categories" component={CategoriesScreen} />
            {/* Add other authenticated screens here */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 
