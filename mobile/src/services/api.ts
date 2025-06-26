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

export const fetchUserProfile = async (token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (token: string, profileData: {
  studyPaceId?: number;
  marketingEmails?: boolean;
  shareDevices?: boolean;
  pushNotifications?: boolean;
}): Promise<any> => {
  try {
    console.log('API: updateUserProfile called with:', { token: token ? 'present' : 'missing', profileData });
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    console.log('API: updateUserProfile response status:', response.status);
    const result = await handleResponse(response);
    console.log('API: updateUserProfile result:', result);
    return result;
  } catch (error) {
    console.error('API: Error updating user profile:', error);
    throw error;
  }
};

export const deleteUserAccount = async (token: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/auth/account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
};

// Quiz time sync functions
export const syncQuizTimeData = async (token: string, quizTimeData: {
  dailyQuizTimes: Array<{
    date: string;
    minutes: number;
    lastUpdated: string;
  }>;
  totalQuizMinutes: number;
}): Promise<any> => {
  try {
    console.log('API: Syncing quiz time data:', quizTimeData);
    const response = await fetch(`${API_URL}/statistics/quiz-time`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quizTimeData)
    });
    console.log('API: Quiz time sync response status:', response.status);
    const result = await handleResponse(response);
    console.log('API: Quiz time sync result:', result);
    return result;
  } catch (error) {
    console.error('API: Error syncing quiz time data:', error);
    throw error;
  }
};

export const fetchQuizTimeData = async (token: string): Promise<{
  dailyQuizTimes: Array<{
    date: string;
    minutes: number;
    lastUpdated: string;
  }>;
  totalQuizMinutes: number;
}> => {
  try {
    console.log('API: Fetching quiz time data');
    const response = await fetch(`${API_URL}/statistics/quiz-time`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('API: Fetch quiz time response status:', response.status);
    const result = await handleResponse(response);
    console.log('API: Fetch quiz time result:', result);
    return result;
  } catch (error) {
    console.error('API: Error fetching quiz time data:', error);
    throw error;
  }
};
