import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { UserProfile } from '../types/user.types';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Category: { categoryId: string };
  Topic: { topicId: string };
  Quiz: { quizId: string };
  Results: { quizId: string; score: number };
  Profile: undefined;
  Progress: undefined;
  Terms: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 
