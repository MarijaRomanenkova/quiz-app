import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QuizAttempt } from '../types';

/**
 * Statistics state interface
 * @interface StatisticsState
 * @property {QuizAttempt[]} attempts - Array of quiz attempts
 * @property {number} totalAttempts - Total number of attempts made
 */
interface StatisticsState {
  attempts: QuizAttempt[];
  totalAttempts: number;
}

const initialState: StatisticsState = {
  attempts: [],
  totalAttempts: 0,
};

export const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    /**
     * Adds a new quiz attempt to the statistics
     * @param {StatisticsState} state - Current state
     * @param {PayloadAction<QuizAttempt>} action - Quiz attempt data
     */
    addAttempt: (state, action: PayloadAction<QuizAttempt>) => {
      state.attempts.push(action.payload);
      state.totalAttempts += 1;
    },
  },
}); 
