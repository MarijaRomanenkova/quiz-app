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
import { selectCategoryProgress, selectUnlockedTopicsForCategory } from '../../store/progressSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  
  // Get progress information
  const [categoryId, setCategoryId] = useState<string | null>(null);
  
  // Memoize selectors to prevent unnecessary re-renders
  const categoryProgress = useSelector((state: RootState) => 
    categoryId ? selectCategoryProgress(state, categoryId) : null
  );
  
  // Get all topics for the category to show total count
  const topics = useSelector((state: RootState) => state.topic.topics);
  const allCategoryTopics = useMemo(() => {
    if (!categoryId) return [];
    return topics.filter(topic => topic.categoryId === categoryId);
  }, [categoryId, topics]);

  // Get completed topics for this category
  const { topicProgress } = useSelector((state: RootState) => state.progress);
  const completedTopicsInCategory = useMemo(() => {
    if (!categoryId) return [];
    return Object.values(topicProgress).filter(topic => 
      topic.categoryId === categoryId && topic.completed
    );
  }, [categoryId, topicProgress]);

  // Memoize the hasNewUnlocks calculation
  const hasNewUnlocks = useMemo(() => {
    return categoryProgress && categoryProgress.completedTopics >= 3;
  }, [categoryProgress]);

  // Determine category ID from quiz result or wrong questions
  useEffect(() => {
    if (!quizResult && !wrongQuestions.length) return;

    let detectedCategory: string | null = null;

    // Try to get category from wrong questions first
    if (wrongQuestions.length > 0) {
      const firstWrongQuestion = wrongQuestions[0];
      detectedCategory = firstWrongQuestion.categoryId;
    }

    // If no category from wrong questions, try to detect from quizId
    if (!detectedCategory && route.params.quizId) {
      const quizId = route.params.quizId.toLowerCase();
      
      // Simple category detection based on quizId patterns
      if (quizId.includes('grammar') || quizId.includes('articles') || quizId.includes('tense') || quizId.includes('plurals') || quizId.includes('adjectives') || quizId.includes('prepositions')) {
        detectedCategory = 'grammar';
      } else if (quizId.includes('reading') || quizId.includes('text')) {
        detectedCategory = 'reading';
      } else if (quizId.includes('listening') || quizId.includes('audio')) {
        detectedCategory = 'listening';
      } else if (quizId.includes('words') || quizId.includes('vocabulary')) {
        detectedCategory = 'words';
      }
    }

    if (detectedCategory) {
      setCategoryId(detectedCategory);
    }
  }, [quizResult, route.params.quizId, wrongQuestions]);

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
    navigation.navigate('Quiz', { 
      quizId: route.params.quizId,
      isRepeating: true 
    } as any);
  };

  /**
   * Handles navigation to category topics
   * 
   * Navigates to the topic selection screen for the current category
   * to allow users to explore newly unlocked topics.
   */
  const handleGoToCategory = () => {
    if (categoryId) {
      navigation.navigate('Topic', { categoryId });
    } else {
      navigation.navigate('Home');
    }
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
          
          {/* Show progress update */}
          {categoryProgress && (
            <View style={styles.progressContainer}>
              <Text variant="titleMedium" style={styles.progressText}>
                Progress: {completedTopicsInCategory.length} / {allCategoryTopics.length} topics completed
              </Text>
              {hasNewUnlocks && (
                <View style={styles.unlockContainer}>
                  <MaterialCommunityIcons 
                    name="star" 
                    size={24} 
                    color={theme.colors.primary} 
                  />
                  <Text variant="titleMedium" style={styles.unlockText}>
                    New topics unlocked!
                  </Text>
                </View>
              )}
            </View>
          )}
          
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
          
          {hasNewUnlocks && (
            <CustomButton
              variant="secondary"
              onPress={handleGoToCategory}
              style={styles.button}
            >
              Explore New Topics
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
  progressContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  progressText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  unlockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  unlockText: {
    marginLeft: 8,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
}); 
