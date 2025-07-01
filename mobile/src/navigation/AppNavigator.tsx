/**
 * @fileoverview Main application navigation structure
 * 
 * This module defines the root navigation structure for the mobile application,
 * handling authentication flow and screen routing. It uses React Navigation
 * to manage the navigation stack and provides type-safe navigation parameters.
 * 
 * The navigator automatically switches between authentication screens and
 * main app screens based on the user's authentication status.
 * 
 * @module navigation/AppNavigator
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/Splash';
import { LoginScreen } from '../screens/Login';
import { RegisterScreen } from '../screens/Register';
import { ForgotPasswordScreen } from '../screens/ForgotPassword';
import { useAuth } from '../hooks/useAuth';
import { TabNavigator } from './TabNavigator';
import { TopicScreen } from '../screens/Topic';
import { QuizScreen } from '../screens/Quiz';
import { ResultsScreen } from '../screens/Results';

/**
 * Type definitions for navigation parameters
 * 
 * Defines the parameter types for each screen in the navigation stack.
 * This provides type safety when navigating between screens and accessing
 * route parameters.
 * 
 * @interface RootStackParamList
 * @property {undefined} Splash - Splash screen (no parameters)
 * @property {undefined} Login - Login screen (no parameters)
 * @property {undefined} Register - Registration screen (no parameters)
 * @property {undefined} ForgotPassword - Password reset screen (no parameters)
 * @property {undefined} Home - Main app home screen (no parameters)
 * @property {{ categoryId: string }} Topic - Topic selection screen with category ID
 * @property {{ quizId: string; categoryId: string; isRepeating?: boolean }} Quiz - Quiz screen with topic ID, category ID and optional repeat flag
 * @property {{ quizId: string }} Results - Results screen with quiz ID for displaying results
 */
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Topic: { categoryId: string };
  Quiz: { quizId: string; categoryId: string; isRepeating?: boolean };
  Results: { quizId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Main application navigator component
 * 
 * Provides the root navigation structure for the application, handling
 * authentication flow and screen routing. The navigator automatically
 * switches between authentication screens and main app screens based
 * on the user's authentication status.
 * 
 * Features:
 * - Conditional rendering based on authentication status
 * - Type-safe navigation with parameter validation
 * - Header-less navigation for custom UI
 * - Integration with authentication hooks
 * 
 * @returns {JSX.Element} The complete navigation container with stack navigator
 * 
 * @example
 * ```tsx
 * // Navigate to a topic
 * navigation.navigate('Topic', { categoryId: 'grammar' });
 * 
 * // Navigate to a quiz
 * navigation.navigate('Quiz', { quizId: 'topic-123', categoryId: 'grammar' });
 * 
 * // Navigate to quiz results
 * navigation.navigate('Results', { quizId: 'topic-123' });
 * ```
 * 
 * @example
 * ```tsx
 * // Navigate to repeat quiz mode
 * navigation.navigate('Quiz', { 
 *   quizId: 'topic-123', 
 *   isRepeating: true 
 * });
 * ```
 */
export const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        {!isAuthenticated ? (
          // Auth screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          // App screens
          <>
            <Stack.Screen name="Home" component={TabNavigator} />
            <Stack.Screen name="Topic" component={TopicScreen} />
            <Stack.Screen name="Quiz" component={QuizScreen} />
            <Stack.Screen name="Results" component={ResultsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 
