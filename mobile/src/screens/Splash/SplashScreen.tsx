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

export const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
          navigation.replace('Home', { userProfile: undefined });
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
