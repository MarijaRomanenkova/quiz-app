import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: QuizState = {
  currentTopicId: null,
  wrongQuestionIds: [],
  dailyStats: [],
  bestAttempts: [],
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
  },
});

export const { 
  setCurrentTopic, 
  addWrongQuestion, 
  clearWrongQuestions,
  updateDailyStats,
  updateBestAttempt 
} = quizSlice.actions; 
