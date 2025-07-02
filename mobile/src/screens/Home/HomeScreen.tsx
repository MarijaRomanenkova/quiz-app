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

// React and core libraries
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';

// Third-party libraries
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Project utilities and services
import { createLayoutStyles, createTextStyles } from '../../utils/themeUtils';
import { fetchCategoriesThunk, setSelectedCategory } from '../../store/categorySlice';
import { fetchTopicsThunk } from '../../store/topicSlice';
import { fetchAllQuestionsThunk, fetchAllReadingTextsThunk } from '../../store/questionsSlice';
import { initializeCategoryProgress, updateCompletedTopicsCategories } from '../../store/progressSlice';

// Project components
import { Button } from '../../components/Button/Button';
import { LoadingWrapper } from '../../components/common/LoadingWrapper';

// Types and interfaces
import type { RootStackParamList } from '../../navigation/AppNavigator';
import type { AppDispatch } from '../../store';
import type { Topic } from '../../types';
import { RootState } from '../../store';

// Theme and styling
import { theme, fonts, spacing, layout } from '../../theme';

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
          .then(() => {
            // Fetch reading texts after questions are loaded
            return dispatch(fetchAllReadingTextsThunk()).unwrap();
          })
          .then(() => {
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
          .then(() => {
            // Also trigger reading texts fetch
            return dispatch(fetchAllReadingTextsThunk()).unwrap();
          })
          .then(() => {
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
          .then(() => {
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

  return (
    <LoadingWrapper isLoading={isLoading} error={error || undefined}>
      {!user ? (
        <View style={styles.container}>
          <Text style={styles.title}>Please log in to access categories</Text>
        </View>
      ) : (
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
              testID="continue-button"
            >
              Next
            </Button>
          </View>
        </View>
      )}
    </LoadingWrapper>
  );
};

const layoutStyles = createLayoutStyles();
const titleStyles = createTextStyles('xlarge', 'semiBold', theme.colors.text);

const styles = StyleSheet.create({
  button: {
    marginBottom: spacing.md,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
  container: {
    ...layoutStyles.container,
    backgroundColor: theme.colors.secondaryContainer,
    padding: spacing.lg,
  },
  radioButton: {
    marginVertical: 0,
  },
  radioContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 40,
  },
  radioItem: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outline,
    borderRadius: layout.borderRadius.large,
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  radioLabel: {
    fontSize: fonts.sizes.medium,
    fontWeight: 'bold',
  },
  selectedRadioItem: {
    borderColor: theme.colors.primaryContainer,
    borderWidth: 2,
  },
  selectedRadioLabel: {
    color: theme.colors.primaryContainer,
  },
  title: {
    ...titleStyles.text,
    marginVertical: spacing.lg,
    textAlign: 'center',
  },
}); 
