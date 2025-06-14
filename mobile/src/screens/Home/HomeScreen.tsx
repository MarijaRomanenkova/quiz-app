import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import type { UserProfile } from '../../types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSelectedCategory, fetchCategoriesThunk } from '../../store/categorySlice';
import { getTopicsForCategory } from '../../data/mockTopics';
import type { AppDispatch } from '../../store';
import { Button } from '../../components/Button/Button';

type HomeScreenProps = {
  route?: {
    params?: {
      userProfile?: UserProfile;
    };
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = ({ route }: HomeScreenProps) => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  // Get user and categories from Redux state
  const userFromRedux = useSelector((state: RootState) => state.user);
  const { categories, isLoading, error } = useSelector((state: RootState) => state.category);
  const userProfile = route?.params?.userProfile || userFromRedux;

  useEffect(() => {
    // Only fetch if we don't have categories
    if (categories.length === 0) {
      dispatch(fetchCategoriesThunk());
    }
  }, [categories.length, dispatch]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      dispatch({ type: 'category/setSelectedCategory', payload: selectedCategory });
      const topicsForCategory = getTopicsForCategory(selectedCategory);
      if (topicsForCategory.length > 0) {
        navigation.navigate('Topic', { topicId: topicsForCategory[0].topicId });
      }
    }
  };

  // Safety check - if no user is found at all, redirect to Onboarding
  React.useEffect(() => {
    if (!userProfile || !userProfile.name) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [userProfile, navigation]);

  // Don't render until we have a user
  if (!userProfile || !userProfile.name) {
    return null;
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
      <Text variant="titleLarge" style={styles.categoriesTitle}>
        Choose what to study:
      </Text>

      <View style={styles.categoriesContainer}>
        <View style={styles.radioWrapper}>
          <RadioButton.Group onValueChange={handleCategorySelect} value={selectedCategory}>
            <View style={styles.radioContainer}>
              {categories.map((category) => (
                <View key={category.categoryId} style={[
                  styles.radioItem,
                  selectedCategory === category.categoryId && styles.selectedRadioItem
                ]}>
                  <RadioButton.Item
                    label={category.categoryId.charAt(0).toUpperCase() + category.categoryId.slice(1)}
                    value={category.categoryId}
                    position="trailing"
                    labelStyle={[
                      styles.radioLabel,
                      selectedCategory === category.categoryId && styles.selectedRadioLabel
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
            </View>
          </RadioButton.Group>
        </View>
      </View>

      <Button
        onPress={handleContinue}
        disabled={!selectedCategory}
        style={styles.continueButton}
        variant="primary"
      >
        Go
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.secondaryContainer,
  },
  categoriesTitle: {
    marginBottom: 16,
    marginTop: 24,
  },
  categoriesContainer: {
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedRadioItem: {
    borderWidth: 2,
  },
  selectedRadioLabel: {
    color: theme.colors.primaryContainer,
    fontWeight: 'bold',
  },
  continueButton: {
    marginBottom: 40,
    width: '100%',
    height: 56,
  }
}); 
