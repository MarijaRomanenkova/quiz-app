/**
 * @fileoverview Navigation type definitions for the mobile application
 * 
 * This module contains TypeScript type definitions for React Navigation,
 * defining the navigation structure, screen parameters, and type safety
 * for the app's navigation system.
 * 
 * The module includes:
 * - Root stack navigation parameter list
 * - Tab navigation parameter list
 * - Navigation prop types
 * - Screen parameter definitions
 * 
 * @module types/navigation
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

/**
 * Root stack navigation parameter list
 * 
 * Defines the complete navigation structure for the main stack navigator,
 * including all screens and their required/optional parameters. This type
 * ensures type safety when navigating between screens and passing parameters.
 * 
 * @typedef {Object} RootStackParamList
 * @property {undefined} Splash - Splash screen with no parameters
 * @property {undefined} Login - Login screen with no parameters
 * @property {undefined} Register - Registration screen with no parameters
 * @property {undefined} ForgotPassword - Password recovery screen with no parameters
 * @property {undefined} Home - Home screen with no parameters
 * @property {{categoryId: string}} Category - Category screen requiring category ID
 * @property {{categoryId: string}} Topic - Topic screen requiring category ID
 * @property {{quizId: string, isRepeating?: boolean}} Quiz - Quiz screen with quiz ID and optional repeat flag
 * @property {{quizId: string}} Results - Results screen requiring quiz ID
 * @property {undefined} WrongQuestions - Wrong questions review screen with no parameters
 * @property {undefined} Profile - User profile screen with no parameters
 * @property {undefined} Settings - Settings screen with no parameters
 * @property {undefined} About - About screen with no parameters
 * @property {undefined} PrivacyPolicy - Privacy policy screen with no parameters
 * @property {undefined} TermsOfService - Terms of service screen with no parameters
 * @property {undefined} Contact - Contact screen with no parameters
 * @property {undefined} Help - Help screen with no parameters
 * @property {undefined} Feedback - Feedback screen with no parameters
 * @property {undefined} Notifications - Notifications screen with no parameters
 * @property {undefined} Language - Language settings screen with no parameters
 * @property {undefined} Theme - Theme settings screen with no parameters
 * @property {undefined} Sound - Sound settings screen with no parameters
 * @property {undefined} Vibration - Vibration settings screen with no parameters
 * @property {undefined} FontSize - Font size settings screen with no parameters
 * @property {undefined} ColorScheme - Color scheme settings screen with no parameters
 * @property {undefined} Accessibility - Accessibility settings screen with no parameters
 * @property {undefined} DataUsage - Data usage settings screen with no parameters
 * @property {undefined} Storage - Storage settings screen with no parameters
 * @property {undefined} Cache - Cache settings screen with no parameters
 * @property {undefined} Updates - Updates screen with no parameters
 * @property {undefined} Version - Version info screen with no parameters
 * @property {undefined} Credits - Credits screen with no parameters
 * @property {undefined} License - License screen with no parameters
 * @property {undefined} Progress - Progress tracking screen with no parameters
 * @property {undefined} Terms - Terms and conditions screen with no parameters
 * @property {undefined} Onboarding - Onboarding screen with no parameters
 * 
 * @example
 * ```tsx
 * // Navigation with parameters
 * navigation.navigate('Quiz', { quizId: 'topic1', isRepeating: false });
 * navigation.navigate('Topic', { categoryId: 'grammar' });
 * 
 * // Navigation without parameters
 * navigation.navigate('Home');
 * navigation.navigate('Profile');
 * ```
 */
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Category: { categoryId: string };
  Topic: { categoryId: string };
  Quiz: {
    quizId: string;
    isRepeating?: boolean;
  };
  Results: {
    quizId: string;
  };
  WrongQuestions: undefined;
  Profile: undefined;
  Settings: undefined;
  About: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  Contact: undefined;
  Help: undefined;
  Feedback: undefined;
  Notifications: undefined;
  Language: undefined;
  Theme: undefined;
  Sound: undefined;
  Vibration: undefined;
  FontSize: undefined;
  ColorScheme: undefined;
  Accessibility: undefined;
  DataUsage: undefined;
  Storage: undefined;
  Cache: undefined;
  Updates: undefined;
  Version: undefined;
  Credits: undefined;
  License: undefined;
  Progress: undefined;
  Terms: undefined;
  Onboarding: undefined;
};

/**
 * Tab navigation parameter list
 * 
 * Defines the navigation structure for the tab navigator, which provides
 * bottom tab navigation between main app sections. Each tab screen has
 * no parameters as they serve as main navigation hubs.
 * 
 * @typedef {Object} TabParamList
 * @property {undefined} Dashboard - Main dashboard tab with no parameters
 * @property {undefined} Progress - Progress tracking tab with no parameters
 * @property {undefined} Profile - User profile tab with no parameters
 * 
 * @example
 * ```tsx
 * // Tab navigation
 * navigation.navigate('Dashboard');
 * navigation.navigate('Progress');
 * navigation.navigate('Profile');
 * ```
 */
export type TabParamList = {
  Dashboard: undefined;
  Progress: undefined;
  Profile: undefined;
};

/**
 * Navigation prop type for root stack navigation
 * 
 * Provides type-safe navigation prop for use in screen components.
 * This type ensures that navigation methods and parameters are properly
 * typed according to the RootStackParamList definition.
 * 
 * @typedef {NativeStackNavigationProp<RootStackParamList>} NavigationProp
 * 
 * @example
 * ```tsx
 * import { NavigationProp } from '../types/navigation';
 * 
 * interface Props {
 *   navigation: NavigationProp;
 * }
 * 
 * const MyScreen = ({ navigation }: Props) => {
 *   // Type-safe navigation
 *   navigation.navigate('Home');
 *   navigation.navigate('Quiz', { quizId: 'topic1' });
 * };
 * ```
 */
export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 
