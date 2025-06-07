import { StyleSheet, View } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigator/Navigator';
import { theme } from '../../theme';
import { mockCategories } from '../../data/mockCategories';
import { Category } from '../../types';
import { useDispatch } from 'react-redux';
import { setSelectedCategory } from '../../store/categorySlice';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function Categories() {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

  const handleCategorySelect = (categoryId: string) => {
    dispatch(setSelectedCategory(categoryId));
    navigation.navigate('Category', { categoryId });
  };

  return (
    <Surface style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        What would you like to practice?
      </Text>
      <View style={styles.buttonsContainer}>
        {mockCategories.map((category) => (
          <Button
            key={category.categoryId}
            mode="contained-tonal"
            style={styles.categoryButton}
            labelStyle={styles.buttonLabel}
            onPress={() => handleCategorySelect(category.categoryId)}
          >
            {category.title}
          </Button>
        ))}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  categoryButton: {
    width: '47%', // slightly less than 50% to account for gap
    marginBottom: 8,
  },
  buttonLabel: {
    fontSize: 16,
    padding: 8,
  },
}); 
