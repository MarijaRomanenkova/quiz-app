/**
 * @fileoverview Quiz Radio Group component for the mobile application
 * 
 * This component provides a radio button interface for quiz questions with
 * visual feedback for correct and incorrect answers. It displays answer
 * options in a styled list format with proper state management and
 * accessibility features.
 * 
 * The component shows different visual states for selected answers:
 * - Correct answers are highlighted in green
 * - Incorrect answers are highlighted in red
 * - Unselected correct answers are also highlighted when an answer is chosen
 * 
 * @module components/Quiz/QuizRadioGroup
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { theme } from '../../theme';

/**
 * Props interface for the QuizRadioGroup component
 * 
 * @interface QuizRadioGroupProps
 * @property {string[]} options - Array of answer options to display
 * @property {number | null} selectedAnswer - Index of the selected answer, null if none selected
 * @property {string} correctAnswerId - ID of the correct answer (as string)
 * @property {(index: number) => void} onAnswer - Function called when an answer is selected
 */
interface QuizRadioGroupProps {
  options: string[];
  selectedAnswer: number | null;
  correctAnswerId: string;
  onAnswer: (index: number) => void;
}

/**
 * Quiz Radio Group component with answer feedback
 * 
 * Displays quiz answer options as radio buttons with visual feedback
 * for correct and incorrect selections. The component prevents multiple
 * selections and provides clear visual indicators for answer status.
 * 
 * @param {QuizRadioGroupProps} props - The quiz radio group props
 * @param {string[]} props.options - Array of answer options to display
 * @param {number | null} props.selectedAnswer - Index of the selected answer
 * @param {string} props.correctAnswerId - ID of the correct answer
 * @param {(index: number) => void} props.onAnswer - Function called when answer is selected
 * @returns {JSX.Element} A styled radio button group for quiz answers
 * 
 * @example
 * ```tsx
 * <QuizRadioGroup
 *   options={["Option A", "Option B", "Option C", "Option D"]}
 *   selectedAnswer={selectedIndex}
 *   correctAnswerId="2"
 *   onAnswer={(index) => setSelectedAnswer(index)}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <QuizRadioGroup
 *   options={question.options}
 *   selectedAnswer={userAnswer}
 *   correctAnswerId={question.correctAnswer}
 *   onAnswer={handleAnswerSelection}
 * />
 * ```
 */
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
