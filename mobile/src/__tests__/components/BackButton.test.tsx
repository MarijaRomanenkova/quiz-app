import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BackButton } from '../../components/BackButton/BackButton';

describe('BackButton', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<BackButton onPress={jest.fn()} testID="back-button" />);
    expect(getByTestId('back-button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<BackButton onPress={onPress} testID="back-button" />);
    fireEvent.press(getByTestId('back-button'));
    expect(onPress).toHaveBeenCalled();
  });
}); 
