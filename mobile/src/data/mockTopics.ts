import { Category } from '../types';
import { QuizTopic} from '../types';

export const mockTopics: QuizTopic[] = [
  // Grammar topics
  { topicId: 'g1', title: 'Articles', categoryId: 'grammar' },
  { topicId: 'g2', title: 'Present Tense', categoryId: 'grammar' },
  { topicId: 'g3', title: 'Past Tense', categoryId: 'grammar'},
  
  // Reading topics
  { topicId: 'r1', title: 'Short Stories', categoryId: 'reading' },
  { topicId: 'r2', title: 'News Articles', categoryId: 'reading' },
  { topicId: 'r3', title: 'Dialogues', categoryId: 'reading' },
  
  // Listening topics
  { topicId: 'l1', title: 'Basic', categoryId: 'listening' },
  { topicId: 'l2', title: 'News Reports', categoryId: 'listening' },
  { topicId: 'l3', title: 'Songs', categoryId: 'listening' },
  
  // Words topics
  { topicId: 'w1', title: 'Fruit & Veggies', categoryId: 'words' },
  { topicId: 'w2', title: 'Fashion', categoryId: 'words' },
  { topicId: 'w3', title: 'Family & Friends', categoryId: 'words' },
  { topicId: 'w4', title: 'Travel', categoryId: 'words' },
  { topicId: 'w5', title: 'Basics', categoryId: 'words' },
];

export const getTopicsForCategory = (categoryId: string): QuizTopic[] => {
  return mockTopics.filter(topic => topic.categoryId === categoryId);
}; 
