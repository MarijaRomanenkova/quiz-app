import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import type { Question } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
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
import { cacheQuestions, selectCurrentChunk } from '../../store/questionsSlice';
import { getRandomQuestions } from '../../data/mockQuestions';
import { Button as CustomButton } from '../../components/Button/Button';
import { setQuizResult } from '../../store/quizResultsSlice';
import { addWrongQuestion as addToWrongQuestions, selectWrongQuestions } from '../../store/wrongQuestionsSlice';
import { AudioPlayer, AudioPlayerRef } from '../AudioPlayer/AudioPlayer';
import { mockTexts } from '../../data/mockTexts';
import { QuizRadioGroup } from './QuizRadioGroup';
import { ReadingText } from './ReadingText';
import { QuizTopBar } from './QuizTopBar';

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type QuizProps = {
  quizId: string;
  isRepeating?: boolean;
};

const Quiz: React.FC<QuizProps> = ({ quizId: propQuizId, isRepeating = false }) => {
  const dispatch = useDispatch();
  const route = useRoute<QuizScreenRouteProp>();
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const quizId = propQuizId || route.params?.quizId;
  const wrongQuestions = useSelector(selectWrongQuestions);
  const activeQuiz = useSelector(selectActiveQuiz);
  const questions = useSelector((state: RootState) => selectCurrentChunk(state, quizId)) ?? [];
  const startTime = useRef(Date.now());
  const audioQuestionRef = useRef<AudioPlayerRef>(null);

  const handleReadingText = (questions: Question[]) => {
    const currentQuestion = questions[activeQuiz?.currentQuestion ?? 0];
    if (currentQuestion?.readingTextId) {
      dispatch(setReadingText({
        textId: currentQuestion.readingTextId,
        show: true
      }));
    }
  };

  const loadQuestions = async () => {
    try {
      if (route.params?.isRepeating && wrongQuestions?.length) {
        dispatch(cacheQuestions({ topicId: quizId, questions: wrongQuestions }));
        handleReadingText(wrongQuestions);
        return;
      }

      const questions = getRandomQuestions(quizId);
      if (!questions.length) {
        console.error('No questions found for topic:', quizId);
        return;
      }

      if (questions[0]?.categoryId === 'reading') {
        handleReadingText(questions);
      }

      dispatch(cacheQuestions({ topicId: quizId, questions }));
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
      
      dispatch(updateDailyStats({
        timeSpent,
        questionsAnswered: questions.length
      }));

      dispatch(updateBestAttempt({
        topicId: quizId,
        score: activeQuiz?.score ?? 0,
        timeSpent
      }));

      dispatch(setQuizResult({
        score: activeQuiz?.score ?? 0,
        totalQuestions: questions.length,
        timeSpent
      }));

      navigation.navigate('Results', { quizId });
    }
  };

  const question = questions[activeQuiz?.currentQuestion ?? 0];
  const readingText = activeQuiz?.showReadingText && activeQuiz?.currentTextId 
    ? mockTexts.find(t => t.topicId === activeQuiz.currentTextId) 
    : null;

  if (!activeQuiz || questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
