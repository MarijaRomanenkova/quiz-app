import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, Button, Card, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigator/Navigator';
import { theme } from '../../theme';
import type { UserProfile } from '../../types';
import { mockCategories } from '../../data/mockCategories';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategory } from '../../store/categorySlice';
import Categories from '../../components/Categories/Categories';
import { RootState } from '../../store';

type WelcomeScreenProps = {
  route?: {
    params?: {
      userProfile?: UserProfile;
    };
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = ({ route }: WelcomeScreenProps) => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  
  // Get user from Redux state first, fallback to route params if available
  const userFromRedux = useSelector((state: RootState) => state.user);
  const userProfile = route?.params?.userProfile || userFromRedux;

  const handleCategoryPress = (categoryId: string) => {
    dispatch(setSelectedCategory(categoryId));
    navigation.navigate('Category', { categoryId });
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
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

  return (
    <Surface style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <Avatar.Text 
            size={64} 
            label={userProfile.name.charAt(0).toUpperCase()} 
          />
          <View style={styles.profileInfo}>
            <Text variant="headlineSmall">Welcome {userProfile.name}!</Text>
     
          </View>
        </Card.Content>
      </Card>

      <Text variant="titleLarge" style={styles.categoriesTitle}>
        Choose what to study:
      </Text>

      <View style={styles.categoriesContainer}>
        <Categories />
      </View>

      <Button 
        mode="outlined"
        style={styles.profileButton}
        onPress={handleProfilePress}
      >
        View Profile
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  paceText: {
    opacity: 0.7,
    marginTop: 4,
  },
  actionsContainer: {
    gap: 12,
  },
  button: {
    marginVertical: 4,
  },
  categoriesTitle: {
    marginBottom: 16,
    marginTop: 24,
  },
  categoriesContainer: {
    flex: 1,
    gap: 12,
  },
  categoryCard: {
    marginBottom: 8,
  },
  categoryDescription: {
    opacity: 0.7,
    marginTop: 4,
  },
  profileButton: {
    marginTop: 16,
  }
}); 
