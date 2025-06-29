/**
 * @fileoverview Splash Screen component for the mobile application
 * 
 * This component serves as the initial loading screen that appears when the app starts.
 * It handles font loading, data initialization, and navigation routing based on
 * authentication status. The screen displays a branded loading interface with
 * progress indicators and status messages.
 * 
 * The component performs several initialization tasks:
 * - Loads custom fonts (Baloo2 family)
 * - Fetches categories and topics from the backend
 * - Determines navigation flow based on authentication
 * - Provides visual feedback during the loading process
 * 
 * @module screens/Splash
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { Text, ActivityIndicator } from 'react-native-paper';
import { theme } from '../../theme';
import { Logo } from '../../components/Logo';
import * as Font from 'expo-font';
import { useDispatch } from 'react-redux';
import { fetchCategoriesThunk } from '../../store/categorySlice';
import { fetchTopicsThunk } from '../../store/topicSlice';
import { AppDispatch } from '../../store';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

/**
 * Splash Screen component for app initialization
 * 
 * Displays a branded loading screen while the app initializes. Handles
 * font loading, data fetching, and navigation routing. The component
 * shows progress through different loading states with appropriate
 * status messages.
 * 
 * Key features:
 * - Custom font loading with error handling
 * - Progressive data initialization (categories, topics)
 * - Authentication-based navigation routing
 * - Visual loading indicators and status messages
 * - Branded logo and app name display
 * 
 * @returns {JSX.Element} The splash screen with loading interface
 * 
 * @example
 * ```tsx
 * // Navigation to splash screen (typically automatic on app start)
 * navigation.navigate('Splash');
 * ```
 */
export const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  /**
   * Loads custom fonts required by the application
   * 
   * Loads the Baloo2 font family with different weights for consistent
   * typography across the app. Handles loading errors gracefully.
   */
  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'Baloo2-Regular': require('../../../assets/fonts/Baloo2-Regular.ttf'),
          'Baloo2-Medium': require('../../../assets/fonts/Baloo2-Medium.ttf'),
          'Baloo2-SemiBold': require('../../../assets/fonts/Baloo2-SemiBold.ttf'),
          'Baloo2-Bold': require('../../../assets/fonts/Baloo2-Bold.ttf'),
          'Baloo2-ExtraBold': require('../../../assets/fonts/Baloo2-ExtraBold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    };

    loadFonts();
  }, []);

  /**
   * Initializes app data and determines navigation flow
   * 
   * Fetches essential data (categories and topics) from the backend
   * and navigates to the appropriate screen based on authentication
   * status. Provides progressive loading feedback to the user.
   */
  useEffect(() => {
    if (!fontsLoaded) return;

    const initializeApp = async () => {
      try {
        setLoadingText('Loading categories...');
        await dispatch(fetchCategoriesThunk()).unwrap();
        
        setLoadingText('Loading topics...');
        await dispatch(fetchTopicsThunk()).unwrap();
        
        setLoadingText('Preparing your learning journey...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: Replace with actual auth check
        const isAuthenticated = false;
        
        if (isAuthenticated) {
          navigation.replace('Home');
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Initialization failed:', error);
        navigation.replace('Login');
      }
    };

    initializeApp();
  }, [fontsLoaded, dispatch, navigation]);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Logo width={120} height={120} />
          </View>
          <Text style={styles.logoTextFresh}>Fresh</Text>
          <Text style={styles.logoTextQuiz}>Quiz</Text>
          <Text style={styles.logoTextApp}>App</Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 24,
  },
  title: {
    color: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loadingContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextFresh: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Baloo2-Regular',
  },
  logoTextQuiz: {
    color: '#FFFFFF',
    fontSize: 48,
    fontFamily: 'Baloo2-Bold',
  },
  logoTextApp: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Baloo2-Regular',
  },
}); 
