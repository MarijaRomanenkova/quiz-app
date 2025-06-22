import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { theme } from '../../theme';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Button } from '../../components/Button/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { QuizTopic } from '../../types';
import { selectUnlockedTopicsForCategory, selectTopicProgress } from '../../store/progressSlice';

type TopicItemProps = {
  topic: QuizTopic;
  isSelected: boolean;
  onSelect: (topicId: string) => void;
  isCompleted: boolean;
  score: number;
};

const TopicItem = ({ topic, isSelected, onSelect, isCompleted, score }: TopicItemProps) => (
  <TouchableOpacity 
    style={[
      styles.radioItem,
      isSelected && styles.selectedRadioItem,
      isCompleted && styles.completedRadioItem
    ]} 
    onPress={() => onSelect(topic.topicId)}
  >
    <View style={styles.topicContent}>
      <Text style={[
        styles.radioLabel,
        isSelected && styles.selectedRadioLabel,
        isCompleted && styles.completedRadioLabel
      ]}>{topic.topicId}</Text>
      {isCompleted && (
        <Text style={styles.scoreText}>Score: {score}%</Text>
      )}
    </View>
    {isSelected && (
      <MaterialCommunityIcons 
        name="check" 
        size={24} 
        color={theme.colors.primaryContainer} 
      />
    )}
    {isCompleted && !isSelected && (
      <MaterialCommunityIcons 
        name="check-circle" 
        size={24} 
        color={theme.colors.primary} 
      />
    )}
  </TouchableOpacity>
);

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Topic'>;
type TopicScreenRouteProp = RouteProp<RootStackParamList, 'Topic'>;

export const TopicScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TopicScreenRouteProp>();
  const { categoryId } = route.params;
  const dispatch = useDispatch();

  console.log('TopicScreen - categoryId:', categoryId);

  // Get unlocked topics for the selected category from progress tracking
  const unlockedTopics = useSelector((state: RootState) => 
    selectUnlockedTopicsForCategory(state, categoryId)
  );

  console.log('TopicScreen - unlocked topics for category:', unlockedTopics);

  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const handleTopicSelect = (topicId: string) => {
    console.log('Selected topic ID:', topicId);
    setSelectedTopic(topicId);
  };

  const handleQuizPress = () => {
    if (selectedTopic) {
      console.log('Starting quiz with topic:', selectedTopic);
      navigation.navigate('Quiz', { quizId: selectedTopic });
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Main')}
      >
        <MaterialCommunityIcons name="chevron-left" size={32} color={theme.colors.outline} />
        <Text style={styles.backButtonText}>Back to Categories</Text>
      </TouchableOpacity>

      <Text variant="headlineMedium" style={styles.topics}>
        Select a Topic:
      </Text>
      
      <ScrollView style={styles.scrollView}>
        {unlockedTopics.map((topic) => {
          const progress = useSelector((state: RootState) => 
            selectTopicProgress(state, topic.topicId)
          );
          
          return (
            <TopicItem
              key={topic.topicId}
              topic={topic}
              isSelected={selectedTopic === topic.topicId}
              onSelect={handleTopicSelect}
              isCompleted={progress?.completed || false}
              score={progress?.score || 0}
            />
          );
        })}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          onPress={handleQuizPress}
          style={styles.button}
          disabled={!selectedTopic}
        >
          Start Quiz
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.secondaryContainer,
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 16,
    zIndex: 10,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  topics: {
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 60,
  },
  scrollView: {
    flex: 1,
  },
  radioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  selectedRadioItem: {
    borderWidth: 2,
    borderColor: theme.colors.primaryContainer,
  },
  completedRadioItem: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryContainer + '20',
  },
  topicContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedRadioLabel: {
    color: theme.colors.primaryContainer,
  },
  completedRadioLabel: {
    color: theme.colors.primary,
  },
  scoreText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    marginBottom: 16,
  },
}); 
