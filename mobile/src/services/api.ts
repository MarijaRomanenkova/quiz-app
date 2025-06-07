import { fetchMockQuestions } from '../data/mockQuestions';
import { Question, QuizTopic } from '../types';

interface QuizResponse {
  questions: Question[];
  nextCursor?: string; // for pagination
  hasMore: boolean;
}

export const fetchQuestions = async (topicId: string, cursor?: string): Promise<QuizResponse> => {
  // Use mock data instead of real API
  return fetchMockQuestions(topicId, cursor);
}; 
