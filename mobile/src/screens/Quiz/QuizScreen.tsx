import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, ActivityIndicator, Text } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigator/Navigator';
import Quiz from '../../components/Quiz/Quiz';
import { theme } from '../../theme';

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;

export const QuizScreen = () => {
  const route = useRoute<QuizScreenRouteProp>();
  const { topicId, isRepeating } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading quiz data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
      <Quiz topicId={topicId} isRepeating={isRepeating} />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
