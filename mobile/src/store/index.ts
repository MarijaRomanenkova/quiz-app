/**
 * @fileoverview Redux store configuration and setup for the mobile application
 * 
 * This module configures the main Redux store with all application slices,
 * sets up Redux Persist for state persistence, and exports the store instance
 * along with TypeScript types for use throughout the application.
 * 
 * The store includes the following slices:
 * - auth: Authentication state and user session management
 * - user: User profile data and preferences
 * - quiz: Current quiz session state and progress
 * - statistics: User performance statistics and analytics
 * - category: Available quiz categories
 * - topic: Available quiz topics
 * - questions: Quiz questions data
 * - readingTexts: Reading comprehension texts
 * - quizResults: Historical quiz results and scores
 * - wrongQuestions: Incorrectly answered questions for review
 * - progress: User learning progress and achievements
 * 
 * @module store
 */

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

import userReducer from './userSlice';
import authReducer from './authSlice';
import { quizSlice } from './quizSlice';
import statisticsReducer from './statisticsSlice';
import categoryReducer from './categorySlice';
import topicReducer from './topicSlice';
import questionsReducer from './questionsSlice';
import readingTextsReducer from './readingTextsSlice';
import quizResultsReducer from './quizResultsSlice';
import wrongQuestionsReducer from './wrongQuestionsSlice';
import progressReducer from './progressSlice';

/**
 * Redux Persist configuration for state persistence
 * 
 * Configures which slices should be persisted to AsyncStorage and how
 * the persistence should be handled. Only essential state is persisted
 * to avoid storage bloat and performance issues.
 * 
 * @type {Object}
 * @property {string} key - Root key for the persisted state
 * @property {AsyncStorage} storage - Storage engine (AsyncStorage for React Native)
 * @property {string[]} whitelist - Array of slice names to persist
 */
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'auth', 
    'user', 
    'statistics', 
    'questions',
    'readingTexts',
    'category',
    'topic',
    'progress'
  ],
};

/**
 * Combined root reducer that merges all application slices
 * 
 * Each slice manages a specific domain of the application state:
 * - user: User profile and preferences
 * - auth: Authentication and session state
 * - quiz: Current quiz session
 * - statistics: Performance metrics
 * - category: Quiz categories
 * - topic: Quiz topics
 * - questions: Quiz questions data
 * - readingTexts: Reading materials
 * - quizResults: Historical results
 * - wrongQuestions: Incorrect answers for review
 * - progress: Learning progress tracking
 * 
 * @type {Reducer}
 */
const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  quiz: quizSlice.reducer,
  statistics: statisticsReducer,
  category: categoryReducer,
  topic: topicReducer,
  questions: questionsReducer,
  readingTexts: readingTextsReducer,
  quizResults: quizResultsReducer,
  wrongQuestions: wrongQuestionsReducer,
  progress: progressReducer,
});

/**
 * Persisted reducer that automatically saves and restores state
 * 
 * Wraps the root reducer with Redux Persist functionality to enable
 * state persistence across app restarts and device reboots.
 * 
 * @type {Reducer}
 */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Main Redux store instance
 * 
 * Configures the store with the persisted reducer and custom middleware
 * settings. Disables serializable checks for Redux Persist actions to
 * prevent warnings about non-serializable values.
 * 
 * @type {Store}
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

/**
 * Redux Persist persistor instance
 * 
 * Handles the actual persistence operations, including saving state
 * to AsyncStorage and restoring it on app startup.
 * 
 * @type {Persistor}
 */
export const persistor = persistStore(store);

/**
 * TypeScript type for the complete application state
 * 
 * Automatically inferred from the store configuration, this type
 * provides full type safety when accessing state throughout the app.
 * Use this type for useSelector hooks and other state access patterns.
 * 
 * @type {Object}
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * TypeScript type for the store's dispatch function
 * 
 * Provides type safety for dispatching actions throughout the app.
 * Use this type for useDispatch hooks and other dispatch patterns.
 * 
 * @type {Function}
 */
export type AppDispatch = typeof store.dispatch;
