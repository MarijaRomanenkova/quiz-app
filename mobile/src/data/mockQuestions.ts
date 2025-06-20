import { Question } from '../types';
import { mockTexts } from './mockTexts';

// Separate type for mock questions that includes id field
interface MockQuestion extends Omit<Question, 'id'> {
  id: string; // Mock questions need id for TypeScript compatibility
}

const mockQuestions: MockQuestion[] = [
  // Grammar - Articles
  {
    id: 'g1',
    questionId: 'g1',
    questionText: 'Which article is correct? "___ Buch ist neu."',
    options: ['Der', 'Die', 'Das', 'Den'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'articles',
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
    topicId: 'articles',
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
    topicId: 'articles',
    categoryId: 'grammar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Grammar - Present Tense
  {
    id: 'g4',
    questionId: 'g4',
    questionText: 'What is the correct form? "Ich ___ Deutsch."',
    options: ['lerne', 'lernst', 'lernt', 'lernen'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'present-tense',
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
    topicId: 'present-tense',
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
    topicId: 'present-tense',
    categoryId: 'grammar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Grammar - Past Tense
  {
    id: 'g7',
    questionId: 'g7',
    questionText: 'What is the correct past tense? "Ich ___ gestern."',
    options: ['gehe', 'ging', 'gegangen', 'geht'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'past-tense',
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
    topicId: 'past-tense',
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
    topicId: 'past-tense',
    categoryId: 'grammar',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Words - Fruit & Veggies
  {
    id: 'w1',
    questionId: 'w1',
    questionText: 'What is the English translation of "Apfel"?',
    options: ['Pear', 'Apple', 'Orange', 'Banana'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'fruit-veggies',
    categoryId: 'words',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w2',
    questionId: 'w2',
    questionText: 'What is this?',
    imageUrl: 'https://res.cloudinary.com/djgtzqgut/image/upload/v1738692039/tomato-simple_dbgb9b.jpg',
    options: ['Apple', 'Clemintine', 'Tomato', 'Carrot'],
    correctAnswerId: '2',
    points: 10,
    topicId: 'fruit-veggies',
    categoryId: 'words',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'w3',
    questionId: 'w3',
    questionText: 'What is the English translation of "Karotte"?',
    options: ['Potato', 'Carrot', 'Cucumber', 'Pepper'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'fruit-veggies',
    categoryId: 'words',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Words - Fashion
  {
    id: 'w4',
    questionId: 'w4',
    questionText: 'What is the English translation of "Kleid"?',
    options: ['Shirt', 'Dress', 'Pants', 'Shoes'],
    correctAnswerId: '1',
    points: 10,
    topicId: 'fashion',
    categoryId: 'words',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Reading - Short Stories
  {
    id: 'rq1',
    questionId: 'rq1',
    questionText: 'Lisa kauft Käse im Supermarkt.',
    options: ['True', 'False'],
    correctAnswerId: '1',
    points: 5,
    topicId: 'short-stories',
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
    topicId: 'short-stories',
    categoryId: 'reading',
    readingTextId: 'r1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Reading - News Articles
  {
    id: 'rq3',
    questionId: 'rq3',
    questionText: 'Anna wohnt in München.',
    options: ['True', 'False'],
    correctAnswerId: '1',
    points: 5,
    topicId: 'news-articles',
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
    topicId: 'news-articles',
    categoryId: 'reading',
    readingTextId: 'r2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },

  // Listening - Basic Listening
  {
    id: 'l1',
    questionId: 'l1',
    questionText: 'Was kauft Lisa?',
    audioUrl: 'https://res.cloudinary.com/djgtzqgut/video/upload/v1738913375/shopping_b5h2ax.mp3',
    options: ['Lisa kauft Käse', 'Lisa kauft Milch', 'Lisa kauft Brot', 'Lisa kauft Eier'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'basic-listening',
    categoryId: 'listening',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'l2',
    questionId: 'l2',
    questionText: 'Was sucht der Mann?',
    audioUrl: 'https://res.cloudinary.com/djgtzqgut/video/upload/v1738913375/askdirection_hd0yg8.mp3',
    options: ['Der Mann sucht nach Bibliothek', 'Man ist 42', 'Die Frau sucht nach Apotheke', 'Die Frau ist 23'],
    correctAnswerId: '0',
    points: 10,
    topicId: 'basic-listening',
    categoryId: 'listening',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const QUESTIONS_PER_QUIZ = 10;

export function getQuestionsByTopic(topicId: string): Question[] {
  const questions = mockQuestions.filter(q => q.topicId === topicId);
  console.log(`Found ${questions.length} questions for topic ${topicId}:`, questions);
  // Convert MockQuestion to Question by omitting the id field
  return questions.map(({ id, ...question }) => question as Question);
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
