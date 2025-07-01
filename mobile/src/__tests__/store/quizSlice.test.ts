import { configureStore } from '@reduxjs/toolkit';
import { quizSlice, setCurrentTopic, addWrongQuestion, clearWrongQuestions, updateDailyStats, setQuizResult, clearQuizResult, startQuiz, selectAnswer, nextQuestion, updateScore, setReadingText, endQuiz } from '../../store/quizSlice';
import type { Question } from '../../types';

describe('quizSlice', () => {
  let store: ReturnType<typeof setupStore>;
  const initialState = {
    currentTopicId: null,
    wrongQuestions: [],
    dailyStats: [],
    currentResult: null,
    activeQuiz: null,
  };

  const setupStore = () =>
    configureStore({
      reducer: { quiz: quizSlice.reducer },
    });

  beforeEach(() => {
    store = setupStore();
    jest.useFakeTimers().setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return the initial state', () => {
    expect(store.getState().quiz).toEqual(initialState);
  });

  it('should set the current topic', () => {
    store.dispatch(setCurrentTopic('topic1'));
    expect(store.getState().quiz.currentTopicId).toBe('topic1');
  });

  it('should add and clear wrong questions', () => {
    const mockQuestion1: Question = {
      id: 'q1',
      questionId: 'q1',
      topicId: 'topic1',
      categoryId: 'category1',
      questionText: 'Test question 1',
      options: ['A', 'B', 'C', 'D'],
      correctAnswerId: '0',
      imageUrl: undefined,
      audioUrl: undefined,
      readingTextId: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
    const mockQuestion2: Question = {
      id: 'q2',
      questionId: 'q2',
      topicId: 'topic1',
      categoryId: 'category1',
      questionText: 'Test question 2',
      options: ['A', 'B', 'C', 'D'],
      correctAnswerId: '1',
      imageUrl: undefined,
      audioUrl: undefined,
      readingTextId: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
    
    store.dispatch(addWrongQuestion(mockQuestion1));
    store.dispatch(addWrongQuestion(mockQuestion2));
    expect(store.getState().quiz.wrongQuestions).toEqual([mockQuestion1, mockQuestion2]);
    store.dispatch(clearWrongQuestions());
    expect(store.getState().quiz.wrongQuestions).toEqual([]);
  });

  it('should update daily stats for the same day', () => {
    store.dispatch(updateDailyStats({ timeSpent: 10, questionsAnswered: 5 }));
    store.dispatch(updateDailyStats({ timeSpent: 5, questionsAnswered: 2 }));
    const stats = store.getState().quiz.dailyStats;
    expect(stats.length).toBe(1);
    expect(stats[0]).toEqual({ date: '2024-01-01', timeSpent: 15, questionsAnswered: 7 });
  });

  it('should set and clear quiz result', () => {
    const quizResult = {
      score: 80,
      totalQuestions: 10,
      timeSpent: 300,
    };
    
    store.dispatch(setQuizResult(quizResult));
    expect(store.getState().quiz.currentResult).toEqual(quizResult);
    
    store.dispatch(clearQuizResult());
    expect(store.getState().quiz.currentResult).toBeNull();
  });

  it('should start, update, and end a quiz session', () => {
    store.dispatch(startQuiz());
    let active = store.getState().quiz.activeQuiz;
    expect(active).toEqual({ currentQuestion: 0, score: 0, selectedAnswer: null, currentTextId: null, showReadingText: false });
    store.dispatch(selectAnswer(2));
    active = store.getState().quiz.activeQuiz;
    expect(active?.selectedAnswer).toBe(2);
    store.dispatch(nextQuestion());
    active = store.getState().quiz.activeQuiz;
    expect(active?.currentQuestion).toBe(1);
    expect(active?.selectedAnswer).toBe(null);
    store.dispatch(updateScore(5));
    active = store.getState().quiz.activeQuiz;
    expect(active?.score).toBe(5);
    store.dispatch(setReadingText({ textId: 'rt1', show: true }));
    active = store.getState().quiz.activeQuiz;
    expect(active?.currentTextId).toBe('rt1');
    expect(active?.showReadingText).toBe(true);
    store.dispatch(endQuiz());
    expect(store.getState().quiz.activeQuiz).toBeNull();
  });
}); 
