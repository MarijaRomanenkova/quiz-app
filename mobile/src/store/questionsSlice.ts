import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Question, ReadingText } from '../types';
import type { RootState } from './index';

interface QuestionsState {
  cache: Record<string, {
    questions: Question[];
    currentChunk: number;
    totalChunks: number;
    lastFetched: number;
  }>;
}

const initialState: QuestionsState = {
  cache: {},
};

const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const CHUNK_SIZE = 10;

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    cacheQuestions: (state, action: PayloadAction<{
      topicId: string;
      questions: Question[];
    }>) => {
      state.cache[action.payload.topicId] = {
        questions: action.payload.questions,
        currentChunk: 0,
        totalChunks: Math.ceil(action.payload.questions.length / CHUNK_SIZE),
        lastFetched: Date.now()
      };
    },
    nextChunk: (state, action: PayloadAction<string>) => {
      const topicCache = state.cache[action.payload];
      if (topicCache) {
        topicCache.currentChunk += 1;
      }
    },
    clearCache: (state) => {
      state.cache = {};
    },
  },
});

// Memoized selectors
const selectQuestionsCache = (state: RootState) => state.questions.cache;

export const selectCurrentChunk = createSelector(
  [selectQuestionsCache, (_state: RootState, topicId: string) => topicId],
  (cache, topicId) => {
    const cached = cache[topicId];
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.lastFetched > CACHE_EXPIRY;
    if (isExpired) return null;

    const start = cached.currentChunk * CHUNK_SIZE;
    const end = start + CHUNK_SIZE;
    return cached.questions.slice(start, end);
  }
);

export const shouldLoadMore = createSelector(
  [selectQuestionsCache, (_state: RootState, topicId: string) => topicId],
  (cache, topicId) => {
    const cached = cache[topicId];
    if (!cached) return true;
    
    const remainingChunks = cached.totalChunks - cached.currentChunk;
    return remainingChunks <= cached.totalChunks * 0.5; // Load more when 50% of questions are used
  }
);

export const { cacheQuestions, nextChunk, clearCache } = questionsSlice.actions;

export default questionsSlice.reducer;
