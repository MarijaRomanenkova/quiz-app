import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated, TouchableOpacity, Image } from 'react-native';
import { Text, Button, Card, Surface, ProgressBar, Portal, Dialog, IconButton, RadioButton } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { Question } from '../../types';
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

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const startTime = useRef(Date.now());
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
 

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      console.log('Loading questions for quizId:', quizId);
      console.log('Is repeating?', route.params?.isRepeating);
      
      // If we're repeating wrong questions, use them from Redux
      if (route.params?.isRepeating) {
        const wrongQuestions = store.getState().wrongQuestions.wrongQuestions;
        console.log('Review mode - Wrong questions from Redux:', wrongQuestions);
        console.log('Wrong questions length:', wrongQuestions?.length);
        if (wrongQuestions && wrongQuestions.length > 0) {
          console.log('Setting questions for review:', wrongQuestions);
          setQuestions(wrongQuestions);
          setIsLoading(false);
          return;
        } else {
          console.log('No wrong questions found in Redux');
        }
      }
      
      // For normal quiz mode, get questions from cache or generate new ones
      const questions = getRandomQuestions(quizId);
      console.log('Loaded questions from mock:', questions.length);
      
      if (questions.length === 0) {
        console.error('No questions found for topic:', quizId);
        setIsLoading(false);
        return;
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

  const handleAnswer = async (selectedIndex: number) => {
    // Stop audio if it's playing
    if (audioPlayerRef.current) {
      await audioPlayerRef.current.stop();
    }
    
    setSelectedAnswer(selectedIndex);
    const correct = questions[currentQuestion].correctAnswerId === selectedIndex.toString();
    
    if (correct) {
      setScore(prev => prev + 1);
    } else {
      console.log('Adding wrong question:', questions[currentQuestion]);
      dispatch(addWrongQuestion(questions[currentQuestion].questionId));
      dispatch(addToWrongQuestions(questions[currentQuestion]));
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);   
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Quiz is complete, save results to Redux
      const timeSpent = (Date.now() - startTime.current) / 1000; // in seconds
      
      dispatch(updateDailyStats({
        timeSpent,
        questionsAnswered: questions.length
      }));

      dispatch(updateBestAttempt({
        topicId: quizId,
        score,
        timeSpent
      }));

      // Save current quiz result
      dispatch(setQuizResult({
        score: score,
        totalQuestions: questions.length,
        timeSpent
      }));

      // Navigate to Results screen
      navigation.navigate('Results', {
        quizId
      });
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

  const renderQuestionContent = () => {
    const question = questions[currentQuestion];
    
    if (question.type === 'audio') {
      return (
        <AudioPlayer 
          ref={audioPlayerRef}
          audioUrl={question.content}
          onPlaybackComplete={() => {
            // Optional: Add any logic you want to execute when audio finishes
          }}
        />
      );
    }

    if (question.content.startsWith('http')) {
      return (
        <Image 
          source={{ uri: question.content }}
          style={styles.questionImage}
          resizeMode="contain"
        />
      );
    }

    return (
      <Text variant="headlineSmall" style={styles.questionText}>
        {question.content}
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Surface style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Loading questions...
          </Text>
        </Surface>
      ) : questions.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium">No questions available</Text>
            <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
              Go Back
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <View style={styles.mainContainer}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.header}>
              <IconButton
                icon="chevron-left"
                iconColor="#583FB0"
                size={24}
                onPress={() => navigation.goBack()}
              />
              <Text style={styles.backText}>Previous</Text>
            </View>
            <Text variant="titleMedium" style={styles.progressText}>
              {currentQuestion + 1}/{questions.length}
            </Text>
          </View>

          {/* Top Half - Question */}
          <View style={styles.topHalf}>
            <Surface style={styles.questionCard}>
              <View style={styles.questionContent}>
                {renderQuestionContent()}
              </View>
            </Surface>
          </View>

          {/* Bottom Half - Options and Next Button */}
          <View style={styles.bottomHalf}>
            <View style={styles.optionsContainer}>
              <View style={styles.radioWrapper}>
                <RadioButton.Group onValueChange={(value) => !selectedAnswer && handleAnswer(parseInt(value))} value={selectedAnswer?.toString() || ''}>
                  <View style={styles.radioContainer}>
                    {questions[currentQuestion].options.map((option, index) => (
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
                              (questions[currentQuestion].correctAnswerId === index.toString() 
                                ? styles.correctOption 
                                : styles.incorrectOption)
                          ]}
                          disabled={selectedAnswer !== null}
                          theme={{
                            colors: {
                              primary: selectedAnswer === index 
                                ? (questions[currentQuestion].correctAnswerId === index.toString() 
                                  ? '#60BF92' 
                                  : '#EC221F')
                                : '#583FB0',
                              onSurfaceDisabled: selectedAnswer === index 
                                ? (questions[currentQuestion].correctAnswerId === index.toString() 
                                  ? '#60BF92' 
                                  : '#EC221F')
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

            <CustomButton 
              variant="primary"
              onPress={handleNext}
              style={styles.nextButton}
              disabled={selectedAnswer === null}
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backText: {
    color: '#583FB0',
    fontSize: 16,
    fontFamily: 'BalooBhaina2-Regular',
  },
  progressText: {
    color: '#583FB0',
    fontWeight: 'bold',
  },
  topHalf: {
    flex: 1,
    marginBottom: 16,
  },
  bottomHalf: {
    flex: 1,
    justifyContent: 'space-between',
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
    marginVertical: 48,
  },
  questionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    flex: 1,
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
    borderRadius: 20,
  },
  radioLabel: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '600',
  },
  selectedRadioItem: {
    borderWidth: 0,
    borderColor: 'transparent',
  },
  selectedRadioLabel: {
    color: '#000000',
  },
  correctOption: {
    backgroundColor: '#E1FFC3',
    borderColor: '#60BF92',
    borderWidth: 2,
  },
  incorrectOption: {
    backgroundColor: '#FBDCDC',
    borderColor: '#EC221F',
    borderWidth: 2,
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
  loadingText: {
    marginTop: 8,
  },
  card: {
    flex: 1,
    margin: 16,
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
  button: {
    marginTop: 16,
  },
  questionImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default Quiz; 
