import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Text } from 'react-native-paper';
import { theme } from '../../theme';
import { Button } from '../Button/Button';

interface CustomModalProps {
  visible: boolean;
  onDismiss: () => void;
  title: string;
  message: string;
  primaryButtonText: string;
  onPrimaryButtonPress: () => void;
  secondaryButtonText?: string;
  onSecondaryButtonPress?: () => void;
}

export const CustomModal = ({
  visible,
  onDismiss,
  title,
  message,
  primaryButtonText,
  onPrimaryButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
}: CustomModalProps) => {
  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}
    >
      <Text variant="headlineMedium" style={styles.modalTitle}>
        {title}
      </Text>
      <Text variant="bodyLarge" style={styles.modalText}>
        {message}
      </Text>
      <View style={styles.modalButtons}>
        {secondaryButtonText && onSecondaryButtonPress && (
          <Button
            mode="outlined"
            onPress={onSecondaryButtonPress}
            style={styles.modalButton}
            variant="secondary"
          >
            {secondaryButtonText}
          </Button>
        )}
        <Button
          mode="contained"
          onPress={onPrimaryButtonPress}
          style={styles.modalButton}
          variant="primary"
        >
          {primaryButtonText}
        </Button>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 24,
    margin: 24,
    borderRadius: 20,
    backgroundColor: '#EDE7FF',
  },
  modalTitle: {
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalText: {
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  modalButton: {
    flex: 1,
  },
}); 
