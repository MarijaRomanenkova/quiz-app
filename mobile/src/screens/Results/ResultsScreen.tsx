import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, ActivityIndicator } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { Button as CustomButton } from '../../components/Button/Button';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;
type ResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ResultsScreen = () => {
  const route = useRoute<ResultsScreenRouteProp>();
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const [isLoading, setIsLoading] = useState(true);
  const quizResult = useSelector((state: RootState) => state.quizResults.currentResult);
  const wrongQuestions = useSelector((state: RootState) => state.wrongQuestions.wrongQuestions);

  useEffect(() => {
    // Simulate loading results data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!quizResult) {
    return null;
  }

  const percentage = Math.round((quizResult.score / quizResult.totalQuestions) * 100);

  const handleRepeatWrongQuestions = () => {
    console.log('Results: Navigating to review mode with quizId:', route.params.quizId);
    navigation.navigate('Quiz', { 
      quizId: route.params.quizId,
      isRepeating: true 
    });
  };

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
            {quizResult.score}/{quizResult.totalQuestions}
          </Text>
          <Text variant="titleLarge" style={styles.percentage}>
            {percentage}%
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {wrongQuestions.length > 0 && (
            <>
              <Text variant="titleMedium" style={styles.percentage}>
                Would you like to repeat wrong questions?
              </Text>
              <CustomButton
                variant="primary"
                onPress={handleRepeatWrongQuestions}
                style={styles.button}
              >
                Repeat 
              </CustomButton>
            </>
          )}
          <CustomButton
            variant="success"
            onPress={() => navigation.navigate('Home', { userProfile: undefined })}
            style={styles.button}
          >
            Home
          </CustomButton>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryContainer,
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
    color: '#583FB0',
  },
  title: {
    marginBottom: 32,
    color: '#583FB0',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  score: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#583FB0',
  },
  percentage: {
    marginTop: 8,
    color: '#583FB0',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    position: 'absolute',
    bottom: 40,
    paddingHorizontal: 24,
  },
  button: {
    width: '100%',
    height: 56,
  },
}); 
