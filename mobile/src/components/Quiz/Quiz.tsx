/**
 * @fileoverview Main Quiz component for the mobile application
 * 
 * This component provides the core quiz functionality, handling question display,
 * answer selection, progress tracking, and navigation. It manages the complete
 * quiz lifecycle from start to finish, including reading text display for
 * comprehension questions and audio playback for audio questions.
 * 
 * The component integrates with Redux for state management, handles both regular
 * and reading comprehension questions, tracks user progress, and manages quiz
 * statistics. It supports both normal quiz mode and repeat mode for wrong questions.
 * 
 * @module components/Quiz
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { theme, spacing, layout } from '../../theme';
import { createTextStyles, createShadowStyles, createColorStyles } from '../../utils/themeUtils';
import type { Question } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { 
  updateDailyStats,
  startQuiz,
  selectAnswer,
  nextQuestion,
  updateScore,
  endQuiz,
  selectActiveQuiz
} from '../../store/quizSlice';
import { selectQuestionsForTopic, selectReadingTextById } from '../../store/questionsSlice';
import { store } from '../../store';
import { Button as CustomButton } from '../../components/Button/Button';
import { 
  addWrongQuestion, 
  selectWrongQuestions, 
  setQuizResult 
} from '../../store/quizSlice';
import { completeTopic, updateTopicAttempt, loadMoreQuestionsThunk } from '../../store/progressSlice';
import { startQuizSession, endQuizSession } from '../../store/statisticsSlice';
import { AudioPlayer } from '../AudioPlayer/AudioPlayer';
import { AudioPlayerRef } from '../../types/components.types';
import { QuizRadioGroup } from './QuizRadioGroup';
import { ReadingText } from './ReadingText';
import { QuizTopBar } from './QuizTopBar';
import { useToken } from '../../hooks/useToken';
import { fetchAllQuestionsThunk } from '../../store/questionsSlice';
import type { ReadingText as ReadingTextType } from '../../types';

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Props interface for the Quiz component
 * 
 * @interface QuizProps
 * @property {string} quizId - The unique identifier for the quiz/topic
 * @property {boolean} [isRepeating=false] - Whether this is a repeat quiz for wrong questions
 */
type QuizProps = {
  quizId: string;
  isRepeating?: boolean;
};

/**
 * Main Quiz component that handles the complete quiz experience
 * 
 * Manages the quiz lifecycle including question loading, answer selection,
 * progress tracking, and result calculation. The component supports both
 * regular questions and reading comprehension questions with audio support.
 * 
 * Key features:
 * - Displays questions with images, text, and audio
 * - Handles reading text display for comprehension questions
 * - Tracks user progress and statistics
 * - Manages quiz state through Redux
 * - Supports repeat mode for wrong questions
 * - Integrates with progress tracking and topic completion
 * 
 * @param {QuizProps} props - The quiz props
 * @param {string} props.quizId - The unique identifier for the quiz/topic
 * @returns {JSX.Element} The complete quiz interface with questions and navigation
 * 
 * @example
 * ```tsx
 * <Quiz quizId="topic-123" />
 * ```
 * 
 * @example
 * ```tsx
 * <Quiz quizId="topic-456" isRepeating={true} />
 * ```
 */
const Quiz: React.FC<QuizProps> = ({ quizId: propQuizId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<QuizScreenRouteProp>();
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const quizId = propQuizId || route.params?.quizId;
  const wrongQuestions = useSelector(selectWrongQuestions);
  const activeQuiz = useSelector(selectActiveQuiz);
  const questions = useSelector((state: RootState) => selectQuestionsForTopic(state, quizId));
  const questionsState = useSelector((state: RootState) => state.questions);
  const startTime = useRef(Date.now());
  const audioQuestionRef = useRef<AudioPlayerRef>(null);
  const { token } = useToken();
  const user = useSelector((state: RootState) => state.auth.user);
  const [readingText, setReadingTextState] = React.useState<ReadingTextType | null>(null);
  const [hasShownReadingText, setHasShownReadingText] = useState(false);

  // Get categoryId from route params
  const categoryId = route.params?.categoryId;

  const handleReadingText = (questions: Question[]) => {
    if (!activeQuiz) {
      return;
    }
    
    // Get the reading text ID from the first question that has one
    const questionWithReadingText = questions.find(q => q.readingTextId);
    if (!questionWithReadingText?.readingTextId) {
      return;
    }
    
    // Get the reading text by its ID
    const readingText = selectReadingTextById(store.getState(), questionWithReadingText.readingTextId);
    
    if (readingText) {
      setReadingTextState(readingText);
    }
  };

  const loadQuestions = async () => {
    try {
      if (route.params?.isRepeating && wrongQuestions?.length) {
        handleReadingText(wrongQuestions);
        return;
      }

      // Use questions from Redux (loaded in bulk during app initialization)
      if (questions.length > 0) {
        // For reading categories, check if reading texts are loaded
        if (categoryId === 'reading') {
          // Check if reading texts are loaded in Redux
          const state = store.getState();
          const readingTextsLoaded = Object.keys(state.questions.readingTextsById).length > 0;
          
          if (!readingTextsLoaded) {
            // Wait a bit and try again
            setTimeout(() => {
              loadQuestions();
            }, 1000);
            return;
          }
        }
        return;
      }

      // If no questions found, this might be an error in the data loading strategy
      console.error('No questions found for topic:', quizId);
    } catch (error) {
      console.error('Failed to load questions:', error);
    }
  };

  useEffect(() => {
    if (!quizId) return;
    
    dispatch(startQuiz());
    // Start the quiz session timer
    dispatch(startQuizSession());
    // Reset reading text state for new quiz
    setReadingTextState(null);
    setHasShownReadingText(false);
    loadQuestions();

    return () => {
      dispatch(endQuiz());
      // End the quiz session timer when component unmounts
      // Only end session if it's still active
      const currentState = store.getState();
      if (currentState.statistics.currentSessionStart) {
        dispatch(endQuizSession());
      }
    };
  }, [quizId]);

  // Handle reading text after activeQuiz is available
  useEffect(() => {
    if (activeQuiz && questions.length > 0 && categoryId === 'reading' && !readingText && !hasShownReadingText) {
      handleReadingText(questions);
      setHasShownReadingText(true);
    }
  }, [activeQuiz, questions, categoryId, readingText, hasShownReadingText]);

  const handleAnswer = (selectedIndex: number) => {
    if (!activeQuiz || activeQuiz.selectedAnswer !== null) return;
    
    if (audioQuestionRef.current) {
      audioQuestionRef.current.stop();
    }
    
    const currentQuestion = questions[activeQuiz.currentQuestion];
    const isCorrect = currentQuestion?.correctAnswerId === selectedIndex.toString();
    
    dispatch(selectAnswer(selectedIndex));
    if (isCorrect && activeQuiz) {
      dispatch(updateScore(activeQuiz.score + 1));
    } else if (currentQuestion) {
      dispatch(addWrongQuestion(currentQuestion));
    }
  };

  const handleNext = () => {
    if (!activeQuiz) return;
    
    dispatch(selectAnswer(null));
    
    if (readingText) {
      setReadingTextState(null);
      return;
    }
    
    if (activeQuiz.currentQuestion < questions.length - 1) {
      dispatch(nextQuestion());
    } else {
      const timeSpent = (Date.now() - startTime.current) / 1000;
      const finalScore = activeQuiz.score;
      const totalQuestions = questions.length;
      const scorePercentage = Math.round((finalScore / totalQuestions) * 100);
      
      dispatch(updateDailyStats({
        timeSpent,
        questionsAnswered: questions.length
      }));

      dispatch(setQuizResult({
        score: finalScore,
        totalQuestions: questions.length,
        timeSpent
      }));

      // Track progress - mark as completed if score is 70% or higher
      if (categoryId) {
        if (scorePercentage >= 70) {
          dispatch(completeTopic({
            topicId: quizId,
            categoryId,
            score: scorePercentage
          }));
        } else {
          dispatch(updateTopicAttempt({
            topicId: quizId,
            categoryId,
            score: scorePercentage
          }));
        }
        
        // Check if we should unlock more topics for this category
        dispatch(loadMoreQuestionsThunk(categoryId));
      }

      // End the quiz session timer before navigating to results
      // Only end session if it's still active (not already ended by cleanup)
      const currentState = store.getState();
      if (currentState.statistics.currentSessionStart) {
        dispatch(endQuizSession());
      }
      navigation.navigate('Results', { quizId });
    }
  };



  // Graceful handling for no questions
  useEffect(() => {
    if (questions.length === 0) {
      // Show a message and redirect after a short delay
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    }
  }, [questions.length, navigation]);

  // Check if fetchAllQuestionsThunk should be called
  useEffect(() => {
    if (user && token && questions.length === 0) {
      dispatch(fetchAllQuestionsThunk()).unwrap()
        .then(() => {
          // Questions loaded successfully
        })
        .catch((error) => {
          console.error('Quiz - fetchAllQuestionsThunk failed:', error);
        });
    }
  }, [user, token, questions.length, dispatch]);



  // Early returns after all hooks have been called
  if (!activeQuiz) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Initializing quiz...</Text>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No questions available for this topic. Redirecting...</Text>
      </View>
    );
  }

  // Check if reading texts are needed and loaded
  const needsReadingTexts = questions[0]?.readingTextId;
  const readingTextsLoaded = Object.keys(questionsState.readingTextsById).length > 0;
  
  if (needsReadingTexts && !readingTextsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Loading reading materials...</Text>
      </View>
    );
  }

  const question = questions[activeQuiz.currentQuestion];

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <QuizTopBar 
          currentQuestion={activeQuiz.currentQuestion}
          totalQuestions={questions.length}
          showReadingText={!!readingText}
        />

        <View style={styles.contentContainer}>
          {!readingText ? (
            <>
              <View style={styles.topHalf}>
                <Surface style={styles.questionCard}>
                  <View style={styles.questionContent}>
                    {question.imageUrl && (
                      <Image 
                        source={{ uri: question.imageUrl }} 
                        style={styles.questionImage}
                      />
                    )}
                    {!question.imageUrl && (
                      <Text style={styles.questionText}>
                        {question.questionText}
                      </Text>
                    )}
                  </View>
                  {question.audioUrl && (
                    <View style={styles.audioPlayerContainer}>
                      <AudioPlayer
                        ref={audioQuestionRef}
                        audioUrl={question.audioUrl}
                      />
                    </View>
                  )}
                </Surface>
              </View>

              <View style={styles.bottomHalf}>
                <View style={styles.optionsContainer}>
                  <QuizRadioGroup
                    options={question.options}
                    selectedAnswer={activeQuiz.selectedAnswer}
                    correctAnswerId={question.correctAnswerId}
                    onAnswer={handleAnswer}
                  />
                </View>
              </View>
            </>
          ) : readingText && (
            <ReadingText text={{ title: readingText.title, text: readingText.textContent }} />
          )}

          <CustomButton 
            variant="primary"
            onPress={handleNext}
            style={styles.nextButton}
            disabled={activeQuiz.selectedAnswer === null && !readingText}
          >
            {readingText ? 'Continue' : 
              activeQuiz.currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

// Create utility styles
const textStyles = createTextStyles('xlarge', 'semiBold', theme.colors.onSurface);
const shadowStyles = createShadowStyles('large');
const colorStyles = createColorStyles('surface');

const styles = StyleSheet.create({
  audioPlayerContainer: {
    height: 100,
    left: '50%',
    position: 'absolute',
    top: '-20%',
    transform: [{ translateX: -50 }],
    width: 100,
    zIndex: 1,
  },
  bottomHalf: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.secondaryContainer,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.md,
  },
  loadingContainer: {
    ...colorStyles.backgroundColor,
    alignItems: 'center',
    borderRadius: layout.borderRadius.large,
    flex: 1,
    justifyContent: 'center',
    padding: spacing.md,
    ...shadowStyles.shadow,
  },
  mainContainer: {
    flex: 1,
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  nextButton: {
    marginTop: spacing.md,
  },
  optionsContainer: {
    flex: 1,
  },
  questionCard: {
    ...colorStyles.backgroundColor,
    borderRadius: layout.borderRadius.large,
    flex: 1,
    marginVertical: spacing.xl,
    padding: spacing.md,
    position: 'relative',
    ...shadowStyles.shadow,
    width: '100%',
  },
  questionContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  questionImage: {
    height: '100%',
    resizeMode: 'contain',
    width: '100%',
  },
  questionText: {
    ...textStyles.text,
    paddingHorizontal: spacing.md,
    textAlign: 'center',
  },
  topHalf: {
    alignItems: 'center',
    flex: 1,
    marginBottom: spacing.md,
  },
});

export default Quiz; 
