import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QuizTopBar } from '../../../components/Quiz/QuizTopBar';

// Mock navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

describe('QuizTopBar', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
  });

  it('renders correctly with question counter', () => {
    const { getByText } = render(
      <QuizTopBar
        currentQuestion={2}
        totalQuestions={10}
        showReadingText={false}
      />
    );

    expect(getByText('3/10')).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
  });

  it('does not render when showReadingText is true', () => {
    const { queryByText } = render(
      <QuizTopBar
        currentQuestion={2}
        totalQuestions={10}
        showReadingText={true}
      />
    );

    expect(queryByText('3/10')).toBeNull();
    expect(queryByText('Back')).toBeNull();
  });

  it('calls navigation.goBack when back button is pressed', () => {
    const { getByText } = render(
      <QuizTopBar
        currentQuestion={2}
        totalQuestions={10}
        showReadingText={false}
      />
    );

    const backButton = getByText('Back');
    fireEvent.press(backButton);
    expect(mockGoBack).toHaveBeenCalled();
  });
}); 
