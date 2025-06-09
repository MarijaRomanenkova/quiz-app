import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question } from '../types';

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

export const { addWrongQuestion, clearWrongQuestions } = wrongQuestionsSlice.actions;
export default wrongQuestionsSlice.reducer; 
