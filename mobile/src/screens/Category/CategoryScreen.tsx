import React from 'react';
import { StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { theme } from '../../theme';
import Categories from '../../components/Categories/Categories';

export const CategoryScreen = () => {
  return (
    <Surface style={styles.container}>
      <Categories />
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}); 
