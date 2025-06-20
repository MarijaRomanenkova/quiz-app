import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import type { Question } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { 
  updateDailyStats,
  updateBestAttempt,
  startQuiz,
  selectAnswer,
  nextQuestion,
  updateScore,
  setReadingText,
  endQuiz,
  selectActiveQuiz
} from '../../store/quizSlice';
import { selectQuestionsForTopic } from '../../store/questionsSlice';
import { selectReadingTextById } from '../../store/readingTextsSlice';
import { store } from '../../store';
import { Button as CustomButton } from '../../components/Button/Button';
import { setQuizResult } from '../../store/quizResultsSlice';
import { addWrongQuestion as addToWrongQuestions, selectWrongQuestions } from '../../store/wrongQuestionsSlice';
import { completeTopic, updateTopicAttempt, loadMoreQuestionsThunk } from '../../store/progressSlice';
import { AudioPlayer, AudioPlayerRef } from '../AudioPlayer/AudioPlayer';
import { QuizRadioGroup } from './QuizRadioGroup';
import { ReadingText } from './ReadingText';
import { QuizTopBar } from './QuizTopBar';
import { useToken } from '../../hooks/useToken';

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type QuizProps = {
  quizId: string;
  isRepeating?: boolean;
};

const Quiz: React.FC<QuizProps> = ({ quizId: propQuizId, isRepeating = false }) => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<QuizScreenRouteProp>();
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const quizId = propQuizId || route.params?.quizId;
  const wrongQuestions = useSelector(selectWrongQuestions);
  const activeQuiz = useSelector(selectActiveQuiz);
  const questions = useSelector((state: RootState) => selectQuestionsForTopic(state, quizId));
  const questionsState = useSelector((state: RootState) => state.questions);
  const readingTextsState = useSelector((state: RootState) => state.readingTexts);
  const startTime = useRef(Date.now());
  const audioQuestionRef = useRef<AudioPlayerRef>(null);
  const { token } = useToken();

  console.log('Quiz - quizId:', quizId);
  console.log('Quiz - questions from Redux:', questions.length);
  console.log('Quiz - questions state:', questionsState);
  console.log('Quiz - all questions by topic:', questionsState.byTopicId);

  const handleReadingText = (questions: Question[]) => {
    const currentQuestion = questions[activeQuiz?.currentQuestion ?? 0];
    if (currentQuestion?.readingTextId) {
      // For reading questions, show the reading text first
      dispatch(setReadingText({
        textId: currentQuestion.readingTextId,
        show: true
      }));
    }
  };

  const loadQuestions = async () => {
    try {
      if (route.params?.isRepeating && wrongQuestions?.length) {
        console.log('Quiz - Using wrong questions for repeat mode');
        handleReadingText(wrongQuestions);
        return;
      }

      // Use questions from Redux (loaded in bulk during app initialization)
      if (questions.length > 0) {
        console.log('Quiz - Using questions from Redux');
        // Check if this is a reading topic by looking at the first question
        if (questions[0]?.readingTextId) {
          console.log('Quiz - This is a reading topic, showing reading text first');
          // Check if reading texts are loaded in Redux
          const state = store.getState();
          const readingTextsLoaded = Object.keys(state.readingTexts.byId).length > 0;
          console.log('Quiz - Reading texts loaded in Redux:', readingTextsLoaded);
          console.log('Quiz - Available reading text IDs:', Object.keys(state.readingTexts.byId));
          
          if (!readingTextsLoaded) {
            console.warn('Quiz - Reading texts not loaded yet, waiting...');
            // Wait a bit and try again
            setTimeout(() => {
              loadQuestions();
            }, 1000);
            return;
          }
          
          handleReadingText(questions);
        }
        return;
      }

      // If no questions found, this might be an error in the data loading strategy
      console.error('No questions found for topic:', quizId);
      console.error('This should not happen if the data loading strategy is working correctly');
    } catch (error) {
      console.error('Failed to load questions:', error);
    }
  };

  useEffect(() => {
    if (!quizId) return;
    
    dispatch(startQuiz());
    loadQuestions();

    return () => {
      dispatch(endQuiz());
    };
  }, [quizId]);

  const handleAnswer = (selectedIndex: number) => {
    if (activeQuiz?.selectedAnswer !== null) return;
    
    if (audioQuestionRef.current) {
      audioQuestionRef.current.stop();
    }
    
    const currentQuestion = questions[activeQuiz?.currentQuestion ?? 0];
    const isCorrect = currentQuestion?.correctAnswerId === selectedIndex.toString();
    
    dispatch(selectAnswer(selectedIndex));
    if (isCorrect && activeQuiz) {
      dispatch(updateScore(activeQuiz.score + 1));
    } else if (currentQuestion) {
      dispatch(addToWrongQuestions(currentQuestion));
    }
  };

  const handleNext = () => {
    dispatch(selectAnswer(null));
    
    if (activeQuiz?.showReadingText) {
      dispatch(setReadingText({ textId: activeQuiz.currentTextId ?? '', show: false }));
      return;
    }
    
    if ((activeQuiz?.currentQuestion ?? 0) < questions.length - 1) {
      dispatch(nextQuestion());
    } else {
      const timeSpent = (Date.now() - startTime.current) / 1000;
      const finalScore = activeQuiz?.score ?? 0;
      const totalQuestions = questions.length;
      const scorePercentage = Math.round((finalScore / totalQuestions) * 100);
      
      // Get the category ID from the first question
      const categoryId = questions[0]?.categoryId;
      
      dispatch(updateDailyStats({
        timeSpent,
        questionsAnswered: questions.length
      }));

      dispatch(updateBestAttempt({
        topicId: quizId,
        score: finalScore,
        timeSpent
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

      navigation.navigate('Results', { quizId });
    }
  };

  const question = questions[activeQuiz?.currentQuestion ?? 0];
  const [readingText, setReadingTextState] = React.useState<any>(null);

  // Get reading text from Redux when needed
  React.useEffect(() => {
    if (activeQuiz?.showReadingText && activeQuiz?.currentTextId) {
      // Get the current question to find the reading text ID
      const currentQuestion = questions[activeQuiz?.currentQuestion ?? 0];
      if (currentQuestion?.readingTextId) {
        console.log('Looking for reading text with ID:', currentQuestion.readingTextId);
        // Use Redux selector to get reading text by ID
        const state = store.getState();
        console.log('Current Redux state readingTexts:', state.readingTexts);
        console.log('Reading texts by ID:', state.readingTexts.byId);
        console.log('Reading texts by topic:', state.readingTexts.byTopicId);
        const text = selectReadingTextById(state, currentQuestion.readingTextId);
        if (text) {
          console.log('Found reading text from Redux:', text.title);
          setReadingTextState(text);
        } else {
          console.warn('No reading text found in Redux for ID:', currentQuestion.readingTextId);
          console.warn('Available reading text IDs:', Object.keys(state.readingTexts.byId));
        }
      }
    }
  }, [activeQuiz?.showReadingText, activeQuiz?.currentTextId, questions]);

  if (!activeQuiz || questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Loading quiz...</Text>
      </View>
    );
  }

  // Check if reading texts are needed and loaded
  const needsReadingTexts = questions[0]?.readingTextId;
  const readingTextsLoaded = Object.keys(readingTextsState.byId).length > 0;
  
  if (needsReadingTexts && !readingTextsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Loading reading materials...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <QuizTopBar 
          currentQuestion={activeQuiz.currentQuestion}
          totalQuestions={questions.length}
          showReadingText={activeQuiz.showReadingText}
        />

        <View style={styles.contentContainer}>
          {!activeQuiz.showReadingText ? (
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
            disabled={activeQuiz.selectedAnswer === null && !activeQuiz.showReadingText}
          >
            {activeQuiz.showReadingText ? 'Continue' : 
              activeQuiz.currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryContainer,
  },
  mainContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  topHalf: {
    flex: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  bottomHalf: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  questionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginVertical: 42,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 50,
    elevation: 8,
    position: 'relative',
    width: '100%',
  },
  questionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  nextButton: {
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 50,
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  questionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  audioPlayerContainer: {
    position: 'absolute',
    top: '-20%',
    left: '50%',
    transform: [{ translateX: -50 }],
    zIndex: 1,
    width: 100,
    height: 100,
  },
});

export default Quiz; 
