import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Question } from '../types';
import { QuizResult, QuizState } from '../types/quiz.types';

/**
 * Redux slice for managing quiz state
 * 
 * This slice handles the current quiz session, including the active quiz,
 * quiz results, wrong questions tracking, and daily statistics.
 */
export const quizSlice = createSlice({
  name: 'quiz',
  initialState: {
    currentTopicId: null,
    wrongQuestions: [],
    dailyStats: [],
    currentResult: null,
    activeQuiz: null,
  } as QuizState,
  reducers: {
    /**
     * Sets the currently selected topic for quiz
     * @param state - Current quiz state
     * @param action - Topic ID to set as current
     */
    setCurrentTopic: (state, action: PayloadAction<string>) => {
      state.currentTopicId = action.payload;
    },
    
    /**
     * Adds a question to the list of wrong questions
     * @param state - Current quiz state
     * @param action - Question object to add
     */
    addWrongQuestion: (state, action: PayloadAction<Question>) => {
      state.wrongQuestions.push(action.payload);
    },
    
    /**
     * Clears all wrong questions
     * @param state - Current quiz state
     */
    clearWrongQuestions: (state) => {
      state.wrongQuestions = [];
    },
    
    /**
     * Updates daily statistics with new quiz activity
     * @param state - Current quiz state
     * @param action - Object containing time spent and questions answered
     */
    updateDailyStats: (state, action: PayloadAction<{ timeSpent: number; questionsAnswered: number }>) => {
      const today = new Date().toISOString().split('T')[0];
      
      // Ensure dailyStats is an array
      if (!Array.isArray(state.dailyStats)) {
        state.dailyStats = [];
      }
      
      const existingDayIndex = state.dailyStats.findIndex(stat => stat.date === today);
      
      if (existingDayIndex >= 0) {
        state.dailyStats[existingDayIndex].timeSpent += action.payload.timeSpent;
        state.dailyStats[existingDayIndex].questionsAnswered += action.payload.questionsAnswered;
      } else {
        state.dailyStats.push({
          date: today,
          ...action.payload
        });
      }
    },
    
    /**
     * Sets the current quiz result
     * @param state - Current quiz state
     * @param action - Quiz result data to store
     */
    setQuizResult: (state, action: PayloadAction<QuizResult>) => {
      state.currentResult = action.payload;
    },
    
    /**
     * Clears the current quiz result
     * @param state - Current quiz state
     */
    clearQuizResult: (state) => {
      state.currentResult = null;
    },
    
    /**
     * Starts a new quiz session
     * @param state - Current quiz state
     */
    startQuiz: (state) => {
      state.activeQuiz = {
        currentQuestion: 0,
        score: 0,
        selectedAnswer: null,
        currentTextId: null,
        showReadingText: false,
      };
    },
    
    /**
     * Sets the selected answer for the current question
     * @param state - Current quiz state
     * @param action - Selected answer index or null to clear selection
     */
    selectAnswer: (state, action: PayloadAction<number | null>) => {
      if (state.activeQuiz) {
        state.activeQuiz.selectedAnswer = action.payload;
      }
    },
    
    /**
     * Moves to the next question in the quiz
     * @param state - Current quiz state
     */
    nextQuestion: (state) => {
      if (state.activeQuiz) {
        state.activeQuiz.currentQuestion += 1;
        state.activeQuiz.selectedAnswer = null;
      }
    },
    
    /**
     * Updates the current quiz score
     * @param state - Current quiz state
     * @param action - New score value
     */
    updateScore: (state, action: PayloadAction<number>) => {
      if (state.activeQuiz) {
        state.activeQuiz.score = action.payload;
      }
    },
    
    /**
     * Sets the reading text for the current question
     * @param state - Current quiz state
     * @param action - Object containing text ID and show flag
     */
    setReadingText: (state, action: PayloadAction<{ textId: string; show: boolean }>) => {
      if (state.activeQuiz) {
        state.activeQuiz.currentTextId = action.payload.textId;
        state.activeQuiz.showReadingText = action.payload.show;
      }
    },
    
    /**
     * Ends the current quiz session
     * @param state - Current quiz state
     */
    endQuiz: (state) => {
      state.activeQuiz = null;
    },
  },
});

export const { 
  setCurrentTopic, 
  addWrongQuestion, 
  clearWrongQuestions,
  updateDailyStats,
  setQuizResult,
  clearQuizResult,
  startQuiz,
  selectAnswer,
  nextQuestion,
  updateScore,
  setReadingText,
  endQuiz,
} = quizSlice.actions;

// Selectors
const selectQuizState = (state: RootState) => state.quiz;

/**
 * Selector to get the currently selected topic ID
 * @returns Topic ID or null if none selected
 */
export const selectCurrentTopicId = createSelector(
  [selectQuizState],
  (quizState) => quizState.currentTopicId
);

/**
 * Selector to get all wrong questions
 * @returns Array of questions that were answered incorrectly
 */
export const selectWrongQuestions = createSelector(
  [selectQuizState],
  (quizState) => quizState.wrongQuestions
);

/**
 * Selector to get wrong questions for a specific topic
 * @returns Array of wrong questions for the specified topic
 */
export const selectWrongQuestionsByTopic = createSelector(
  [selectWrongQuestions, (_state: RootState, topicId: string) => topicId],
  (questions, topicId) => questions.filter(q => q.topicId === topicId)
);

/**
 * Selector to get daily statistics
 * @returns Array of daily quiz statistics
 */
export const selectDailyStats = createSelector(
  [selectQuizState],
  (quizState) => quizState.dailyStats
);

/**
 * Selector to get the current quiz result
 * @returns Current quiz result or null if no result is stored
 */
export const selectCurrentQuizResult = createSelector(
  [selectQuizState],
  (quizState) => quizState.currentResult
);

/**
 * Selector to get the current active quiz state
 * @returns Active quiz state or null if no quiz is active
 */
export const selectActiveQuiz = createSelector(
  [selectQuizState],
  (quizState) => quizState.activeQuiz
); 
