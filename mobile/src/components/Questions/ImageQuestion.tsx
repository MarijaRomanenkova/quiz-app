import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';
import { ImageQuestion as ImageQuestionType } from '../../types';
import { theme } from '../../theme';

interface ImageQuestionProps {
  question: ImageQuestionType;
  selectedAnswer: number | null;
  onAnswer: (index: number) => void;
}

export const ImageQuestion: React.FC<ImageQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswer,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: question.imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text variant="headlineSmall" style={styles.question}>
        {question.question}
      </Text>
      <RadioButton.Group
        onValueChange={(value) => !selectedAnswer && onAnswer(parseInt(value))}
        value={selectedAnswer?.toString() || ''}
      >
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <View
              key={index}
              style={[
                styles.option,
                selectedAnswer === index && styles.selectedOption,
                selectedAnswer !== null &&
                  (selectedAnswer === index
                    ? question.correctAnswerId === index.toString()
                      ? styles.correctOption
                      : styles.incorrectOption
                    : question.correctAnswerId === index.toString()
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
                      ? question.correctAnswerId === index.toString()
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
  image: {
    width: '100%',
    height: 200,
    marginBottom: 24,
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
