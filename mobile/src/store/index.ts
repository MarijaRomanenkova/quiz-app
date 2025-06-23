import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

import userReducer from './userSlice';
import authReducer from './authSlice';
import { quizSlice } from './quizSlice';
import { statisticsSlice } from './statisticsSlice';
import categoryReducer from './categorySlice';
import topicReducer from './topicSlice';
import questionsReducer from './questionsSlice';
import readingTextsReducer from './readingTextsSlice';
import quizResultsReducer from './quizResultsSlice';
import wrongQuestionsReducer from './wrongQuestionsSlice';
import progressReducer from './progressSlice';

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

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  quiz: quizSlice.reducer,
  statistics: statisticsSlice.reducer,
  category: categoryReducer,
  topic: topicReducer,
  questions: questionsReducer,
  readingTexts: readingTextsReducer,
  quizResults: quizResultsReducer,
  wrongQuestions: wrongQuestionsReducer,
  progress: progressReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
