/**
 * @fileoverview Results Screen component for the mobile application
 * 
 * This component displays quiz results after completing a quiz, showing the
 * user's score, progress updates, and providing navigation options. It integrates
 * with progress tracking to show completion status and unlock notifications.
 * 
 * The component features:
 * - Score display with visual circle indicator
 * - Progress tracking and completion status
 * - New topic unlock notifications
 * - Wrong question repetition options
 * - Multiple navigation paths (continue, repeat, explore)
 * 
 * @module screens/Results
 */

import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { ScoreCircle } from '../../components/Results/ScoreCircle';
import { RootState } from '../../store';
import { Button as CustomButton } from '../../components/Button/Button';



type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;
type ResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Results Screen component for quiz completion and progress display
 * 
 * Displays comprehensive quiz results including score, progress updates,
 * and navigation options. Integrates with progress tracking to show
 * completion status and unlock new topics based on performance.
 * 
 * Key features:
 * - Visual score display with circular progress indicator
 * - Category progress tracking and completion status
 * - New topic unlock notifications with star indicators
 * - Wrong question repetition for improvement
 * - Multiple navigation paths (home, category, repeat)
 * - Personalized congratulatory messages
 * 
 * @returns {JSX.Element} The results screen with score and navigation options
 * 
 * @example
 * ```tsx
 * // Navigation to results screen (typically automatic after quiz completion)
 * navigation.navigate('Results', { quizId: 'topic1' });
 * ```
 */
export const ResultsScreen = () => {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const route = useRoute<ResultsScreenRouteProp>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const quizResult = useSelector((state: RootState) => state.quiz.currentResult);
  const wrongQuestions = useSelector((state: RootState) => state.quiz.wrongQuestions);
  

  




  if (!quizResult) {
    return null;
  }

  /**
   * Handles wrong question repetition
   * 
   * Navigates to the quiz screen with the repeat flag to allow
   * users to practice questions they answered incorrectly.
   */
  const handleRepeatWrongQuestions = () => {
    // Get categoryId from wrong questions
    let categoryId: string | undefined;
    
    if (wrongQuestions.length > 0) {
      categoryId = wrongQuestions[0].categoryId;
    }
    
    navigation.navigate('Quiz', { 
      quizId: route.params.quizId,
      categoryId,
      isRepeating: true 
    });
  };



  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScoreCircle score={quizResult.score} total={quizResult.totalQuestions} />
        
        <View style={styles.congratsContainer}>
          <Text variant="displayLarge" style={styles.congratsText}>Congrats!</Text>
          <Text variant="headlineMedium" style={styles.messageText}>
            Great job, {user?.username || 'User'}!
          </Text>
          
          {(wrongQuestions.length > 0 || quizResult.score < quizResult.totalQuestions) && (
            <Text variant="titleLarge" style={styles.questionText}>
              Would you like to train harder questions?
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {wrongQuestions.length > 0 && (
            <CustomButton
              variant="primary"
              onPress={handleRepeatWrongQuestions}
              style={styles.button}
            >
              Repeat Wrong Questions
            </CustomButton>
          )}
          
          <CustomButton
            variant="success"
            onPress={() => navigation.navigate('Home')}
            style={styles.button}
          >
            Continue Learning
          </CustomButton>
        </View>
      </View>
    </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  congratsContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  congratsText: {
    marginBottom: 16,
  },
  messageText: {
    marginBottom: 24,
  },
  questionText: {
    marginTop: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginTop: 32,
  },
  button: {
    width: '100%',
    height: 56,
  },
  percentage: {
    color: theme.colors.primaryContainer,
    textAlign: 'center',
  },

}); 
