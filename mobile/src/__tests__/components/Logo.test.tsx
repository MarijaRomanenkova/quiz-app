import React from 'react';
import { render } from '@testing-library/react-native';
import { Logo } from '../../components/Logo/Logo';

describe('Logo', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Logo />);
    expect(getByTestId('logo')).toBeTruthy();
  });
}); 
