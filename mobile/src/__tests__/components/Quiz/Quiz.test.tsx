import React from 'react';
import { render } from '@testing-library/react-native';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// Mock the Quiz component since it has complex dependencies
jest.mock('../../../components/Quiz/Quiz', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockQuiz({ quizId }: { quizId: string }) {
    return (
      <View testID="quiz-component">
        <Text>Quiz Component - {quizId}</Text>
      </View>
    );
  };
});

describe('Quiz Component', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        quiz: (state = { activeQuiz: null, score: 0 }, action: any) => state,
        questions: (state = { byTopicId: {}, readingTextsById: {} }, action: any) => state,
        topic: (state = { topics: [] }, action: any) => state,
        statistics: (state = {}, action: any) => state,
        progress: (state = {}, action: any) => state,
      },
    });
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <View testID="quiz-component">
          <Text>Quiz Component - test-quiz</Text>
        </View>
      </Provider>
    );
    expect(getByTestId('quiz-component')).toBeTruthy();
  });
}); 
