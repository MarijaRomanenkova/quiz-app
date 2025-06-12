import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated, TouchableOpacity, Image, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Text, Button, Card, Surface, ProgressBar, Portal, Dialog, IconButton, RadioButton } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import type { Question, TrueFalseQuestion, TextQuestion, ImageQuestion, AudioQuestion } from '../../types';
import { fetchQuestions } from '../../services/api';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { 
  addWrongQuestion, 
  updateDailyStats,
  updateBestAttempt 
} from '../../store/quizSlice';
import { selectCurrentChunk, cacheQuestions } from '../../store/questionsSlice';
import { store } from '../../store';
import { Audio } from 'expo-av';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getRandomQuestions } from '../../data/mockQuestions';
import { Button as CustomButton } from '../../components/Button/Button';
import { setQuizResult } from '../../store/quizResultsSlice';
import { addWrongQuestion as addToWrongQuestions, clearWrongQuestions } from '../../store/wrongQuestionsSlice';
import { AudioPlayer, AudioPlayerRef } from '../AudioPlayer/AudioPlayer';
import { mockTexts } from '../../data/mockTexts';
import { TextQuestion as TextQuestionComponent, ImageQuestion as ImageQuestionComponent, AudioQuestion as AudioQuestionComponent } from '../Questions';

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type QuizProps = {
  quizId: string;
  isRepeating?: boolean;
};

/**
 * Quiz Component
 * Handles quiz logic, scoring, and feedback
 * @component
 */
const Quiz: React.FC<QuizProps> = ({ quizId: propQuizId, isRepeating = false }) => {
  const route = useRoute<QuizScreenRouteProp>();
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const quizId = propQuizId || route.params?.quizId;
  console.log('Quiz: Initial props and params:', { propQuizId, isRepeating, routeParams: route.params });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cursor, setCursor] = useState<string>();
  const [hasMore, setHasMore] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReadingQuestions, setShowReadingQuestions] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentReadingQuestion, setCurrentReadingQuestion] = useState(0);
  const [currentTextId, setCurrentTextId] = useState<string | null>(null);
  const [showReadingText, setShowReadingText] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const startTime = useRef(Date.now());
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
 

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      console.log('Loading questions for quizId:', quizId);
      
      if (route.params?.isRepeating) {
        const wrongQuestions = store.getState().wrongQuestions.wrongQuestions;
        if (wrongQuestions && wrongQuestions.length > 0) {
          // For reading questions, we need to show the text first
          const readingQuestions = wrongQuestions.filter(q => q.type === 'trueFalse' && q.topicId.startsWith('r'));
          if (readingQuestions.length > 0) {
            const textId = readingQuestions[0].textId;
            if (textId) {
              setCurrentTextId(textId);
              setShowReadingText(true);
            }
          }
          setQuestions(wrongQuestions);
          setIsLoading(false);
          return;
        }
      }
      
      const questions = getRandomQuestions(quizId);
      if (questions.length === 0) {
        console.error('No questions found for topic:', quizId);
        setIsLoading(false);
        return;
      }

      // For reading questions, show the text first
      if (quizId.startsWith('r')) {
        const textId = questions[0].textId;
        if (textId) {
          setCurrentTextId(textId);
          setShowReadingText(true);
        }
      }

      dispatch(cacheQuestions({ 
        topicId: quizId, 
        questions 
      }));
      setQuestions(questions);
      setHasMore(true);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Quiz mounted with quizId:', quizId);
    console.log('Route params:', route.params);
    console.log('Is repeating?', route.params?.isRepeating);
    console.log('Current Redux state:', store.getState());
    if (!quizId) {
      console.error('No quizId provided!');
      return;
    }
    // Reset state when entering review mode
    if (route.params?.isRepeating) {
      console.log('Entering review mode, resetting state');
      setCurrentQuestion(0);
      setScore(0);
    }
    loadQuestions();
  }, [quizId, route.params]);

  useEffect(() => {
    if (currentQuestion > questions.length - 5 && hasMore && !isLoading) {
      loadMoreQuestions();
    }
  }, [currentQuestion]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [currentQuestion]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const loadMoreQuestions = async () => {
    if (!cursor || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetchQuestions(quizId, cursor);
      setQuestions(prev => [...prev, ...response.questions]);
      setCursor(response.nextCursor);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Failed to load more questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (selectedIndex: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(selectedIndex);
    const question = questions[currentQuestion];
    
    let isCorrect = false;
    if (question.type === 'trueFalse') {
      const tfQuestion = question as TrueFalseQuestion;
      isCorrect = selectedIndex === 0 ? tfQuestion.correctAnswer : !tfQuestion.correctAnswer;
      if (isCorrect) {
        setScore(prev => prev + 1);
      } else {
        dispatch(addWrongQuestion(tfQuestion.questionId));
        dispatch(addToWrongQuestions(tfQuestion));
      }
    } else {
      const mcQuestion = question as TextQuestion | ImageQuestion | AudioQuestion;
      isCorrect = mcQuestion.correctAnswerId === selectedIndex.toString();
      if (isCorrect) {
        setScore(prev => prev + 1);
      } else {
        dispatch(addWrongQuestion(mcQuestion.questionId));
        dispatch(addToWrongQuestions(mcQuestion));
      }
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    
    if (showReadingText) {
      setShowReadingText(false);
      return;
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const timeSpent = (Date.now() - startTime.current) / 1000;
      
      dispatch(updateDailyStats({
        timeSpent,
        questionsAnswered: questions.length
      }));

      dispatch(updateBestAttempt({
        topicId: quizId,
        score,
        timeSpent
      }));

      dispatch(setQuizResult({
        score,
        totalQuestions: questions.length,
        timeSpent
      }));

      navigation.navigate('Results', { quizId });
    }
  };

  const playSound = async (audioUrl: string) => {
    // Unload previous sound if exists
    if (sound) {
      await sound.unloadAsync();
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      setSound(newSound);
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status && 'didJustFinish' in status && status.didJustFinish) {
          setIsPlaying(false);
        }
      });

      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  // Clear wrong questions when starting a new quiz (not in review mode)
  useEffect(() => {
    if (!route.params?.isRepeating) {
      dispatch(clearWrongQuestions());
    }
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= 
      contentSize.height - paddingToBottom;
    setIsScrolledToBottom(isCloseToBottom);
  };

  const renderQuestion = () => {
    if (showReadingText && currentTextId) {
      const text = mockTexts.find(t => t.topicId === currentTextId);
      if (!text) return null;

      return (
        <Surface style={[styles.questionCard, styles.fullScreenCard]}>
          <View style={styles.questionContent}>
            <Text variant="headlineSmall" style={styles.readingTitle}>
              {text.title}
            </Text>
            <Text variant="bodyLarge" style={styles.readingText}>
              {text.text}
            </Text>
          </View>
        </Surface>
      );
    }

    const question = questions[currentQuestion];
    
    switch (question.type) {
      case 'text':
        return (
          <View style={styles.optionsContainer}>
            <View style={styles.radioWrapper}>
              <RadioButton.Group 
                onValueChange={(value) => !selectedAnswer && handleAnswer(parseInt(value))} 
                value={selectedAnswer?.toString() || ''}
              >
                <View style={styles.radioContainer}>
                  {(question as TextQuestion).options.map((option: string, index: number) => (
                    <View key={index} style={[
                      styles.radioItem,
                      selectedAnswer === index && styles.selectedRadioItem,
                      selectedAnswer === index && 
                        (question as TextQuestion).correctAnswerId === index.toString()
                          ? styles.correctOption 
                          : selectedAnswer === index 
                            ? styles.incorrectOption 
                            : null
                    ]}>
                      <RadioButton.Item
                        label={option}
                        value={index.toString()}
                        position="trailing"
                        labelStyle={[
                          styles.radioLabel,
                          selectedAnswer === index && styles.selectedRadioLabel
                        ]}
                        style={styles.radioButton}
                        disabled={selectedAnswer !== null}
                        theme={{
                          colors: {
                            primary: selectedAnswer === index 
                              ? (question as TextQuestion).correctAnswerId === index.toString()
                                ? '#60BF92' 
                                : '#EC221F'
                              : '#583FB0',
                            onSurfaceDisabled: selectedAnswer === index 
                              ? (question as TextQuestion).correctAnswerId === index.toString()
                                ? '#60BF92' 
                                : '#EC221F'
                              : '#583FB0',
                          }
                        }}
                      />
                    </View>
                  ))}
                </View>
              </RadioButton.Group>
            </View>
          </View>
        );
      case 'image':
        return (
          <View style={styles.optionsContainer}>
            <Image 
              source={{ uri: (question as ImageQuestion).imageUrl }} 
              style={styles.questionImage}
            />
            <View style={styles.radioWrapper}>
              <RadioButton.Group 
                onValueChange={(value) => !selectedAnswer && handleAnswer(parseInt(value))} 
                value={selectedAnswer?.toString() || ''}
              >
                <View style={styles.radioContainer}>
                  {(question as ImageQuestion).options.map((option: string, index: number) => (
                    <View key={index} style={[
                      styles.radioItem,
                      selectedAnswer === index && styles.selectedRadioItem,
                      selectedAnswer === index && 
                        (question as ImageQuestion).correctAnswerId === index.toString()
                          ? styles.correctOption 
                          : selectedAnswer === index 
                            ? styles.incorrectOption 
                            : null
                    ]}>
                      <RadioButton.Item
                        label={option}
                        value={index.toString()}
                        position="trailing"
                        labelStyle={[
                          styles.radioLabel,
                          selectedAnswer === index && styles.selectedRadioLabel
                        ]}
                        style={styles.radioButton}
                        disabled={selectedAnswer !== null}
                        theme={{
                          colors: {
                            primary: selectedAnswer === index 
                              ? (question as ImageQuestion).correctAnswerId === index.toString()
                                ? '#60BF92' 
                                : '#EC221F'
                              : '#583FB0',
                            onSurfaceDisabled: selectedAnswer === index 
                              ? (question as ImageQuestion).correctAnswerId === index.toString()
                                ? '#60BF92' 
                                : '#EC221F'
                              : '#583FB0',
                          }
                        }}
                      />
                    </View>
                  ))}
                </View>
              </RadioButton.Group>
            </View>
          </View>
        );
      case 'audio':
        return (
          <View style={styles.optionsContainer}>
            <View style={styles.audioContainer}>
              <View style={styles.audioPlayerWrapper}>
                <AudioPlayer
                  ref={audioPlayerRef}
                  audioUrl={(question as AudioQuestion).audioUrl}
                />
              </View>
            </View>
            <View style={styles.radioWrapper}>
              <RadioButton.Group 
                onValueChange={(value) => !selectedAnswer && handleAnswer(parseInt(value))} 
                value={selectedAnswer?.toString() || ''}
              >
                <View style={styles.radioContainer}>
                  {(question as AudioQuestion).options.map((option: string, index: number) => (
                    <View key={index} style={[
                      styles.radioItem,
                      selectedAnswer === index && styles.selectedRadioItem,
                      selectedAnswer === index && 
                        (question as AudioQuestion).correctAnswerId === index.toString()
                          ? styles.correctOption 
                          : selectedAnswer === index 
                            ? styles.incorrectOption 
                            : null
                    ]}>
                      <RadioButton.Item
                        label={option}
                        value={index.toString()}
                        position="trailing"
                        labelStyle={[
                          styles.radioLabel,
                          selectedAnswer === index && styles.selectedRadioLabel
                        ]}
                        style={styles.radioButton}
                        disabled={selectedAnswer !== null}
                        theme={{
                          colors: {
                            primary: selectedAnswer === index 
                              ? (question as AudioQuestion).correctAnswerId === index.toString()
                                ? '#60BF92' 
                                : '#EC221F'
                              : '#583FB0',
                            onSurfaceDisabled: selectedAnswer === index 
                              ? (question as AudioQuestion).correctAnswerId === index.toString()
                                ? '#60BF92' 
                                : '#EC221F'
                              : '#583FB0',
                          }
                        }}
                      />
                    </View>
                  ))}
                </View>
              </RadioButton.Group>
            </View>
          </View>
        );
      case 'trueFalse':
        return (
          <View style={styles.optionsContainer}>
            <View style={styles.radioWrapper}>
              <RadioButton.Group 
                onValueChange={(value) => !selectedAnswer && handleAnswer(parseInt(value))} 
                value={selectedAnswer?.toString() || ''}
              >
                <View style={styles.radioContainer}>
                  {['True', 'False'].map((option, index) => (
                    <View key={index} style={[
                      styles.radioItem,
                      selectedAnswer === index && styles.selectedRadioItem
                    ]}>
                      <RadioButton.Item
                        label={option}
                        value={index.toString()}
                        position="trailing"
                        labelStyle={[
                          styles.radioLabel,
                          selectedAnswer === index && styles.selectedRadioLabel
                        ]}
                        style={[
                          styles.radioButton,
                          selectedAnswer === index && 
                            (question as TrueFalseQuestion).correctAnswer === (index === 0)
                              ? styles.correctOption 
                              : styles.incorrectOption
                        ]}
                        disabled={selectedAnswer !== null}
                        theme={{
                          colors: {
                            primary: selectedAnswer === index 
                              ? (question as TrueFalseQuestion).correctAnswer === (index === 0)
                                ? '#60BF92' 
                                : '#EC221F'
                              : '#583FB0',
                            onSurfaceDisabled: selectedAnswer === index 
                              ? (question as TrueFalseQuestion).correctAnswer === (index === 0)
                                ? '#60BF92' 
                                : '#EC221F'
                              : '#583FB0',
                          }
                        }}
                      />
                    </View>
                  ))}
                </View>
              </RadioButton.Group>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : questions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="headlineMedium">No questions available</Text>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.topBar}>
            {!showReadingText && (
              <View style={styles.progressContainer}>
                <Text variant="titleMedium" style={styles.progressText}>
                  Question {currentQuestion + 1} of {questions.length}
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            )}
          </View>

          <View style={styles.contentContainer}>
            {!showReadingText ? (
              <>
                <View style={styles.topHalf}>
                  <Surface style={styles.questionCard}>
                    <View style={styles.questionContent}>
                      <Text style={styles.questionText}>
                        {questions[currentQuestion].type === 'trueFalse' 
                          ? (questions[currentQuestion] as TrueFalseQuestion).statement
                          : (questions[currentQuestion] as TextQuestion | ImageQuestion | AudioQuestion).question}
                      </Text>
                    </View>
                  </Surface>
                </View>
                <View style={styles.bottomHalf}>
                  {renderQuestion()}
                </View>
              </>
            ) : (
              renderQuestion()
            )}
            <CustomButton 
              variant="primary"
              onPress={handleNext}
              style={styles.nextButton}
              disabled={selectedAnswer === null && !showReadingText}
            >
              {showReadingText ? 'Continue' : 
                currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            </CustomButton>
          </View>
        </View>
      )}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    color: '#583FB0',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  topHalf: {
    flex: 1,
    marginBottom: 16,
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
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 50,
    elevation: 8,
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
  readingContainer: {
    flex: 1,
  },
  readingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  readingText: {
    fontSize: 18,
    lineHeight: 28,
    color: theme.colors.onSurface,
  },
  readingButtonContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  readingContinueButton: {
    width: '100%',
  },
  fullScreenContent: {
    padding: 0,
  },
  fullScreenCard: {
    flex: 1,
    margin: 0,
    borderRadius: 0,
  },
  optionsContainer: {
    flex: 1,
    marginBottom: 16,
  },
  radioWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  radioContainer: {
    gap: 8,
  },
  radioItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  radioLabel: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    marginLeft: 8,
  },
  selectedRadioItem: {
    borderWidth: 2,
  },
  selectedRadioLabel: {
    color: '#000000',
    fontWeight: '600',
  },
  correctOption: {
    backgroundColor: '#E1FFC3',
    borderColor: '#60BF92',
  },
  incorrectOption: {
    backgroundColor: '#FBDCDC',
    borderColor: '#EC221F',
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
  audioContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioPlayerWrapper: {
    position: 'absolute',
    top: '-40%',
    zIndex: 1,
  },
});

export default Quiz; 
