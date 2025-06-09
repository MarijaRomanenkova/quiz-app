import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { UserProfile } from '../types/user.types';
import type { Question } from '../types';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: {
    userProfile?: UserProfile;
  };
  Category: { categoryId: string };
  Topic: { topicId: string };
  Quiz: {
    quizId: string;
    isRepeating?: boolean;
  };
  Results: {
    quizId: string;
  };
  Profile: undefined;
  Progress: undefined;
  Terms: undefined;
  Onboarding: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 
