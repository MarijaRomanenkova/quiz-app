import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from '../BackButton';
import { QuizTopBarProps } from '../../types/components.types';
import { theme } from '../../theme';

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
