import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/Home';
import { LoginScreen } from '../screens/Login';
import { RegisterScreen } from '../screens/Register';
import { ForgotPasswordScreen } from '../screens/ForgotPassword';
import { ProfileScreen } from '../screens/Profile';
import { TopicScreen } from '../screens/Topic';
import { QuizScreen } from '../screens/Quiz';
import { ResultsScreen } from '../screens/Results';
import { ProgressScreen } from '../screens/Progress';
import { TermsScreen } from '../screens/Terms';
import { RootStackParamList } from '../types/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigator = () => {
  const { token } = useSelector((state: RootState) => state.auth);
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={token ? "Home" : "Login"}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Topic" component={TopicScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
