import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { ScoreCircle } from '../../components/Results/ScoreCircle';
import { RootState } from '../../store';
import { Button as CustomButton } from '../../components/Button/Button';

type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;
type ResultsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ResultsScreen = () => {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const route = useRoute<ResultsScreenRouteProp>();
  const user = useSelector((state: RootState) => state.user);
  const quizResult = useSelector((state: RootState) => state.quizResults.currentResult);
  const wrongQuestions = useSelector((state: RootState) => state.wrongQuestions.wrongQuestions);

  if (!quizResult) {
    return null;
  }

  const handleRepeatWrongQuestions = () => {
    navigation.navigate('Quiz', { 
      quizId: route.params.quizId,
      isRepeating: true 
    } as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScoreCircle score={quizResult.score} total={quizResult.totalQuestions} />
        
        <View style={styles.congratsContainer}>
          <Text variant="displayLarge" style={styles.congratsText}>Congrats!</Text>
          <Text variant="headlineMedium" style={styles.messageText}>
            Great job, {user?.name || 'User'}!
          </Text>
          {(wrongQuestions.length > 0 || quizResult.score < quizResult.totalQuestions) && (
            <Text variant="titleLarge" style={styles.questionText}>
              Would you like to train harder questions?
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {wrongQuestions.length > 0 && (
            <>
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
            onPress={() => navigation.navigate('Home' as never)}
            style={styles.button}
          >
            I'm good
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
    color: '#583FB0',
    textAlign: 'center',
  },
}); 
