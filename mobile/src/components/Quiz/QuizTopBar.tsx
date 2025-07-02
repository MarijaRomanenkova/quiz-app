/**
 * @fileoverview Quiz Top Bar component for the mobile application
 * 
 * This component provides a navigation bar for quiz screens with a back button
 * and question counter. It displays the current question number and total
 * questions, and provides navigation back to the previous screen.
 * 
 * The component automatically hides itself when reading text is displayed
 * to provide a cleaner reading experience for comprehension questions.
 * 
 * @module components/Quiz/QuizTopBar
 */

// React and core libraries
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Project components
import { BackButton } from '../BackButton';

// Types and interfaces
import { QuizTopBarProps } from '../../types/components.types';

// Theme and styling
import { theme } from '../../theme';

/**
 * Quiz Top Bar component with navigation and progress
 * 
 * Displays a navigation bar for quiz screens with back button and
 * question counter. The component automatically hides when reading
 * text is shown to provide an unobstructed reading experience.
 * 
 * @param {QuizTopBarProps} props - The quiz top bar props
 * @param {number} props.currentQuestion - Index of the current question (0-based)
 * @param {number} props.totalQuestions - Total number of questions in the quiz
 * @param {boolean} props.showReadingText - Whether reading text is currently displayed
 * @returns {JSX.Element} A navigation bar with back button and question counter
 * 
 * @example
 * ```tsx
 * <QuizTopBar
 *   currentQuestion={2}
 *   totalQuestions={10}
 *   showReadingText={false}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <QuizTopBar
 *   currentQuestion={0}
 *   totalQuestions={5}
 *   showReadingText={true}
 * />
 * ```
 */
export const QuizTopBar: React.FC<QuizTopBarProps> = ({ 
  currentQuestion, 
  totalQuestions,
  showReadingText 
}) => {
  const navigation = useNavigation();

  if (showReadingText) return null;

  return (
    <View style={styles.container}>
      <BackButton 
        variant="light" 
        onPress={() => navigation.goBack()}
        text="Back"
        style={styles.backButton}
      />

      <View style={styles.questionCounter}>
        <Text variant="titleMedium" style={styles.counterText}>
          {currentQuestion + 1}/{totalQuestions}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  counterText: {
    color: theme.colors.primaryContainer,
    fontWeight: 'bold',
  },
  questionCounter: {
    alignItems: 'center',
    flexDirection: 'row',
  },
}); 
