import { Question } from '../types';
import { mockTexts } from './mockTexts';

export const mockQuestions: Question[] = [
  // Fruits & Vegetables
  {
    id: '1',
    questionId: '1',
    questionText: 'What is the English translation of "Apfel"?',
    options: ['Pear', 'Apple', 'Orange', 'Banana'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w1',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    questionId: '2',
    questionText: 'What is this?',
    imageUrl: 'https://res.cloudinary.com/djgtzqgut/image/upload/v1738692039/tomato-simple_dbgb9b.jpg',
    options: ['Apple', 'Clemintine', 'Tomato', 'Carrot'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'w1',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    questionId: '3',
    questionText: 'Was kauft Lisa?',
    audioUrl: 'https://res.cloudinary.com/djgtzqgut/video/upload/v1738913375/shopping_b5h2ax.mp3',
    options: ['Lisa kauft Käse', 'Lisa kauft Milch', 'Lisa kauft Brot', 'Lisa kauft Eier'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'l1',
    categoryId: 'listening',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    questionId: '4',
    questionText: 'Was sucht der Mann?',
    audioUrl: 'https://res.cloudinary.com/djgtzqgut/video/upload/v1738913375/askdirection_hd0yg8.mp3',
    options: ['Der Mann sucht nach Bibliothek', 'Man ist 42', 'Die Frau sucht nach Apotheke', 'Die Frau ist 23'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'l1',
    categoryId: 'listening',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Grammar - Articles (g1)
  {
    id: 'g1',
    questionId: 'g1',
    questionText: 'Which article is correct? "___ Buch ist neu."',
    options: ['Der', 'Die', 'Das', 'Den'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'g1',
    categoryId: 'grammar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'g2',
    questionId: 'g2',
    questionText: 'Which article is correct? "___ Frau ist jung."',
    options: ['Der', 'Die', 'Das', 'Den'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'g1',
    categoryId: 'grammar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'g3',
    questionId: 'g3',
    questionText: 'Which article is correct? "___ Mann ist groß."',
    options: ['Der', 'Die', 'Das', 'Den'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'g1',
    categoryId: 'grammar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Grammar - Present Tense (g2)
  {
    id: 'g4',
    questionId: 'g4',
    questionText: 'What is the correct form? "Ich ___ Deutsch."',
    options: ['lerne', 'lernst', 'lernt', 'lernen'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'g2',
    categoryId: 'grammar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'g5',
    questionId: 'g5',
    questionText: 'What is the correct form? "Du ___ gut."',
    options: ['spiele', 'spielst', 'spielt', 'spielen'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'g2',
    categoryId: 'grammar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'g6',
    questionId: 'g6',
    questionText: 'What is the correct form? "Er ___ Kaffee."',
    options: ['trinke', 'trinkst', 'trinkt', 'trinken'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'g2',
    categoryId: 'grammar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Grammar - Past Tense (g3)
  {
    id: 'g7',
    questionId: 'g7',
    questionText: 'What is the correct past tense? "Ich ___ gestern."',
    options: ['gehe', 'ging', 'gegangen', 'geht'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'g3',
    categoryId: 'grammar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'g8',
    questionId: 'g8',
    questionText: 'What is the correct past tense? "Wir ___ nach Hause."',
    options: ['fahren', 'fuhren', 'gefahren', 'fahrt'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'g3',
    categoryId: 'grammar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'g9',
    questionId: 'g9',
    questionText: 'What is the correct past tense? "Sie ___ das Buch."',
    options: ['lese', 'las', 'gelesen', 'liest'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'g3',
    categoryId: 'grammar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Words - Fruit & Veggies (w1)
  {
    id: 'w3',
    questionId: 'w3',
    questionText: 'What is the English translation of "Karotte"?',
    options: ['Potato', 'Carrot', 'Cucumber', 'Pepper'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w1',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Words - Fashion (w2)
  {
    id: 'w4',
    questionId: 'w4',
    questionText: 'What is the English translation of "Kleid"?',
    options: ['Shirt', 'Dress', 'Pants', 'Shoes'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w2',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w5',
    questionId: 'w5',
    questionText: 'What is the English translation of "Hose"?',
    options: ['Shirt', 'Dress', 'Pants', 'Shoes'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'w2',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w6',
    questionId: 'w6',
    questionText: 'What is the English translation of "Schuhe"?',
    options: ['Shirt', 'Dress', 'Pants', 'Shoes'],
    correctAnswerId: '3',
    points: 10,
    topicId: 'w2',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Words - Family & Friends (w3)
  {
    id: 'w7',
    questionId: 'w7',
    questionText: 'What is the English translation of "Mutter"?',
    options: ['Father', 'Mother', 'Sister', 'Brother'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w3',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w8',
    questionId: 'w8',
    questionText: 'What is the English translation of "Vater"?',
    options: ['Father', 'Mother', 'Sister', 'Brother'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'w3',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w9',
    questionId: 'w9',
    questionText: 'What is the English translation of "Freund"?',
    options: ['Friend', 'Enemy', 'Neighbor', 'Colleague'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'w3',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Words - Travel (w4)
  {
    id: 'w10',
    questionId: 'w10',
    questionText: 'What is the English translation of "Reise"?',
    options: ['Stay', 'Travel', 'Visit', 'Return'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w4',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w11',
    questionId: 'w11',
    questionText: 'What is the English translation of "Flughafen"?',
    options: ['Train Station', 'Bus Stop', 'Airport', 'Harbor'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'w4',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w12',
    questionId: 'w12',
    questionText: 'What is the English translation of "Zug"?',
    options: ['Bus', 'Car', 'Train', 'Plane'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'w4',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Words - Basics (w5)
  {
    id: 'w13',
    questionId: 'w13',
    questionText: 'What is the English translation of "Hallo"?',
    options: ['Goodbye', 'Hello', 'Thank you', 'Please'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'w5',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w14',
    questionId: 'w14',
    questionText: 'What is the English translation of "Danke"?',
    options: ['Goodbye', 'Hello', 'Thank you', 'Please'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'w5',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w15',
    questionId: 'w15',
    questionText: 'What is the English translation of "Bitte"?',
    options: ['Goodbye', 'Hello', 'Thank you', 'Please'],
    correctAnswerId: '3',
    points: 10,
    topicId: 'w5',
    categoryId: 'vocabulary',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Reading Questions
  {
    id: 'rq1',
    questionId: 'rq1',
    questionText: 'Lisa kauft Käse im Supermarkt.',
    options: ['True', 'False'],
    correctAnswerId: '1',
    points: 5,
    topicId: 'r1',
    categoryId: 'reading',
    readingTextId: 'r1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rq2',
    questionId: 'rq2',
    questionText: 'Lisa kauft Brot und Milch.',
    options: ['True', 'False'],
    correctAnswerId: '0',
    points: 5,
    topicId: 'r1',
    categoryId: 'reading',
    readingTextId: 'r1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rq3',
    questionId: 'rq3',
    questionText: 'Anna wohnt in München.',
    options: ['True', 'False'],
    correctAnswerId: '1',
    points: 5,
    topicId: 'r2',
    categoryId: 'reading',
    readingTextId: 'r2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'rq4',
    questionId: 'rq4',
    questionText: 'Anna geht nach der Arbeit spazieren.',
    options: ['True', 'False'],
    correctAnswerId: '0',
    points: 5,
    topicId: 'r2',
    categoryId: 'reading',
    readingTextId: 'r2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const QUESTIONS_PER_QUIZ = 10;

export function getQuestionsByTopic(topicId: string): Question[] {
  const questions = mockQuestions.filter(q => q.topicId === topicId);
  console.log(`Found ${questions.length} questions for topic ${topicId}:`, questions);
  return questions;
}

export function getRandomQuestions(topicId: string): Question[] {
  console.log('Getting questions for topic:', topicId);
  
  // For reading topics, we need to group questions by textId
  if (topicId.startsWith('r')) {
    const topicQuestions = getQuestionsByTopic(topicId);
    const textId = topicQuestions[0]?.readingTextId;
    if (!textId) return [];

    // Get all questions for this text
    const readingQuestions = topicQuestions.filter(q => q.readingTextId === textId);
    return readingQuestions;
  }

  // For audio topics, return all questions
  if (topicId.startsWith('l')) {
    const audioQuestions = getQuestionsByTopic(topicId);
    console.log('Found audio questions:', audioQuestions);
    return audioQuestions;
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
