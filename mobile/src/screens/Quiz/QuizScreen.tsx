/**
 * @fileoverview Quiz Screen component for the mobile application
 * 
 * This component serves as a container for the Quiz component, handling
 * quiz loading states and providing the quiz interface. It receives quiz
 * parameters from navigation and manages the loading experience while
 * questions are being prepared.
 * 
 * The component integrates with the questions slice to determine loading
 * state and renders either a loading indicator or the actual quiz interface.
 * 
 * @module screens/Quiz
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import type { RootStackParamList } from '../../types/navigation';
import { RootState } from '../../store';
import { selectQuestionsLoading } from '../../store/questionsSlice';
import Quiz from '../../components/Quiz/Quiz';
import { theme, spacing } from '../../theme';
import { LoadingWrapper } from '../../components/common/LoadingWrapper';
import { createLayoutStyles } from '../../utils/themeUtils';

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

/**
 * Quiz Screen component for quiz presentation and interaction
 * 
 * Provides the main interface for quiz taking, handling loading states
 * and rendering the quiz component with appropriate parameters. The
 * component manages the transition from loading to active quiz state.
 * 
 * Key features:
 * - Loading state management with visual feedback
 * - Quiz parameter handling (quizId, isRepeating)
 * - Integration with questions slice for loading status
 * - Surface container with consistent styling
 * - Quiz component rendering with proper props
 * 
 * @returns {JSX.Element} The quiz screen with loading or quiz interface
 * 
 * @example
 * ```tsx
 * // Navigation to quiz screen
 * navigation.navigate('Quiz', { quizId: 'topic1', isRepeating: false });
 * ```
 */
export const QuizScreen = () => {
  const route = useRoute<QuizScreenRouteProp>();
  const { quizId, isRepeating } = route.params;
  const isLoading = useSelector(selectQuestionsLoading);

  return (
    <LoadingWrapper isLoading={isLoading} loadingText="Loading quiz...">
      <Surface style={styles.container}>
        <Quiz quizId={quizId} isRepeating={isRepeating} />
      </Surface>
    </LoadingWrapper>
  );
};

const layoutStyles = createLayoutStyles();

const styles = StyleSheet.create({
  container: {
    ...layoutStyles.container,
    backgroundColor: theme.colors.secondaryContainer,
  },
}); 
