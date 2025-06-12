import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';
import { ReadingQuestion as ReadingQuestionType, TrueFalseQuestion } from '../../types';
import { theme } from '../../theme';

interface ReadingQuestionProps {
  question: ReadingQuestionType;
  selectedAnswer: number | null;
  onAnswer: (index: number) => void;
  showQuestions: boolean;
}

export const ReadingQuestion: React.FC<ReadingQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswer,
  showQuestions,
}) => {
  if (!showQuestions) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Text variant="headlineSmall" style={styles.title}>
            {question.title}
          </Text>
          <Text variant="bodyLarge" style={styles.text}>
            {question.text}
          </Text>
        </ScrollView>
      </View>
    );
  }

  const currentQuestion = question.questions[0];

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.question}>
        {currentQuestion.statement}
      </Text>
      <RadioButton.Group
        onValueChange={(value) => !selectedAnswer && onAnswer(parseInt(value))}
        value={selectedAnswer?.toString() || ''}
      >
        <View style={styles.optionsContainer}>
          {['True', 'False'].map((option, index) => (
            <View
              key={index}
              style={[
                styles.option,
                selectedAnswer === index && styles.selectedOption,
                selectedAnswer !== null &&
                  (selectedAnswer === index
                    ? currentQuestion.correctAnswer === (index === 0)
                      ? styles.correctOption
                      : styles.incorrectOption
                    : currentQuestion.correctAnswer === (index === 0)
                    ? styles.correctOption
                    : null),
              ]}
            >
              <RadioButton.Item
                label={option}
                value={index.toString()}
                position="trailing"
                labelStyle={[
                  styles.optionLabel,
                  selectedAnswer === index && styles.selectedOptionLabel,
                ]}
                disabled={selectedAnswer !== null}
                theme={{
                  colors: {
                    primary: selectedAnswer === index
                      ? currentQuestion.correctAnswer === (index === 0)
                        ? '#60BF92'
                        : '#EC221F'
                      : '#583FB0',
                  },
                }}
              />
            </View>
          ))}
        </View>
      </RadioButton.Group>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
    color: theme.colors.onSurface,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  optionLabel: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '600',
  },
  selectedOption: {
    borderWidth: 0,
    borderColor: 'transparent',
  },
  selectedOptionLabel: {
    color: '#000000',
  },
  correctOption: {
    backgroundColor: '#E1FFC3',
    borderColor: '#60BF92',
    borderWidth: 2,
  },
  incorrectOption: {
    backgroundColor: '#FBDCDC',
    borderColor: '#EC221F',
    borderWidth: 2,
  },
}); 
