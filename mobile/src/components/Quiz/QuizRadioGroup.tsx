import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { theme } from '../../theme';

interface QuizRadioGroupProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswerId: string;
  onAnswer: (index: number) => void;
}

export const QuizRadioGroup: React.FC<QuizRadioGroupProps> = ({
  options,
  selectedAnswer,
  correctAnswerId,
  onAnswer,
}) => {
  return (
    <RadioButton.Group
      onValueChange={(value) => !selectedAnswer && onAnswer(parseInt(value))}
      value={selectedAnswer?.toString() || ''}
    >
      <View style={styles.radioContainer}>
        {options.map((option, index) => (
          <View
            key={index}
            style={[
              styles.radioItem,
              selectedAnswer === index && styles.selectedRadioItem,
              selectedAnswer !== null &&
                (selectedAnswer === index
                  ? correctAnswerId === index.toString()
                    ? styles.correctOption
                    : styles.incorrectOption
                  : correctAnswerId === index.toString()
                  ? styles.correctOption
                  : null),
            ]}
          >
            <RadioButton.Item
              label={option}
              value={index.toString()}
              position="trailing"
              labelStyle={[
                styles.radioLabel,
                selectedAnswer === index && styles.selectedRadioLabel,
              ]}
              style={styles.radioButton}
              disabled={selectedAnswer !== null}
              theme={{
                colors: {
                  primary: selectedAnswer === index
                    ? correctAnswerId === index.toString()
                      ? '#60BF92'
                      : '#EC221F'
                    : '#583FB0',
                  onSurfaceDisabled: selectedAnswer === index
                    ? correctAnswerId === index.toString()
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
  );
};

const styles = StyleSheet.create({
  radioContainer: {
    gap: 8,
  },
  radioItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  radioLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    marginLeft: 8,
  },
  selectedRadioItem: {
    borderWidth: 2,
  },
  selectedRadioLabel: {
    color: '#000000',
    fontWeight: '600',
  },
  correctOption: {
    backgroundColor: '#E1FFC3',
    borderColor: '#60BF92',
  },
  incorrectOption: {
    backgroundColor: '#FBDCDC',
    borderColor: '#EC221F',
  },
}); 
