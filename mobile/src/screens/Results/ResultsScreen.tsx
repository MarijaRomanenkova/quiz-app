import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Surface, ActivityIndicator } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigator/Navigator';
import { theme } from '../../theme';

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;
type ResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ResultsScreen = () => {
  const route = useRoute<ResultsScreenRouteProp>();
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const { score, totalQuestions } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading results data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const percentage = Math.round((score / totalQuestions) * 100);

  if (isLoading) {
    return (
      <Surface style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Calculating results...</Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>
          Quiz Complete!
        </Text>
        
        <View style={styles.scoreContainer}>
          <Text variant="headlineLarge" style={styles.score}>
            {score}/{totalQuestions}
          </Text>
          <Text variant="titleLarge" style={styles.percentage}>
            {percentage}%
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Home', { userProfile: undefined })}
            style={styles.button}
          >
            Continue Learning
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Progress', undefined)}
            style={styles.button}
          >
            View Progress
          </Button>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: theme.colors.primary,
  },
  title: {
    marginBottom: 32,
    color: theme.colors.primary,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  percentage: {
    marginTop: 8,
    color: theme.colors.secondary,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  },
}); 
