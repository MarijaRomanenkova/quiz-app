import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, RadioButton, Surface,  } from 'react-native-paper';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigator/Navigator';
import { QuizTopic } from '../../types';
import { theme } from '../../theme';
import { getTopicsForCategory } from '../../data/mockTopics';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Topic'>;
type TopicScreenRouteProp = RouteProp<RootStackParamList, 'Topic'>;

/**
 * Welcome Component for returning users
 * @component
 * @param {Object} props - Component props
 * @param {() => void} props.onStartNewQuiz - Handler for starting new quiz
 * @param {() => void} props.onRepeatPreviousQuiz - Handler for repeating previous quiz
 */
export const TopicScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<TopicScreenRouteProp>();
  const { topicId } = route.params;
  const categoryId = useSelector((state: RootState) => state.category.selectedCategoryId);

  // Get topics for the selected category
  const topicsForCategory = useMemo(() => 
    categoryId ? getTopicsForCategory(categoryId) : [], 
    [categoryId]
  );
  const [selectedTopic, setSelectedTopic] = useState<string>('false');

  const handleQuizPress = (isRepeating: boolean = false) => {
    navigation.navigate('Quiz', { topicId, isRepeating });
  };

  return (
    <Surface style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.topics}>
            Select a Topic:
          </Text>
          
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <RadioButton.Group 
              onValueChange={setSelectedTopic}
              value={selectedTopic}
            >
              {topicsForCategory.map((topic) => (
                <RadioButton.Item
                  key={topic.topicId}
                  label={topic.title}
                  value={topic.topicId}
                  mode="android"
                />
              ))}
            </RadioButton.Group>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => handleQuizPress(false)}
              style={styles.button}
            >
              Start New Quiz
            </Button>

            <Button
              mode="outlined"
              onPress={() => handleQuizPress(true)}
              style={styles.button}
            >
              Repeat Previous Quiz
            </Button>
          </View>
        </Card.Content>
      </Card>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  card: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topics: {
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    marginBottom: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
}); 
