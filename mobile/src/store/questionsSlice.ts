import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question, ReadingText } from '../types';
import type { RootState } from './index';

interface QuestionsState {
  cache: Record<string, {
    questions: Question[];
    text?: ReadingText;
    timestamp: number;
    expiresIn: number;
  }>;
}

const initialState: QuestionsState = {
  cache: {},
};

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    cacheQuestions: (state, action: PayloadAction<{
      topicId: string;
      questions: Question[];
      text?: ReadingText;
    }>) => {
      state.cache[action.payload.topicId] = {
        questions: action.payload.questions,
        text: action.payload.text,
        timestamp: Date.now(),
        expiresIn: CACHE_EXPIRY
      };
    },
    clearCache: (state) => {
      state.cache = {};
    },
  },
});

export const { cacheQuestions, clearCache } = questionsSlice.actions;

// Selector to get cached questions and text
export const selectCachedQuestions = (state: RootState, topicId: string) => {
  const cached = state.questions.cache[topicId];
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > cached.expiresIn;
  return isExpired ? null : cached.questions;
};

export const selectCachedText = (state: RootState, topicId: string) => {
  const cached = state.questions.cache[topicId];
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > cached.expiresIn;
  return isExpired ? null : cached.text;
};

export default questionsSlice.reducer;
