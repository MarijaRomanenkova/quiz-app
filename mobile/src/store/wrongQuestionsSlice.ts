import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Question } from '../types';
import type { RootState } from './index';

/**
 * Interface representing the wrong questions slice state
 */
interface WrongQuestionsState {
  /** Array of questions that were answered incorrectly */
  wrongQuestions: Question[];
}

/**
 * Initial state for the wrong questions slice
 */
const initialState: WrongQuestionsState = {
  wrongQuestions: [],
};

/**
 * Redux slice for managing wrong questions
 * 
 * This slice handles tracking questions that users answered incorrectly
 * for review and practice purposes.
 */
const wrongQuestionsSlice = createSlice({
  name: 'wrongQuestions',
  initialState,
  reducers: {
    /**
     * Adds a question to the list of wrong questions
     * @param state - Current wrong questions state
     * @param action - Question object to add
     */
    addWrongQuestion: (state, action: PayloadAction<Question>) => {
      state.wrongQuestions.push(action.payload);
    },
    
    /**
     * Clears all wrong questions
     * @param state - Current wrong questions state
     */
    clearWrongQuestions: (state) => {
      state.wrongQuestions = [];
    },
  },
});

/**
 * Selector to get all wrong questions
 * @returns Array of all wrong questions
 */
export const selectWrongQuestions = (state: RootState) => state.wrongQuestions.wrongQuestions;

/**
 * Selector to get wrong questions for a specific topic
 * @returns Array of wrong questions for the specified topic
 */
export const selectWrongQuestionsByTopic = createSelector(
  [selectWrongQuestions, (_state: RootState, topicId: string) => topicId],
  (questions, topicId) => questions.filter(q => q.topicId === topicId)
);

export const { addWrongQuestion, clearWrongQuestions } = wrongQuestionsSlice.actions;
export default wrongQuestionsSlice.reducer; 
