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
import { fetchAllReadingTextsThunk } from '../../store/readingTextsSlice';
import { initializeCategoryProgress } from '../../store/progressSlice';
import type { AppDispatch } from '../../store';
import { Button } from '../../components/Button/Button';

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
  const readingTextsState = useSelector((state: RootState) => state.readingTexts);

  /**
   * Fetch initial data for authenticated users
   * 
   * Fetches topics, questions, and reading texts in sequence when the user
   * is authenticated and data hasn't been loaded yet.
   */
  useEffect(() => {
    if (user && token) {
      const loadInitialData = async () => {
        try {
          // Fetch topics first
          await dispatch(fetchTopicsThunk());
          
          // Fetch questions for all topics
          await dispatch(fetchAllQuestionsThunk());
          
          // Fetch reading texts
          await dispatch(fetchAllReadingTextsThunk());
          
          // Initialize progress tracking
          dispatch(initializeCategoryProgress({
            categoryId: 'listening',
            totalTopics: 3,
            initialUnlocked: 3
          }));
        } catch (error) {
          console.error('Failed to load initial data:', error);
        }
      };

      loadInitialData();
    }
  }, [user, token, dispatch]);

  /**
   * Manual data loading fallback
   * 
   * Ensures questions and reading texts are loaded even if the initial
   * loading sequence fails or is incomplete.
   */
  useEffect(() => {
    if (user && token && topics.length > 0) {
      const loadMissingData = async () => {
        try {
          // Check if questions are loaded
          if (Object.keys(questionsState.byTopicId).length === 0) {
            await dispatch(fetchAllQuestionsThunk());
          }
          
          // Check if reading texts are loaded
          if (Object.keys(readingTextsState.byId).length === 0) {
            await dispatch(fetchAllReadingTextsThunk());
          }
        } catch (error) {
          console.error('Failed to load missing data:', error);
        }
      };

      loadMissingData();
    }
  }, [dispatch, user, token, topics.length, questionsState.byTopicId, readingTextsState.byId]);

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

  if (error) {
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
    marginBottom: 24,
  },
  radioContainer: {
    flex: 1,
  },
  radioItem: {
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
