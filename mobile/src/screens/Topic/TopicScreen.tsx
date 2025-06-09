import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { getTopicsForCategory } from '../../data/mockTopics';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { Button } from '../../components/Button/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { QuizTopic } from '../../types';
import { cacheQuestions } from '../../store/questionsSlice';
import { getRandomQuestions } from '../../data/mockQuestions';

type TopicItemProps = {
  topic: QuizTopic;
  isSelected: boolean;
  onSelect: (topicId: string) => void;
};

const TopicItem = ({ topic, isSelected, onSelect }: TopicItemProps) => (
  <TouchableOpacity 
    style={styles.radioItem} 
    onPress={() => onSelect(topic.topicId)}
  >
    <Text style={styles.radioLabel}>{topic.title}</Text>
    {isSelected && (
      <MaterialCommunityIcons 
        name="check" 
        size={24} 
        color={theme.colors.background} 
      />
    )}
  </TouchableOpacity>
);

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Topic'>;
type TopicScreenRouteProp = RouteProp<RootStackParamList, 'Topic'>;

export const TopicScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TopicScreenRouteProp>();
  const { topicId } = route.params;
  const categoryId = useSelector((state: RootState) => state.category.selectedCategoryId);
  const dispatch = useDispatch();

  // Get topics for the selected category
  const topicsForCategory = useMemo(() => 
    categoryId ? getTopicsForCategory(categoryId) : [], 
    [categoryId]
  );
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const handleTopicSelect = (topicId: string) => {
    console.log('Selected topic ID:', topicId);
    setSelectedTopic(topicId);
    // Initialize questions cache for the selected topic
    const questions = getRandomQuestions(topicId);
    console.log('Got questions for topic:', questions.length);
    dispatch(cacheQuestions({ topicId, questions }));
  };

  const handleQuizPress = () => {
    if (selectedTopic) {
      console.log('Starting quiz with topic:', selectedTopic);
      navigation.navigate('Quiz', { quizId: selectedTopic });
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.topics}>
        Select a Topic:
      </Text>
      
      <ScrollView style={styles.scrollView}>
        {topicsForCategory.map((topic) => (
          <TopicItem
            key={topic.topicId}
            topic={topic}
            isSelected={selectedTopic === topic.topicId}
            onSelect={handleTopicSelect}
          />
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          onPress={handleQuizPress}
          style={styles.button}
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
  topics: {
    textAlign: 'center',
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    marginBottom: 16,
  },
}); 
