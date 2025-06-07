import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigator/Navigator';
import { Text, ActivityIndicator } from 'react-native-paper';
import { theme } from '../../theme';
import { Logo } from '../../components/Logo';
import * as Font from 'expo-font';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'BalooBhaina2-Regular': require('../../../assets/fonts/BalooBhaina2-Regular.ttf'),
          'BalooBhaina2-Medium': require('../../../assets/fonts/BalooBhaina2-Medium.ttf'),
          'BalooBhaina2-SemiBold': require('../../../assets/fonts/BalooBhaina2-SemiBold.ttf'),
          'BalooBhaina2-Bold': require('../../../assets/fonts/BalooBhaina2-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    };

    loadFonts();
  }, []);

  useEffect(() => {
    if (!fontsLoaded) return;

    // Mock authentication check sequence
    const checkAuth = async () => {
      try {
        setLoadingText('Checking authentication...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setLoadingText('Loading user preferences...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setLoadingText('Preparing your learning journey...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: Replace with actual auth check
        const isAuthenticated = false;
        
        if (isAuthenticated) {
          navigation.replace('Home', { userProfile: undefined });
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        navigation.replace('Login');
      }
    };

    checkAuth();
  }, [fontsLoaded]);

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
        <Text variant="displayLarge" style={styles.title}>
          DEUTSCH
        </Text>
        <Logo width={200} height={200} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text variant="bodyLarge" style={styles.loadingText}>{loadingText}</Text>
        </View>
        <View style={styles.footer}>
          <Text variant="headlineSmall" style={styles.title}>
            Learn
          </Text>
          <Text variant="displayLarge" style={styles.title}>
            German
          </Text>
          <Text variant="titleMedium" style={styles.title}>
            Build your language skills
          </Text>
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
    fontFamily: 'BalooBhaina2-Regular',
  },
  logoTextQuiz: {
    color: '#FFFFFF',
    fontSize: 48,
    fontFamily: 'BalooBhaina2-Bold',
  },
  logoTextApp: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'BalooBhaina2-Regular',
  },
}); 
