import { API_URL } from '../config';
import { Question, Topic } from '../types';
import { createAsyncThunk } from '@reduxjs/toolkit';

interface QuizResponse {
  questions: Question[];
  nextCursor?: string;
  hasMore: boolean;
}

interface Category {
  categoryId: string;
  title: string;
  description: string;
  progress: number;
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Request failed');
  }
  return response.json();
};

export const fetchCategories = async (token?: string): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchQuestions = async (topicId: string, cursor?: string, token?: string): Promise<QuizResponse> => {
  try {
    const response = await fetch(`${API_URL}/questions?topicId=${topicId}${cursor ? `&cursor=${cursor}` : ''}`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const fetchTopics = async (token?: string): Promise<Topic[]> => {
  try {
    console.log('Fetching topics from:', `${API_URL}/topics`);
    console.log('Using token:', token ? 'Yes' : 'No');
    
    const response = await fetch(`${API_URL}/topics`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });
    console.log('Topics response status:', response.status);
    console.log('Topics response headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Topics response error:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Topics data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

export const fetchReadingTexts = async (topicId?: string, token?: string): Promise<any[]> => {
  try {
    const url = topicId 
      ? `${API_URL}/reading-texts?topicId=${topicId}`
      : `${API_URL}/reading-texts`;
      
    const response = await fetch(url, {
      headers: token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : {}
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching reading texts:', error);
    throw error;
  }
};

export const fetchCategoriesThunk = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await fetchCategories();
  return response;
});

export const fetchInitialData = async (token?: string): Promise<{
  categories: Category[];
  topics: Topic[];
  questions: Record<string, Question[]>;
}> => {
  try {
    console.log('Fetching initial data...');
    
    // Fetch categories, topics, and questions in parallel
    const [categories, topics] = await Promise.all([
      fetchCategories(token),
      fetchTopics(token)
    ]);

    // For now, we'll fetch questions for each topic (this can be optimized later)
    const questions: Record<string, Question[]> = {};
    
    for (const topic of topics) {
      try {
        const response = await fetchQuestions(topic.topicId, undefined, token);
        questions[topic.topicId] = response.questions;
      } catch (error) {
        console.warn(`Failed to fetch questions for topic ${topic.topicId}:`, error);
        questions[topic.topicId] = [];
      }
    }

    console.log('Initial data fetched successfully:', {
      categoriesCount: categories.length,
      topicsCount: topics.length,
      questionsCount: Object.keys(questions).length
    });

    return { categories, topics, questions };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    throw error;
  }
};
