import { Question, TextQuestion, ImageQuestion, AudioQuestion, ReadingQuestion, TrueFalseQuestion } from '../types';
import { mockTexts } from './mockTexts';

export const mockQuestions: Question[] = [
  // Fruits & Vegetables
  {
    questionId: '1',
    type: 'text',
    question: 'What is the English translation of "Apfel"?',
    options: ['Pear', 'Apple', 'Orange', 'Banana'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w1'
  } as TextQuestion,
  {
    questionId: '2',
    type: 'image',
    imageUrl: 'https://res.cloudinary.com/djgtzqgut/image/upload/v1738692039/tomato-simple_dbgb9b.jpg',
    question: 'What is this?',
    options: ['Apple', 'Clemintine', 'Tomato', 'Carrot'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'w1'
  } as ImageQuestion,
  {
    questionId: '3',
    type: 'audio',
    audioUrl: 'https://res.cloudinary.com/djgtzqgut/video/upload/v1738913375/shopping_b5h2ax.mp3',
    question: 'Was kauft Lisa?',
    options: ['Lisa kauft Käse', 'Lisa kauft Milch', 'Lisa kauft Brot', 'Lisa kauft Eier'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'l1'
  } as AudioQuestion,

  // Grammar - Articles (g1)
  {
    questionId: 'g1',
    type: 'text',
    question: 'Which article is correct? "___ Buch ist neu."',
    options: ['Der', 'Die', 'Das', 'Den'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'g1'
  } as TextQuestion,
  {
    questionId: 'g2',
    type: 'text',
    question: 'Which article is correct? "___ Frau ist jung."',
    options: ['Der', 'Die', 'Das', 'Den'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'g1'
  } as TextQuestion,
  {
    questionId: 'g3',
    type: 'text',
    question: 'Which article is correct? "___ Mann ist groß."',
    options: ['Der', 'Die', 'Das', 'Den'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'g1'
  } as TextQuestion,

  // Grammar - Present Tense (g2)
  {
    questionId: 'g4',
    type: 'text',
    question: 'What is the correct form? "Ich ___ Deutsch."',
    options: ['lerne', 'lernst', 'lernt', 'lernen'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'g2'
  } as TextQuestion,
  {
    questionId: 'g5',
    type: 'text',
    question: 'What is the correct form? "Du ___ gut."',
    options: ['spiele', 'spielst', 'spielt', 'spielen'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'g2'
  } as TextQuestion,
  {
    questionId: 'g6',
    type: 'text',
    question: 'What is the correct form? "Er ___ Kaffee."',
    options: ['trinke', 'trinkst', 'trinkt', 'trinken'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'g2'
  } as TextQuestion,

  // Grammar - Past Tense (g3)
  {
    questionId: 'g7',
    type: 'text',
    question: 'What is the correct past tense? "Ich ___ gestern."',
    options: ['gehe', 'ging', 'gegangen', 'geht'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'g3'
  } as TextQuestion,
  {
    questionId: 'g8',
    type: 'text',
    question: 'What is the correct past tense? "Wir ___ nach Hause."',
    options: ['fahren', 'fuhren', 'gefahren', 'fahrt'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'g3'
  } as TextQuestion,
  {
    questionId: 'g9',
    type: 'text',
    question: 'What is the correct past tense? "Sie ___ das Buch."',
    options: ['lese', 'las', 'gelesen', 'liest'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'g3'
  } as TextQuestion,

  // Words - Fruit & Veggies (w1)
  {
    questionId: 'w3',
    type: 'text',
    question: 'What is the English translation of "Karotte"?',
    options: ['Potato', 'Carrot', 'Cucumber', 'Pepper'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w1'
  } as TextQuestion,

  // Words - Fashion (w2)
  {
    questionId: 'w4',
    type: 'text',
    question: 'What is the English translation of "Kleid"?',
    options: ['Shirt', 'Dress', 'Pants', 'Shoes'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w2'
  } as TextQuestion,
  {
    questionId: 'w5',
    type: 'text',
    question: 'What is the English translation of "Hose"?',
    options: ['Shirt', 'Dress', 'Pants', 'Shoes'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'w2'
  } as TextQuestion,
  {
    questionId: 'w6',
    type: 'text',
    question: 'What is the English translation of "Schuhe"?',
    options: ['Shirt', 'Dress', 'Pants', 'Shoes'],
    correctAnswerId: '3',
    points: 10,
    topicId: 'w2'
  } as TextQuestion,

  // Words - Family & Friends (w3)
  {
    questionId: 'w7',
    type: 'text',
    question: 'What is the English translation of "Mutter"?',
    options: ['Father', 'Mother', 'Sister', 'Brother'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w3'
  } as TextQuestion,
  {
    questionId: 'w8',
    type: 'text',
    question: 'What is the English translation of "Vater"?',
    options: ['Father', 'Mother', 'Sister', 'Brother'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'w3'
  } as TextQuestion,
  {
    questionId: 'w9',
    type: 'text',
    question: 'What is the English translation of "Freund"?',
    options: ['Friend', 'Enemy', 'Neighbor', 'Colleague'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'w3'
  } as TextQuestion,

  // Words - Travel (w4)
  {
    questionId: 'w10',
    type: 'text',
    question: 'What is the English translation of "Reise"?',
    options: ['Stay', 'Travel', 'Visit', 'Return'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w4'
  } as TextQuestion,
  {
    questionId: 'w11',
    type: 'text',
    question: 'What is the English translation of "Flughafen"?',
    options: ['Train Station', 'Bus Stop', 'Airport', 'Harbor'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'w4'
  } as TextQuestion,
  {
    questionId: 'w12',
    type: 'text',
    question: 'What is the English translation of "Zug"?',
    options: ['Bus', 'Car', 'Train', 'Plane'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'w4'
  } as TextQuestion,

  // Words - Basics (w5)
  {
    questionId: 'w13',
    type: 'text',
    question: 'What is the English translation of "Hallo"?',
    options: ['Goodbye', 'Hello', 'Thank you', 'Please'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w5'
  } as TextQuestion,
  {
    questionId: 'w14',
    type: 'text',
    question: 'What is the English translation of "Danke"?',
    options: ['Goodbye', 'Hello', 'Thank you', 'Please'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'w5'
  } as TextQuestion,
  {
    questionId: 'w15',
    type: 'text',
    question: 'What is the English translation of "Bitte"?',
    options: ['Goodbye', 'Hello', 'Thank you', 'Please'],
    correctAnswerId: '3',
    points: 10,
    topicId: 'w5'
  } as TextQuestion,

  // Reading Questions (now as separate true/false questions)
  {
    questionId: 'rq1',
    type: 'trueFalse',
    statement: 'Lisa kauft Käse im Supermarkt.',
    correctAnswer: false,
    points: 5,
    topicId: 'r1',
    textId: 'r1'  // Reference to the reading text
  } as TrueFalseQuestion,
  {
    questionId: 'rq2',
    type: 'trueFalse',
    statement: 'Lisa kauft Brot und Milch.',
    correctAnswer: true,
    points: 5,
    topicId: 'r1',
    textId: 'r1'  // Reference to the reading text
  } as TrueFalseQuestion,
  {
    questionId: 'rq3',
    type: 'trueFalse',
    statement: 'Anna wohnt in München.',
    correctAnswer: false,
    points: 5,
    topicId: 'r2',
    textId: 'r2'
  } as TrueFalseQuestion,
  {
    questionId: 'rq4',
    type: 'trueFalse',
    statement: 'Anna geht nach der Arbeit spazieren.',
    correctAnswer: true,
    points: 5,
    topicId: 'r2',
    textId: 'r2'
  } as TrueFalseQuestion
];

export const QUESTIONS_PER_QUIZ = 10;

export function getQuestionsByTopic(topicId: string): Question[] {
  return mockQuestions.filter(q => q.topicId === topicId);
}

export function getRandomQuestions(topicId: string): Question[] {
  // For reading topics, we need to group questions by textId
  if (topicId.startsWith('r')) {
    const topicQuestions = getQuestionsByTopic(topicId);
    const textId = topicQuestions[0]?.textId;
    if (!textId) return [];

    // Get all questions for this text
    const readingQuestions = topicQuestions.filter(q => q.textId === textId);
    return readingQuestions;
  }

  // For other topics, return regular questions
  const topicQuestions = getQuestionsByTopic(topicId);
  const shuffled = [...topicQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, QUESTIONS_PER_QUIZ);
}

// Simulate API pagination
export const fetchMockQuestions = async (topicId: string, cursor?: string): Promise<{ questions: Question[], nextCursor?: string, hasMore: boolean }> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const pageSize = 10;
  const filteredQuestions = mockQuestions.filter(q => q.topicId === topicId);
  const startIndex = cursor ? parseInt(cursor) : 0;
  const endIndex = startIndex + pageSize;
  
  return {
    questions: filteredQuestions.slice(startIndex, endIndex),
    nextCursor: endIndex < filteredQuestions.length ? endIndex.toString() : undefined,
    hasMore: endIndex < filteredQuestions.length
  };
}; 
