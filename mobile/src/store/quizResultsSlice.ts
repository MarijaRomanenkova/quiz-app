import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QuizResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
}

interface QuizResultsState {
  currentResult: QuizResult | null;
}

const initialState: QuizResultsState = {
  currentResult: null,
};

const quizResultsSlice = createSlice({
  name: 'quizResults',
  initialState,
  reducers: {
    setQuizResult: (state, action: PayloadAction<QuizResult>) => {
      state.currentResult = action.payload;
    },
    clearQuizResult: (state) => {
      state.currentResult = null;
    },
  },
});

export const { setQuizResult, clearQuizResult } = quizResultsSlice.actions;
export default quizResultsSlice.reducer; 
