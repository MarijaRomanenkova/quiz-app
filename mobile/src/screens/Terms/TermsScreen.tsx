import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Surface, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { theme } from '../../theme';
import { buttonStyles, containerStyles, textStyles } from '../../styles/components.styles';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Terms'>;

export const TermsScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <Surface style={[styles.container, containerStyles.screen]}>
      <Text variant="headlineMedium" style={[textStyles.title, styles.title]}>
        Terms and Conditions
      </Text>
      <Text style={styles.termsText}>
        By using this app, you agree to our terms and conditions...
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.goBack()}
        style={[buttonStyles.primary, buttonStyles.withMargin]}
      >
        Back
      </Button>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryContainer,
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  termsText: {
    marginVertical: 24,
    lineHeight: 24,
  },
}); 
