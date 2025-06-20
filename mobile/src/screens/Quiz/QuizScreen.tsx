import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, ActivityIndicator, Text } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import type { RootStackParamList } from '../../types/navigation';
import { RootState } from '../../store';
import { selectQuestionsLoading } from '../../store/questionsSlice';
import Quiz from '../../components/Quiz/Quiz';
import { theme } from '../../theme';

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

export const QuizScreen = () => {
  const route = useRoute<QuizScreenRouteProp>();
  const { quizId, isRepeating } = route.params;
  const isLoading = useSelector(selectQuestionsLoading);

  if (isLoading) {
    return (
      <Surface style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <Quiz quizId={quizId} isRepeating={isRepeating} />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryContainer,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: theme.colors.primary,
  },
}); 
