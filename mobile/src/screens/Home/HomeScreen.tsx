/**
 * @fileoverview Home Screen component for the mobile application
 * 
 * This component serves as the main dashboard where users can select learning
 * categories and navigate to topics. It handles data initialization, category
 * selection, and progress tracking setup. The screen displays available
 * categories with radio button selection and provides navigation to topic screens.
 * 
 * The component manages several data loading operations:
 * - Categories and topics from the backend
 * - Questions and reading texts for all topics
 * - Progress tracking initialization
 * - Authentication state validation
 * 
 * @module screens/Home
 */

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { theme } from '../../theme';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchCategoriesThunk, setSelectedCategory } from '../../store/categorySlice';
import { fetchTopicsThunk } from '../../store/topicSlice';
import { fetchAllQuestionsThunk } from '../../store/questionsSlice';
import { fetchAllReadingTextsThunk } from '../../store/questionsSlice';
import { initializeCategoryProgress, updateCompletedTopicsCategories } from '../../store/progressSlice';
import type { AppDispatch } from '../../store';
import { Button } from '../../components/Button/Button';
import type { Topic } from '../../types';

/**
 * Props interface for the HomeScreen component
 * 
 * @interface HomeScreenProps
 * @property {NativeStackNavigationProp<RootStackParamList, 'Home'>} navigation - Navigation prop for screen transitions
 */
type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

/**
 * Home Screen component for category selection and data management
 * 
 * Provides the main interface for users to select learning categories
 * and access topics. The component handles comprehensive data loading
 * and initialization for the learning experience.
 * 
 * Key features:
 * - Category selection with radio buttons
 * - Progressive data loading (categories → topics → questions → reading texts)
 * - Progress tracking initialization
 * - Authentication validation
 * - Error handling and loading states
 * - Navigation to topic screens
 * 
 * @param {HomeScreenProps} props - The home screen props
 * @param {NativeStackNavigationProp<RootStackParamList, 'Home'>} props.navigation - Navigation prop for screen transitions
 * @returns {JSX.Element} The home screen with category selection interface
 * 
 * @example
 * ```tsx
 * <HomeScreen navigation={navigation} />
 * ```
 */
export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, selectedCategoryId, isLoading, error } = useSelector((state: RootState) => state.category);
  const { topics } = useSelector((state: RootState) => state.topic);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const questionsState = useSelector((state: RootState) => state.questions);
  const readingTextsState = useSelector((state: RootState) => state.questions);
  const { topicProgress, categoryProgress } = useSelector((state: RootState) => state.progress);

  /**
   * Initial data loading for authenticated users
   * 
   * Fetches categories, topics, questions, and reading texts in sequence
   * when the user is authenticated and data hasn't been loaded yet.
   */
  useEffect(() => {
    // Only fetch data once when user is authenticated and data is not loaded
    if (user && token && categories.length === 0) {
      // Fetch all data in sequence: categories, topics, questions, then reading texts
      dispatch(fetchCategoriesThunk());
      dispatch(fetchTopicsThunk()).then((result) => {
        // Update category IDs for completed topics after topics are loaded
        if (result.payload && Array.isArray(result.payload)) {
          const topicsForUpdate = (result.payload as Topic[]).map(topic => ({
            topicId: topic.topicId,
            categoryId: topic.categoryId
          }));
          dispatch(updateCompletedTopicsCategories(topicsForUpdate));
        }
        
        // Fetch questions for all topics
        dispatch(fetchAllQuestionsThunk()).unwrap()
          .then((questionsData) => {
            // Fetch reading texts after questions are loaded
            return dispatch(fetchAllReadingTextsThunk()).unwrap();
          })
          .then((readingTextsData) => {
            // Reading texts loaded successfully
          })
          .catch((error) => {
            console.error('HomeScreen - Data fetch failed:', error);
          });
      });
    }
  }, [dispatch, user, token, categories.length]);

  /**
   * Manual data loading fallback
   * 
   * Ensures questions and reading texts are loaded even if the initial
   * loading sequence fails or is incomplete.
   */
  useEffect(() => {
    if (user && token && categories.length > 0 && topics.length > 0) {
      // Check if questions are loaded in byTopicId
      const hasQuestions = questionsState.byTopicId && Object.keys(questionsState.byTopicId).length > 0;
      
      if (!hasQuestions) {
        dispatch(fetchAllQuestionsThunk()).unwrap()
          .then((questionsData) => {
            // Also trigger reading texts fetch
            return dispatch(fetchAllReadingTextsThunk()).unwrap();
          })
          .then((readingTextsData) => {
            // Manual reading texts fetch successful
          })
          .catch((error) => {
            console.error('HomeScreen - Manual fetch failed:', error);
          });
      } else {
        // Check if reading texts are loaded
        const hasReadingTexts = readingTextsState.readingTextsById && Object.keys(readingTextsState.readingTextsById).length > 0;
        if (!hasReadingTexts) {
          dispatch(fetchAllReadingTextsThunk()).unwrap()
            .then((readingTextsData) => {
              // Manual reading texts fetch successful
            })
            .catch((error) => {
              console.error('HomeScreen - Manual reading texts fetch failed:', error);
            });
        }
      }
    }
  }, [dispatch, user, token, categories.length, topics.length, questionsState.byTopicId]);

  /**
   * Progress tracking initialization
   * 
   * Sets up progress tracking for each category after categories and
   * topics are loaded. Determines initial unlocked topics based on
   * category type.
   */
  useEffect(() => {
    if (categories.length > 0 && topics.length > 0) {
      categories.forEach(category => {
        const categoryTopics = topics.filter(topic => topic.categoryId === category.categoryId);
        const initialUnlocked = category.categoryId === 'listening' || category.categoryId === 'words' ? 3 : categoryTopics.length;
        
        dispatch(initializeCategoryProgress({
          categoryId: category.categoryId,
          totalTopics: categoryTopics.length,
          initialUnlocked
        }));
      });
    }
  }, [dispatch, categories.length, topics.length]);

  /**
   * Handles category selection
   * 
   * Updates the selected category in Redux state when user
   * selects a different category option.
   * 
   * @param {string} categoryId - The ID of the selected category
   */
  const handleCategorySelect = (categoryId: string) => {
    dispatch(setSelectedCategory(categoryId));
  };

  /**
   * Handles navigation to topic screen
   * 
   * Navigates to the topic selection screen for the currently
   * selected category.
   */
  const handleContinue = () => {
    if (selectedCategoryId) {
      navigation.navigate('Topic', { categoryId: selectedCategoryId });
    }
  };

  // Show loading state while checking authentication
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to access categories...</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading categories...</Text>
      </View>
    );
  }

  if (error && categories.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Select a Category:
      </Text>
      
      <View style={styles.radioContainer}>
        <RadioButton.Group onValueChange={handleCategorySelect} value={selectedCategoryId || ''}>
          {categories.map((category) => (
            <View key={category.categoryId} style={[
              styles.radioItem,
              selectedCategoryId === category.categoryId && styles.selectedRadioItem
            ]}>
              <RadioButton.Item
                label={category.categoryId}
                value={category.categoryId}
                position="trailing"
                labelStyle={[
                  styles.radioLabel,
                  selectedCategoryId === category.categoryId && styles.selectedRadioLabel
                ]}
                style={styles.radioButton}
                theme={{
                  colors: {
                    primary: theme.colors.primaryContainer,
                  }
                }}
              />
            </View>
          ))}
        </RadioButton.Group>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          onPress={handleContinue}
          style={styles.button}
          disabled={!selectedCategoryId}
        >
          Continue
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
  title: {
    textAlign: 'center',
    marginVertical: 24,
    fontFamily: 'Baloo2-SemiBold',
    fontSize: 24,
  },
  radioContainer: {
    flex: 1,
    marginTop: 16,
  },
  radioItem: {
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.outline,
  },
  selectedRadioItem: {
    borderWidth: 2,
    borderColor: theme.colors.primaryContainer,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedRadioLabel: {
    color: theme.colors.primaryContainer,
  },
  radioButton: {
    marginVertical: 0,
  },
  buttonContainer: {
    marginTop: 24,
  },
  button: {
    marginBottom: 16,
  },
}); 
