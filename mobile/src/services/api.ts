import { API_URL } from '../config';
import { Question, QuizTopic } from '../types';
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

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchQuestions = async (topicId: string, cursor?: string): Promise<QuizResponse> => {
  try {
    const response = await fetch(`${API_URL}/questions?topicId=${topicId}${cursor ? `&cursor=${cursor}` : ''}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

export const fetchTopics = async (): Promise<QuizTopic[]> => {
  try {
    const response = await fetch(`${API_URL}/topics`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

export const fetchReadingTexts = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/reading-texts`);
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
