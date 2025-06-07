import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { useAuth } from '../hooks/useAuth';

export const HomeScreen = () => {
  const { isLoading } = useProtectedRoute();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {user?.username}!</Text>
      {/* Add your home screen content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
}); 
