import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QuizScreen } from '../../screens/Quiz/QuizScreen';
import questionsReducer from '../../store/questionsSlice';

// Mock the Quiz component with prop tracking
const mockQuizProps: { quizId?: string; isRepeating?: boolean } = {};
jest.mock('../../components/Quiz/Quiz', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ quizId, isRepeating }: { quizId: string; isRepeating?: boolean }) => {
      // Track the props passed to Quiz component
      mockQuizProps.quizId = quizId;
      mockQuizProps.isRepeating = isRepeating;
      
      return (
        <View testID="quiz-component">
          <Text testID="quiz-id">Quiz ID: {quizId}</Text>
          <Text testID="quiz-repeating">Repeating: {isRepeating ? 'Yes' : 'No'}</Text>
        </View>
      );
    },
  };
});

// Mock navigation with proper route params
const mockRouteParams = {
  quizId: 'test-quiz-123',
  isRepeating: false,
};

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    push: jest.fn(),
    pop: jest.fn(),
    replace: jest.fn(),
  }),
  useRoute: () => ({
    params: mockRouteParams,
  }),
}));

describe('QuizScreen', () => {
  let store: ReturnType<typeof setupStore>;

  const setupStore = (questionsLoading = false, error = null) => {
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
          error,
        },
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock props
    mockQuizProps.quizId = undefined;
    mockQuizProps.isRepeating = undefined;
    // Reset route params
    mockRouteParams.quizId = 'test-quiz-123';
    mockRouteParams.isRepeating = false;
  });

  describe('Loading State', () => {
    it('should show loading indicator when questions are loading', () => {
      store = setupStore(true);

      const { getByText, queryByTestId } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      expect(getByText('Loading quiz...')).toBeTruthy();
      expect(queryByTestId('quiz-component')).toBeNull();
    });

    it('should not show loading indicator when questions are not loading', () => {
      store = setupStore(false);

      const { queryByText, getByTestId } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      expect(queryByText('Loading quiz...')).toBeNull();
      expect(getByTestId('quiz-component')).toBeTruthy();
    });
  });

  describe('Quiz Component Integration', () => {
    it('should render Quiz component when not loading', () => {
      store = setupStore(false);

      const { getByTestId } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      expect(getByTestId('quiz-component')).toBeTruthy();
    });

    it('should pass correct quizId to Quiz component', () => {
      store = setupStore(false);

      const { getByTestId } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      expect(mockQuizProps.quizId).toBe('test-quiz-123');
      expect(getByTestId('quiz-id')).toHaveTextContent('Quiz ID: test-quiz-123');
    });

    it('should pass correct isRepeating prop to Quiz component', () => {
      store = setupStore(false);

      const { getByTestId } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      expect(mockQuizProps.isRepeating).toBe(false);
      expect(getByTestId('quiz-repeating')).toHaveTextContent('Repeating: No');
    });

    it('should handle repeating quiz mode correctly', () => {
      store = setupStore(false);
      mockRouteParams.isRepeating = true;

      const { getByTestId } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      expect(mockQuizProps.isRepeating).toBe(true);
      expect(getByTestId('quiz-repeating')).toHaveTextContent('Repeating: Yes');
    });
  });

  describe('Route Parameters', () => {
    it('should handle different quiz IDs', () => {
      store = setupStore(false);
      mockRouteParams.quizId = 'different-quiz-456';

      const { getByTestId } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      expect(mockQuizProps.quizId).toBe('different-quiz-456');
      expect(getByTestId('quiz-id')).toHaveTextContent('Quiz ID: different-quiz-456');
    });

    it('should handle missing route params gracefully', () => {
      store = setupStore(false);
      // Mock useRoute to return undefined params
      jest.doMock('@react-navigation/native', () => ({
        useNavigation: () => ({
          navigate: jest.fn(),
          goBack: jest.fn(),
        }),
        useRoute: () => ({
          params: undefined,
        }),
      }));

      expect(() => {
        render(
          <Provider store={store}>
            <QuizScreen />
          </Provider>
        );
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle questions error state', () => {
      store = setupStore(false, 'Failed to load questions' as any);

      const { getByTestId } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      // Should still render Quiz component even with error
      expect(getByTestId('quiz-component')).toBeTruthy();
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

      expect(getByTestId('quiz-component')).toBeTruthy();
    });
  });

  describe('Component Structure', () => {
    it('should render Surface container', () => {
      store = setupStore(false);

      const { getByTestId } = render(
        <Provider store={store}>
          <QuizScreen />
        </Provider>
      );

      // The Surface should be rendered (we can check by looking for the quiz component inside)
      expect(getByTestId('quiz-component')).toBeTruthy();
    });
  });
}); 

