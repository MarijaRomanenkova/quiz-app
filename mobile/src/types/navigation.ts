import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  Category: { categoryId: string };
  Topic: { categoryId: string };
  Quiz: {
    quizId: string;
    isRepeating?: boolean;
  };
  Results: {
    quizId: string;
  };
  WrongQuestions: undefined;
  Profile: undefined;
  Settings: undefined;
  About: undefined;
  PrivacyPolicy: undefined;
  TermsOfService: undefined;
  Contact: undefined;
  Help: undefined;
  Feedback: undefined;
  Notifications: undefined;
  Language: undefined;
  Theme: undefined;
  Sound: undefined;
  Vibration: undefined;
  FontSize: undefined;
  ColorScheme: undefined;
  Accessibility: undefined;
  DataUsage: undefined;
  Storage: undefined;
  Cache: undefined;
  Updates: undefined;
  Version: undefined;
  Credits: undefined;
  License: undefined;
  Progress: undefined;
  Terms: undefined;
  Onboarding: undefined;
};

export type TabParamList = {
  Dashboard: undefined;
  Progress: undefined;
  Profile: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>; 
