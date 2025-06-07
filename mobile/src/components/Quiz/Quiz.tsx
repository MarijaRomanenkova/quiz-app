import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Text, Button, Card, Surface, ProgressBar, Portal, Dialog } from 'react-native-paper';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigator/Navigator';
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
import { selectCachedQuestions, cacheQuestions, selectCachedText } from '../../store/questionsSlice';
import { Audio } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';



type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type QuizProps = {
  topicId: string;
  isRepeating?: boolean;
};

/**
 * Quiz Component
 * Handles quiz logic, scoring, and feedback
 * @component
 */
const Quiz: React.FC<QuizProps> = ({ topicId, isRepeating = false }) => {
  const route = useRoute<QuizScreenRouteProp>();
  const navigation = useNavigation<QuizScreenNavigationProp>();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [cursor, setCursor] = useState<string>();
  const [hasMore, setHasMore] = useState(true);
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFinalDialog, setShowFinalDialog] = useState(false);
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const startTime = useRef(Date.now());
  const cachedQuestions = useSelector((state: RootState) => 
    selectCachedQuestions(state, topicId)
  );
  const cachedText = useSelector((state: RootState) => 
    selectCachedText(state, topicId)
  );

  const currentTopicId = useSelector((state: RootState) => state.quiz.currentTopicId);

  useEffect(() => {
    loadQuestions();
  }, [topicId]);

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

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      if (cachedQuestions) {
        setQuestions(cachedQuestions);
        setIsLoading(false);
        return;
      }

      const response = await fetchQuestions(topicId);
      dispatch(cacheQuestions({ 
        topicId, 
        questions: response.questions 
      }));
      setQuestions(response.questions);
      setCursor(response.nextCursor);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreQuestions = async () => {
    if (!cursor || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetchQuestions(topicId, cursor);
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
    if (sound) {
      await stopSound();
    }
    
    setSelectedAnswer(selectedIndex);
    const correct = questions[currentQuestion].correctAnswerId === selectedIndex.toString();
    
    if (correct) {
      setScore(prev => prev + questions[currentQuestion].points);
     
    } else {
      setWrongAnswers(prev => [...prev, questions[currentQuestion]]);
      dispatch(addWrongQuestion(questions[currentQuestion].questionId));

    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);   
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      if (wrongAnswers.length > 0 && !isReviewMode) {
        setIsReviewMode(true);
        setQuestions(wrongAnswers);
        setWrongAnswers([]);
        setCurrentQuestion(0);
        setScore(0);
      } else {
        handleQuizComplete();
        navigation.goBack();
      }
    }
  };

  const handleQuizComplete = () => {
    const timeSpent = (Date.now() - startTime.current) / 1000; // in seconds
    
    dispatch(updateDailyStats({
      timeSpent,
      questionsAnswered: questions.length
    }));

    dispatch(updateBestAttempt({
      topicId,
      score,
      timeSpent
    }));

    navigation.navigate('Results', {
      score,
      totalQuestions: questions.length
    });
  };

  const getButtonStyle = (index: number) => {
    if (selectedAnswer === null) return [styles.option, { opacity: fadeAnim }];
    
    const isSelected = selectedAnswer === index;
    const isCorrect = questions[currentQuestion].correctAnswerId === index.toString();
    
    if (isSelected && isCorrect) return [styles.option, styles.correctAnswer, { opacity: fadeAnim }];
    if (isSelected && !isCorrect) return [styles.option, styles.wrongAnswer, { opacity: fadeAnim }];
    if (!isSelected && isCorrect) return [styles.option, styles.correctAnswer, { opacity: fadeAnim }];
    return [styles.option, { opacity: fadeAnim }];
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


  const renderQuestionContent = () => {
    const question = questions[currentQuestion];

    switch (question.type) {
      case 'trueFalse':
        return (
          <View style={styles.trueFalseContainer}>
            <Text variant="titleLarge" style={styles.readingTitle}>
              {cachedText || 'Reading Text'}
            </Text>
            <Text style={styles.readingText}>
              {cachedText || 'Text content not available'}
            </Text>
            <View style={styles.questionSection}>
              <Text style={styles.questionText}>
                {question.content}
              </Text>
              <View style={styles.trueFalseButtons}>
                <Button
                  mode="outlined"
                  onPress={() => !selectedAnswer && handleAnswer(0)}
                  style={getButtonStyle(0)}
                  disabled={selectedAnswer !== null}
                >
                  Richtig
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => !selectedAnswer && handleAnswer(1)}
                  style={getButtonStyle(1)}
                  disabled={selectedAnswer !== null}
                >
                  Falsch
                </Button>
              </View>
            </View>
          </View>
        );
      case 'audio':
        return (
          <View style={styles.audioContainer}>
            <Button
              mode="contained"
              onPress={() => isPlaying ? stopSound() : playSound(question.content)}
              style={styles.audioButton}
              icon={() => (
                <MaterialIcons
                  name={isPlaying ? 'stop' : 'play-arrow'}
                  size={24}
                  color="white"
                />
              )}
            >
              {isPlaying ? 'Stop' : 'Play Audio'}
            </Button>
          </View>
        );
      case 'image':
        return (
          <Card.Cover
            source={{ uri: question.content }}
            style={styles.questionImage}
          />
        );
      default:
        return (
          <View style={styles.textContainer}>
            <Text variant="headlineSmall">
              {question.content}
            </Text>
          </View>
        );
    }
  };

  return (
    <Surface style={styles.container}>
      {isLoading ? (
        <Surface style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Loading questions...
          </Text>
        </Surface>
      ) : !questions || questions.length === 0 ? (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium">No questions available</Text>
            <Button mode="contained" onPress={() => navigation.goBack()} style={styles.button}>
              Go Back
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.progressBarContainer}>
                <Text variant="titleLarge" style={styles.score}>
                  Score: {score}
                </Text>
                <ProgressBar
                  progress={(currentQuestion + 1) / questions.length}
                  style={styles.progress}
                />
              </View>

              <View style={styles.questionContainer}>
                <View style={styles.contentWrapper}>
                  {renderQuestionContent()}
                </View>
              </View>

              <View style={styles.optionsContainer}>
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    mode="outlined"
                    onPress={() => !selectedAnswer && handleAnswer(index)}
                    style={getButtonStyle(index)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </Button>
                ))}
              </View>

              {selectedAnswer !== null && (
                <Button 
                  mode="contained"
                  onPress={handleNext}
                  style={styles.nextButton}
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                </Button>
              )}
            </Card.Content>
          </Card>
        </Animated.View>
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 8,
    backgroundColor: theme.colors.background,
  },
  card: {
    flex: 1,
    width: '100%',
    height: '100%',
  
  },
  progressBarContainer: {
    marginBottom:8,
    marginTop:8,
    flex: 1
  },
  score: {
    textAlign: 'right',
    marginBottom: 8,
  },
  progress: {
    marginBottom: 16,
  },
  questionContainer: {
    width: '100%',
    flex: 2,
    marginBottom: 16,
  },
  contentWrapper: {
    height: '100%',
    width: '100%',
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionImage: {
    width: 'auto',
    height: '100%',
    aspectRatio: 1,  // This will maintain square ratio
    resizeMode: 'contain',
    backgroundColor: '#f5f5f5',
  },
  textContainer: {
    height: '100%',
    width: '100%',
    padding: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    textAlign: 'center',
    minHeight: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    color: '#F44336',
  },
  optionsContainer: {
    width: '100%',
    flex: 2,
    gap: 4,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
  },
  button: {
    marginTop: 16,
  },
  correctAnswer: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',  // Light green
    borderColor: '#4CAF50',
  },
  wrongAnswer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',  // Light red
    borderColor: '#F44336',
  },
  option: {
    marginBottom: 4,
    width: '100%',
  },
  audioContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  audioButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  nextButton: {
    marginTop: 16,
    marginBottom: 8,
  },
  trueFalseContainer: {
    width: '100%',
    height: '100%',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  readingTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  readingText: {
    marginBottom: 24,
    lineHeight: 24,
  },
  questionSection: {
    gap: 16,
  },
  trueFalseButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
});

export default Quiz; 
