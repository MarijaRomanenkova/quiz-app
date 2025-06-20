import { Category } from '../types';
import { QuizTopic} from '../types';

export const mockTopics: QuizTopic[] = [
  // Grammar topics
  { topicId: 'Articles', categoryId: 'grammar' },
  { topicId: 'Present Tense', categoryId: 'grammar' },
  { topicId: 'Past Tense', categoryId: 'grammar'},
  
  // Reading topics
  { topicId: 'Short Stories', categoryId: 'reading' },
  { topicId: 'News Articles', categoryId: 'reading' },
  { topicId: 'Dialogues', categoryId: 'reading' },
  
  // Listening topics
  { topicId: 'Basic', categoryId: 'listening' },
  { topicId: 'News Reports', categoryId: 'listening' },
  { topicId: 'Songs', categoryId: 'listening' },
  
  // Words topics
  { topicId: 'Fruit & Veggies', categoryId: 'words' },
  { topicId: 'Fashion', categoryId: 'words' },
  { topicId: 'Family & Friends', categoryId: 'words' },
  { topicId: 'Travel', categoryId: 'words' },
  { topicId: 'Basics', categoryId: 'words' },
];

export const getTopicsForCategory = (categoryId: string): QuizTopic[] => {
  return mockTopics.filter(topic => topic.categoryId === categoryId);
}; 
