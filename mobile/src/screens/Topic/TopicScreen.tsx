/**
 * @fileoverview Topic Screen component for the mobile application
 * 
 * This component displays available topics within a selected category and allows
 * users to choose a topic to start a quiz. It shows topic progress, completion
 * status, and scores for completed topics. The screen integrates with progress
 * tracking to display only unlocked topics and provides navigation to quiz screens.
 * 
 * The component features:
 * - Topic selection with visual feedback
 * - Progress tracking integration
 * - Completion status indicators
 * - Score display for completed topics
 * - Navigation back to categories
 * 
 * @module screens/Topic
 */

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
import { BackButton } from '../../components/BackButton';

/**
 * Props interface for the TopicItem component
 * 
 * @interface TopicItemProps
 * @property {QuizTopic} topic - The topic data to display
 * @property {boolean} isSelected - Whether this topic is currently selected
 * @property {(topicId: string) => void} onSelect - Function called when topic is selected
 * @property {boolean} isCompleted - Whether this topic has been completed
 * @property {number} score - The score achieved for this topic (0-100)
 */
type TopicItemProps = {
  topic: QuizTopic;
  isSelected: boolean;
  onSelect: (topicId: string) => void;
  isCompleted: boolean;
  score: number;
};

/**
 * Individual topic item component
 * 
 * Displays a single topic with selection state, completion status,
 * and score information. Provides visual feedback for different states
 * and handles touch interactions.
 * 
 * @param {TopicItemProps} props - The topic item props
 * @param {QuizTopic} props.topic - The topic data to display
 * @param {boolean} props.isSelected - Whether this topic is currently selected
 * @param {(topicId: string) => void} props.onSelect - Function called when topic is selected
 * @param {boolean} props.isCompleted - Whether this topic has been completed
 * @param {number} props.score - The score achieved for this topic
 * @returns {JSX.Element} A touchable topic item with status indicators
 */
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

/**
 * Topic Screen component for topic selection and quiz navigation
 * 
 * Displays available topics within a category and allows users to
 * select a topic to start a quiz. Integrates with progress tracking
 * to show completion status and scores.
 * 
 * Key features:
 * - Displays unlocked topics for the selected category
 * - Shows completion status and scores for topics
 * - Visual selection feedback with checkmarks
 * - Progress-based topic unlocking
 * - Navigation to quiz screens
 * - Back navigation to categories
 * 
 * @returns {JSX.Element} The topic selection screen with progress indicators
 * 
 * @example
 * ```tsx
 * // Navigation to topic screen
 * navigation.navigate('Topic', { categoryId: 'grammar' });
 * ```
 */
export const TopicScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TopicScreenRouteProp>();
  const { categoryId } = route.params;
  const dispatch = useDispatch();

  // Get unlocked topics for this category
  const unlockedTopics = useSelector((state: RootState) => 
    selectUnlockedTopicsForCategory(state, categoryId)
  );

  const [selectedTopic, setSelectedTopic] = useState<string>('');

  /**
   * Handles topic selection from the list
   * 
   * Updates the selected topic state when a user taps on a topic card.
   * 
   * @param {string} topicId - The ID of the selected topic
   */
  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
  };

  /**
   * Handles starting a quiz for the selected topic
   * 
   * Navigates to the Quiz screen with the selected topic ID.
   * Only works if a topic is currently selected.
   */
  const handleQuizPress = () => {
    if (selectedTopic) {
      navigation.navigate('Quiz', { quizId: selectedTopic });
    }
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <View style={styles.backButton}>
        <BackButton 
          variant="light" 
          onPress={() => navigation.navigate('Home')} 
          text="Back"
        />
      </View>

      <Text style={styles.topics}>
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

      <View >
        <Button
          variant="primary"
          onPress={handleQuizPress}
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
    marginBottom: 16,
  },
  topics: {
    textAlign: 'center',
    fontFamily: 'Baloo2-SemiBold',
    fontSize: 24,
    marginBottom: 24,
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
}); 
