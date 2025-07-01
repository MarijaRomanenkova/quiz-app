import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TermsScreen } from '../../screens/Terms/TermsScreen';

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: jest.fn(),
  goBack: mockGoBack,
  push: jest.fn(),
  pop: jest.fn(),
  replace: jest.fn(),
};
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => mockNavigation,
}));

describe('TermsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders terms and conditions screen with title', () => {
    const { getByText } = render(<TermsScreen />);
    
    expect(getByText('Terms and Conditions')).toBeTruthy();
    expect(getByText('By using this app, you agree to our terms and conditions...')).toBeTruthy();
  });

  it('displays terms content', () => {
    const { getByText } = render(<TermsScreen />);
    
    const termsText = getByText('By using this app, you agree to our terms and conditions...');
    expect(termsText).toBeTruthy();
  });

  it('navigates back when back button is pressed', () => {
    const { getByText } = render(<TermsScreen />);
    
    const backButton = getByText('Back');
    fireEvent.press(backButton);
    
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('renders back button with correct text', () => {
    const { getByText } = render(<TermsScreen />);
    
    expect(getByText('Back')).toBeTruthy();
  });

  it('has proper screen structure', () => {
    const { getByText } = render(<TermsScreen />);
    
    // Check that all main elements are present
    expect(getByText('Terms and Conditions')).toBeTruthy();
    expect(getByText('By using this app, you agree to our terms and conditions...')).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
  });

  it('handles multiple back button presses', () => {
    const { getByText } = render(<TermsScreen />);
    
    const backButton = getByText('Back');
    
    // Press back button multiple times
    fireEvent.press(backButton);
    fireEvent.press(backButton);
    
    expect(mockGoBack).toHaveBeenCalledTimes(2);
  });
}); 
