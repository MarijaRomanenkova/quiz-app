import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CategoriesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      {/* Add your categories list here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
}); 
