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
import { View, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { Text, ActivityIndicator } from 'react-native-paper';
import { theme } from '../../theme';
import { Logo } from '../../components/Logo';
import * as Font from 'expo-font';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

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
  const token = useSelector((state: RootState) => state.auth.token);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [dotAnimations] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);
  const [loadingText, setLoadingText] = useState('Loading');

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
   * Animates the loading dots
   */
  useEffect(() => {
    if (!fontsLoaded) return;

    const animateDots = () => {
      const animations = dotAnimations.map((anim, index) => {
        return Animated.sequence([
          Animated.delay(index * 200),
          Animated.loop(
            Animated.sequence([
              Animated.timing(anim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
              }),
              Animated.timing(anim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
              }),
            ])
          ),
        ]);
      });

      Animated.parallel(animations).start();
    };

    animateDots();
  }, [fontsLoaded, dotAnimations]);

  /**
   * Initializes app data and determines navigation flow
   * 
   * Checks authentication status and navigates to the appropriate
   * screen. Provides brief loading feedback to the user.
   */
  useEffect(() => {
    if (!fontsLoaded) return;

    const initializeApp = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const isAuthenticated = !!token;
        
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
  }, [fontsLoaded, navigation, token]);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.surface} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Container - DEUTSCH */}
      <View style={styles.topContainer}>
        <Text style={styles.deutschText}>DEUTSCH</Text>
      </View>

      {/* Middle Container - Logo */}
      <View style={styles.middleContainer}>
        <Logo width={200} height={200} />
      </View>

      {/* Loading Container */}
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading</Text>
        <View style={styles.dotsContainer}>
          {dotAnimations.map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  opacity: anim,
                  transform: [
                    {
                      scale: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Bottom Container - Learn German Text */}
      <View style={styles.bottomContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.learnText}>Learn</Text>
          <Text style={styles.germanText}>German</Text>
          <Text style={styles.subtitleText}>Build your language skills</Text>
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
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deutschText: {
    color: theme.colors.surface,
    fontSize: 72,
    fontFamily: 'Baloo2-Bold',
  },
  middleContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  learnText: {
    color: theme.colors.surface,
    fontSize: 32,
    fontFamily: 'Baloo2-SemiBold',
    lineHeight: 32,
  },
  germanText: {
    color: theme.colors.surface,
    fontSize:70,
    fontFamily: 'Baloo2-SemiBold',
    lineHeight:70,
    letterSpacing: 1.2,
  },
  subtitleText: {
    color: theme.colors.surface,
    fontSize: 28,
    fontFamily: 'Baloo2-Regular',
    lineHeight: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: theme.colors.surface,
    fontSize: 32,
    fontFamily: 'Baloo2-SemiBold',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.surface,
    marginHorizontal: 4,
  },
}); 
