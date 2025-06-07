import { Question } from '../types';
import { mockQuestions } from '../data/mockQuestions';

/**
 * Quiz service to handle question fetching
 */
export class QuizService {
  private static BATCH_SIZE = 5;
  private currentIndex = 0;

  /**
   * Simulates fetching questions from an API
   * @returns Promise<Question[]>
   */
  async fetchQuestions(): Promise<Question[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const batch = mockQuestions.slice(
      this.currentIndex,
      this.currentIndex + QuizService.BATCH_SIZE
    );
    
    this.currentIndex += QuizService.BATCH_SIZE;
    
    // Reset index if we've used all questions
    if (this.currentIndex >= mockQuestions.length) {
      this.currentIndex = 0;
    }

    return batch;
  }

  /**
   * Check if more questions are available
   */
  hasMoreQuestions(): boolean {
    return this.currentIndex < mockQuestions.length;
  }

  /**
   * Reset the question index
   */
  reset(): void {
    this.currentIndex = 0;
  }
}

export const quizService = new QuizService(); 
