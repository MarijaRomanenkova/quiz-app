import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../types';

const initialState: UserProfile = {
  name: '',
  studyPaceId: 0,
  agreedToTerms: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      return action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUserProfile, updateUserProfile } = userSlice.actions; 
