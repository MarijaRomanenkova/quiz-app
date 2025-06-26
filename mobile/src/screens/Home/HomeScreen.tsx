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

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, selectedCategoryId, isLoading, error } = useSelector((state: RootState) => state.category);
  const { topics } = useSelector((state: RootState) => state.topic);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const questionsState = useSelector((state: RootState) => state.questions);
  const readingTextsState = useSelector((state: RootState) => state.readingTexts);

  console.log('HomeScreen - user:', user);
  console.log('HomeScreen - token:', token ? 'Present' : 'Missing');
  console.log('HomeScreen - categories length:', categories.length);
  console.log('HomeScreen - categories:', categories);

  useEffect(() => {
    // Only fetch data once when user is authenticated and data is not loaded
    if (user && categories.length === 0) {
      console.log('HomeScreen - Initial data fetch for authenticated user...');
      // Fetch all data in sequence: categories, topics, questions, then reading texts
      dispatch(fetchCategoriesThunk());
      dispatch(fetchTopicsThunk()).then(() => {
        // Fetch questions first
        console.log('HomeScreen - Topics loaded, now fetching questions...');
        dispatch(fetchAllQuestionsThunk()).unwrap()
          .then((questionsData) => {
            console.log('HomeScreen - Questions loaded successfully:', Object.keys(questionsData).length, 'topics');
            // Fetch reading texts after questions are loaded
            console.log('HomeScreen - Now fetching reading texts...');
            return dispatch(fetchAllReadingTextsThunk()).unwrap();
          })
          .then((readingTextsData) => {
            console.log('HomeScreen - Reading texts loaded successfully:', Object.keys(readingTextsData.byId).length, 'texts');
          })
          .catch((error) => {
            console.error('HomeScreen - Data fetch failed:', error);
          });
      });
    }
  }, [dispatch, user, categories.length]);

  // Test: Manually trigger questions fetch if not loaded
  useEffect(() => {
    if (user && categories.length > 0 && topics.length > 0) {
      console.log('HomeScreen - Current questions state:', questionsState);
      
      // Check if questions are loaded in byTopicId
      const hasQuestions = questionsState.byTopicId && Object.keys(questionsState.byTopicId).length > 0;
      
      if (!hasQuestions) {
        console.log('HomeScreen - No questions loaded, manually triggering fetch...');
        dispatch(fetchAllQuestionsThunk()).unwrap()
          .then((questionsData) => {
            console.log('HomeScreen - Manual questions fetch successful:', Object.keys(questionsData).length, 'topics');
            // Also trigger reading texts fetch
            return dispatch(fetchAllReadingTextsThunk()).unwrap();
          })
          .then((readingTextsData) => {
            console.log('HomeScreen - Manual reading texts fetch successful:', Object.keys(readingTextsData.byId).length, 'texts');
          })
          .catch((error) => {
            console.error('HomeScreen - Manual fetch failed:', error);
          });
      } else {
        console.log('HomeScreen - Questions already loaded in byTopicId:', Object.keys(questionsState.byTopicId));
        // Check if reading texts are loaded
        const hasReadingTexts = readingTextsState.byId && Object.keys(readingTextsState.byId).length > 0;
        if (!hasReadingTexts) {
          console.log('HomeScreen - No reading texts loaded, manually triggering fetch...');
          dispatch(fetchAllReadingTextsThunk()).unwrap()
            .then((readingTextsData) => {
              console.log('HomeScreen - Manual reading texts fetch successful:', Object.keys(readingTextsData.byId).length, 'texts');
            })
            .catch((error) => {
              console.error('HomeScreen - Manual reading texts fetch failed:', error);
            });
        }
      }
    }
  }, [dispatch, user, categories.length, topics.length, questionsState.byTopicId]);

  // Initialize progress tracking after both categories and topics are loaded
  useEffect(() => {
    if (categories.length > 0 && topics.length > 0) {
      console.log('HomeScreen - Initializing progress tracking...');
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

  const handleCategorySelect = (categoryId: string) => {
    dispatch(setSelectedCategory(categoryId));
  };

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
