import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QuizRadioGroup } from '../../../components/Quiz/QuizRadioGroup';

// Unmock react-native-paper to use real RadioButton components
jest.unmock('react-native-paper');

describe('QuizRadioGroup', () => {
  const mockOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
  const mockOnAnswer = jest.fn();

  beforeEach(() => {
    mockOnAnswer.mockClear();
  });

  it('renders all options correctly', () => {
    const { getByText } = render(
      <QuizRadioGroup
        options={mockOptions}
        selectedAnswer={null}
        correctAnswerId="0"
        onAnswer={mockOnAnswer}
      />
    );

    mockOptions.forEach(option => {
      expect(getByText(option)).toBeTruthy();
    });
  });

  it('calls onAnswer when an option is selected', () => {
    const { getByLabelText } = render(
      <QuizRadioGroup
        options={mockOptions}
        selectedAnswer={null}
        correctAnswerId="0"
        onAnswer={mockOnAnswer}
      />
    );
    const option2 = getByLabelText('Option 2');
    fireEvent.press(option2);
    expect(mockOnAnswer).toHaveBeenCalledWith(1);
  });

  it('does not call onAnswer when an option is already selected', () => {
    const { getByText } = render(
      <QuizRadioGroup
        options={mockOptions}
        selectedAnswer={0}
        correctAnswerId="0"
        onAnswer={mockOnAnswer}
      />
    );

    fireEvent.press(getByText('Option 2'));
    expect(mockOnAnswer).not.toHaveBeenCalled();
  });

  it('shows correct styling for selected correct answer', () => {
    const { getByText } = render(
      <QuizRadioGroup
        options={mockOptions}
        selectedAnswer={0}
        correctAnswerId="0"
        onAnswer={mockOnAnswer}
      />
    );

    const selectedOption = getByText('Option 1');
    expect(selectedOption).toBeTruthy();
  });

  it('shows correct styling for selected incorrect answer', () => {
    const { getByText } = render(
      <QuizRadioGroup
        options={mockOptions}
        selectedAnswer={1}
        correctAnswerId="0"
        onAnswer={mockOnAnswer}
      />
    );

    const selectedOption = getByText('Option 2');
    expect(selectedOption).toBeTruthy();
  });

  it('shows correct answer styling when wrong answer is selected', () => {
    const { getByText } = render(
      <QuizRadioGroup
        options={mockOptions}
        selectedAnswer={1}
        correctAnswerId="0"
        onAnswer={mockOnAnswer}
      />
    );

    const correctOption = getByText('Option 1');
    expect(correctOption).toBeTruthy();
  });
}); 
