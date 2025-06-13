import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Question } from '../types';
import type { RootState } from './index';

interface WrongQuestionsState {
  wrongQuestions: Question[];
}

const initialState: WrongQuestionsState = {
  wrongQuestions: [],
};

const wrongQuestionsSlice = createSlice({
  name: 'wrongQuestions',
  initialState,
  reducers: {
    addWrongQuestion: (state, action: PayloadAction<Question>) => {
      state.wrongQuestions.push(action.payload);
    },
    clearWrongQuestions: (state) => {
      state.wrongQuestions = [];
    },
  },
});

// Selectors
export const selectWrongQuestions = (state: RootState) => state.wrongQuestions.wrongQuestions;

export const selectWrongQuestionsByTopic = createSelector(
  [selectWrongQuestions, (_state: RootState, topicId: string) => topicId],
  (questions, topicId) => questions.filter(q => q.topicId === topicId)
);

export const { addWrongQuestion, clearWrongQuestions } = wrongQuestionsSlice.actions;
export default wrongQuestionsSlice.reducer; 
