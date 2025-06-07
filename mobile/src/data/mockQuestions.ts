import { Question, ReadingText, QuizResponse } from '../types';
import { mockTexts } from './mockTexts';


export const mockQuestions: Question[] = [
  // Fruits & Vegetables
  {
    questionId: '1',
    type: 'text',
    content: 'What is the English translation of "Apfel"?',
    options: ['Pear', 'Apple', 'Orange', 'Banana'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w1'
  },
  {
    questionId: '2',
    type: 'image',
    content: 'https://res.cloudinary.com/djgtzqgut/image/upload/v1738692039/tomato-simple_dbgb9b.jpg',
    options: ['Apple', 'Clemintine', 'Tomato', 'Carrot'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'w1'
  },
  {
    questionId: '3',
    type: 'text',
    content: 'What is the English translation of "Apfel"?',
    options: ['Pear', 'Apple', 'Carrot', 'Orange'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w1'
  },
  {
    questionId: '4',
    type: 'image',
    content: 'https://res.cloudinary.com/djgtzqgut/image/upload/v1738694460/potato_wx4rk7.jpg',
    options: ['Apple', 'Soup', 'Tomato', 'Potato'],
    correctAnswerId: '4',
    points: 10,
    topicId: 'w1'
  },
  {
    questionId: '5',
    type: 'text',
    content: 'What is the English translation of "Apfel"?',
    options: ['Meat', 'Apple', 'Orange', 'Banana'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w1'
  },
  {
    questionId: '6',
    type: 'image',
    content: 'https://res.cloudinary.com/djgtzqgut/image/upload/v1738694460/potato_wx4rk7.jpg',
    options: ['Grapes', 'Pizza', 'Tomato', 'Carrot'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'w1'
  },
  {
    questionId: '7',
    type: 'text',
    content: 'What is the English translation of "Apfel"?',
    options: ['Potato', 'Apple', 'Orange', 'Banana'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w1'
  },
  {
    questionId: '8',
    type: 'image',
    content: 'https://res.cloudinary.com/djgtzqgut/image/upload/v1738693412/apple_ykjwki.jpg',
    options: ['Apple', 'Herbs', 'Tomato', 'Carrot'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'w1'
  },
  
  // Grammar - Articles
  {
    questionId: '1',
    type: 'text',
    content: 'Select the correct article: "___ Haus"',
    options: ['der', 'die', 'das', 'den'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'g1'
  },
  {
    questionId: '2',
    type: 'text',
    content: 'Select the correct article: "___ Frau"',
    options: ['der', 'die', 'das', 'den'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'g1'
  },
  {
    questionId: '3',
    type: 'text',
    content: 'Select the correct article: "___ Mann"',
    options: ['der', 'die', 'das', 'den'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'g1'
  },
  
  // Present Tense
  {
    questionId: '1',
    type: 'text',
    content: 'Complete: "Ich ___ ein Student" (to be)',
    options: ['bin', 'bist', 'ist', 'sind'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'g2'
  },
  {
    questionId: '2',
    type: 'text',
    content: 'Complete: "Du ___ Deutsch" (to speak)',
    options: ['spreche', 'sprichst', 'spricht', 'sprechen'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'g2'
  },

   // Reading - True/False
  {
    questionId: '1',
    type: 'trueFalse',
    content: 'Lisa kauft Käse.',
    options: ['True', 'False'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'r1'
  },
 
  // Audio Questions
  {
    questionId: '1',
    type: 'audio',
    content: 'https://res.cloudinary.com/djgtzqgut/video/upload/v1738913375/shopping_b5h2ax.mp3', // Replace with actual audio URL
    options: ['Lisa kauft Käse', 'Lisa kauft Milch', 'Lisa kauft Brot', 'Lisa kauft Eier'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'l1'  // assuming 'l1' is your listening topic ID
  },
  {
    questionId: '2',
    type: 'audio',
    content: 'https://res.cloudinary.com/djgtzqgut/video/upload/v1738913375/askdirection_hd0yg8.mp3', // Replace with actual audio URL
    options: ['Der Mann sucht nach Bibliothek', 'Man ist 42', 'Die Frau sucht nach Apotheke', 'Die Frau ist 23'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'l1'
  },
];

export const QUESTIONS_PER_QUIZ = 10;

export function getQuestionsByTopic(topicId: string): Question[] {
  return mockQuestions.filter(q => q.topicId === topicId);
}

export function getRandomQuestions(topicId: string): Question[] {
  const topicQuestions = getQuestionsByTopic(topicId);
  const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, QUESTIONS_PER_QUIZ);
}

// Simulate API pagination
export const fetchMockQuestions = async (topicId: string, cursor?: string): Promise<QuizResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const pageSize = 10;
  const filteredQuestions = mockQuestions.filter(q => q.topicId === topicId);
  const startIndex = cursor ? parseInt(cursor) : 0;
  const endIndex = startIndex + pageSize;
  
  // Find the associated text for this topic
  const topicText = mockTexts.find(t => t.topicId === topicId);
  
  return {
    questions: filteredQuestions.slice(startIndex, endIndex),
    nextCursor: endIndex < filteredQuestions.length ? endIndex.toString() : undefined,
    hasMore: endIndex < filteredQuestions.length,
    text: topicText?.text
  };
}; 
