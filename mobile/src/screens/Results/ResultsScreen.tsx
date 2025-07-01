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

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import type { RootStackParamList } from '../../types/navigation';
import { theme, spacing } from '../../theme';
import { ScoreCircle } from '../../components/Results/ScoreCircle';
import { RootState } from '../../store';
import { Button as CustomButton } from '../../components/Button/Button';
import { createLayoutStyles } from '../../utils/themeUtils';



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
              variant="success"
              onPress={handleRepeatWrongQuestions}
              style={styles.button}
            >
              Repeat
            </CustomButton>
          )}
          
          <CustomButton
            variant="primary"
            onPress={() => navigation.navigate('Home')}
            style={styles.button}
          >
            Continue
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

const layoutStyles = createLayoutStyles();

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  buttonContainer: {
    gap: spacing.md,
    marginTop: spacing.xl,
    width: '100%',
  },
  congratsContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  congratsText: {
    marginBottom: spacing.md,
  },
  container: {
    ...layoutStyles.container,
    backgroundColor: theme.colors.secondaryContainer,
  },
  content: {
    ...layoutStyles.content,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageText: {
    marginBottom: spacing.lg,
  },
  questionText: {
    marginTop: spacing.md,
    textAlign: 'center',
  },
}); 
