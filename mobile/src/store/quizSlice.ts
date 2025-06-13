import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Question } from '../types';

interface QuizState {
  currentTopicId: string | null;
  wrongQuestionIds: string[];
  dailyStats: {
    date: string;
    timeSpent: number;
    questionsAnswered: number;
  }[];
  bestAttempts: {
    topicId: string;
    score: number;
    date: string;
    timeSpent: number;
  }[];
  activeQuiz: {
    currentQuestion: number;
    score: number;
    selectedAnswer: number | null;
    currentTextId: string | null;
    showReadingText: boolean;
  } | null;
}

const initialState: QuizState = {
  currentTopicId: null,
  wrongQuestionIds: [],
  dailyStats: [],
  bestAttempts: [],
  activeQuiz: null,
};

export const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setCurrentTopic: (state, action: PayloadAction<string>) => {
      state.currentTopicId = action.payload;
    },
    addWrongQuestion: (state, action: PayloadAction<string>) => {
      state.wrongQuestionIds.push(action.payload);
    },
    clearWrongQuestions: (state) => {
      state.wrongQuestionIds = [];
    },
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
    updateBestAttempt: (state, action: PayloadAction<{
      topicId: string;
      score: number;
      timeSpent: number;
    }>) => {
      const { topicId, score, timeSpent } = action.payload;
      const existingIndex = state.bestAttempts.findIndex(attempt => attempt.topicId === topicId);
      
      if (existingIndex >= 0) {
        if (state.bestAttempts[existingIndex].score < score) {
          state.bestAttempts[existingIndex] = {
            topicId,
            score,
            timeSpent,
            date: new Date().toISOString()
          };
        }
      } else {
        state.bestAttempts.push({
          topicId,
          score,
          timeSpent,
          date: new Date().toISOString()
        });
      }
    },
    // New actions for active quiz state
    startQuiz: (state) => {
      state.activeQuiz = {
        currentQuestion: 0,
        score: 0,
        selectedAnswer: null,
        currentTextId: null,
        showReadingText: false,
      };
    },
    selectAnswer: (state, action: PayloadAction<number | null>) => {
      if (state.activeQuiz) {
        state.activeQuiz.selectedAnswer = action.payload;
      }
    },
    nextQuestion: (state) => {
      if (state.activeQuiz) {
        state.activeQuiz.currentQuestion += 1;
        state.activeQuiz.selectedAnswer = null;
      }
    },
    updateScore: (state, action: PayloadAction<number>) => {
      if (state.activeQuiz) {
        state.activeQuiz.score = action.payload;
      }
    },
    setReadingText: (state, action: PayloadAction<{ textId: string; show: boolean }>) => {
      if (state.activeQuiz) {
        state.activeQuiz.currentTextId = action.payload.textId;
        state.activeQuiz.showReadingText = action.payload.show;
      }
    },
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
  updateBestAttempt,
  startQuiz,
  selectAnswer,
  nextQuestion,
  updateScore,
  setReadingText,
  endQuiz,
} = quizSlice.actions; 

// Selectors
const selectQuizState = (state: RootState) => state.quiz;

export const selectCurrentTopicId = createSelector(
  [selectQuizState],
  (quizState) => quizState.currentTopicId
);

export const selectWrongQuestionIds = createSelector(
  [selectQuizState],
  (quizState) => quizState.wrongQuestionIds
);

export const selectDailyStats = createSelector(
  [selectQuizState],
  (quizState) => quizState.dailyStats
);

export const selectBestAttempts = createSelector(
  [selectQuizState],
  (quizState) => quizState.bestAttempts
);

export const selectBestAttemptByTopic = createSelector(
  [selectBestAttempts, (_state: RootState, topicId: string) => topicId],
  (bestAttempts, topicId) => bestAttempts.find(attempt => attempt.topicId === topicId)
);

export const selectActiveQuiz = createSelector(
  [selectQuizState],
  (quizState) => quizState.activeQuiz
); 
