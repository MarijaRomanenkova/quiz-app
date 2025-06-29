import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * Interface representing a quiz result
 */
interface QuizResult {
  /** Score achieved in the quiz (0-100) */
  score: number;
  /** Total number of questions in the quiz */
  totalQuestions: number;
  /** Time spent on the quiz in minutes */
  timeSpent: number;
}

/**
 * Interface representing the quiz results slice state
 */
interface QuizResultsState {
  /** Current quiz result or null if no result is stored */
  currentResult: QuizResult | null;
}

/**
 * Initial state for the quiz results slice
 */
const initialState: QuizResultsState = {
  currentResult: null,
};

/**
 * Redux slice for managing quiz results
 * 
 * This slice handles storing and clearing quiz results
 * for display in the results screen.
 */
const quizResultsSlice = createSlice({
  name: 'quizResults',
  initialState,
  reducers: {
    /**
     * Sets the current quiz result
     * @param state - Current quiz results state
     * @param action - Quiz result data to store
     */
    setQuizResult: (state, action: PayloadAction<QuizResult>) => {
      state.currentResult = action.payload;
    },
    
    /**
     * Clears the current quiz result
     * @param state - Current quiz results state
     */
    clearQuizResult: (state) => {
      state.currentResult = null;
    },
  },
});

export const { setQuizResult, clearQuizResult } = quizResultsSlice.actions;
export default quizResultsSlice.reducer; 
