import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CustomModal } from '../../components/Modal/CustomModal';

describe('CustomModal', () => {
  it('renders when visible', () => {
    const { getByTestId } = render(
      <CustomModal
        visible={true}
        onDismiss={jest.fn()}
        title="Test Title"
        message="Test Message"
        primaryButtonText="OK"
        onPrimaryButtonPress={jest.fn()}
      />
    );
    expect(getByTestId('custom-modal')).toBeTruthy();
  });

  it('calls onPrimaryButtonPress when primary button pressed', () => {
    const onPrimaryButtonPress = jest.fn();
    const { getByTestId } = render(
      <CustomModal
        visible={true}
        onDismiss={jest.fn()}
        title="Test Title"
        message="Test Message"
        primaryButtonText="OK"
        onPrimaryButtonPress={onPrimaryButtonPress}
      />
    );
    fireEvent.press(getByTestId('modal-primary-button'));
    expect(onPrimaryButtonPress).toHaveBeenCalled();
  });

  it('calls onSecondaryButtonPress when secondary button pressed', () => {
    const onSecondaryButtonPress = jest.fn();
    const { getByTestId } = render(
      <CustomModal
        visible={true}
        onDismiss={jest.fn()}
        title="Test Title"
        message="Test Message"
        primaryButtonText="OK"
        onPrimaryButtonPress={jest.fn()}
        secondaryButtonText="Cancel"
        onSecondaryButtonPress={onSecondaryButtonPress}
      />
    );
    fireEvent.press(getByTestId('modal-secondary-button'));
    expect(onSecondaryButtonPress).toHaveBeenCalled();
  });
}); 
