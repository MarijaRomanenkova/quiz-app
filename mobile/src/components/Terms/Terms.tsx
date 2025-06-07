import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { theme } from '../../theme';

export default function Terms() {
  return (
    <Surface style={styles.container}>
      <ScrollView style={styles.scroll}>
        <Text variant="headlineMedium" style={styles.title}>
          Terms and Conditions
        </Text>
        <Text style={styles.text}>
          {/* Add your terms text here */}
          By using this application, you agree to...
        </Text>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  text: {
    lineHeight: 24,
  },
}); 
