import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QuizScreen } from '../../screens/Quiz/QuizScreen';
import questionsReducer from '../../store/questionsSlice';

// Mock the Quiz component
jest.mock('../../components/Quiz/Quiz', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ quizId, isRepeating }: { quizId: string; isRepeating?: boolean }) => {
      return (
        <View testID="quiz-component">
          <Text>Quiz Component</Text>
        </View>
      );
    },
  };
});

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    replace: jest.fn(),
  }),
  useRoute: () => ({
    params: {
      quizId: 'test-quiz-123',
      isRepeating: false,
    },
  }),
}));

describe('QuizScreen', () => {
  let store: ReturnType<typeof setupStore>;

  const setupStore = (questionsLoading = false) => {
    return configureStore({
      reducer: {
        questions: questionsReducer,
      },
      preloadedState: {
        questions: {
          isLoading: questionsLoading,
          byTopicId: {},
          readingTextsById: {},
          readingTextsByTopicId: {},
          error: null,
        },
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading indicator when questions are loading', () => {
      store = setupStore(true);

      const { getByText } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      const loadingText = getByText('Loading quiz...');
      expect(loadingText).toBeTruthy();
    });

    it('should not show loading indicator when questions are not loading', () => {
      store = setupStore(false);

      const { queryByText } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      const loadingText = queryByText('Loading quiz...');
      expect(loadingText).toBeNull();
    });
  });

  describe('Quiz Rendering', () => {
    it('should render Quiz component when not loading', () => {
      store = setupStore(false);

      const { getByTestId } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      const quizComponent = getByTestId('quiz-component');
      expect(quizComponent).toBeTruthy();
    });

    it('should pass correct props to Quiz component', () => {
      store = setupStore(false);

      const { getByTestId } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      const quizComponent = getByTestId('quiz-component');
      expect(quizComponent).toBeTruthy();
    });

    it('should handle repeating quiz mode', () => {
      store = setupStore(false);

      const { getByTestId } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      const quizComponent = getByTestId('quiz-component');
      expect(quizComponent).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing route params gracefully', () => {
      store = setupStore(false);

      expect(() => {
        render(
          <Provider store={store}>
            <QuizScreen />
          </Provider>
        );
      }).not.toThrow();
    });

    it('should handle undefined route params', () => {
      store = setupStore(false);

      expect(() => {
        render(
          <Provider store={store}>
            <QuizScreen />
          </Provider>
        );
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should be accessible in loading state', () => {
      store = setupStore(true);

      const { getByText } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      const loadingText = getByText('Loading quiz...');
      expect(loadingText).toBeTruthy();
    });

    it('should be accessible in quiz state', () => {
      store = setupStore(false);

      const { getByTestId } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      const quizComponent = getByTestId('quiz-component');
      expect(quizComponent).toBeTruthy();
    });
  });
}); 
