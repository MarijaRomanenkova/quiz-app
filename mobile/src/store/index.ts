import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

import { userSlice } from './userSlice';
import authReducer from './authSlice';
import { quizSlice } from './quizSlice';
import { statisticsSlice } from './statisticsSlice';
import categoryReducer from './categorySlice';
import questionsReducer from './questionsSlice';
import quizResultsReducer from './quizResultsSlice';
import wrongQuestionsReducer from './wrongQuestionsSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user', 'statistics', 'questions'], // only persist necessary data
};

const rootReducer = combineReducers({
  user: userSlice.reducer,
  auth: authReducer,
  quiz: quizSlice.reducer,
  statistics: statisticsSlice.reducer,
  category: categoryReducer,
  questions: questionsReducer,
  quizResults: quizResultsReducer,
  wrongQuestions: wrongQuestionsReducer,
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
