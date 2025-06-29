import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BackButton } from '../BackButton';

type QuizTopBarProps = {
  currentQuestion: number;
  totalQuestions: number;
  showReadingText: boolean;
};

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
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionCounter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterText: {
    color: '#583FB0',
    fontWeight: 'bold',
  },
}); 
