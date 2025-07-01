import React from 'react';
import { render } from '@testing-library/react-native';
import { ScoreCircle } from '../../../components/Results/ScoreCircle';

describe('ScoreCircle', () => {
  it('renders correctly with score information', () => {
    const { getByText } = render(<ScoreCircle score={8} total={10} />);

    expect(getByText('Your score is')).toBeTruthy();
    expect(getByText('8/10')).toBeTruthy();
  });

  it('renders with different score values', () => {
    const { getByText } = render(<ScoreCircle score={15} total={20} />);

    expect(getByText('Your score is')).toBeTruthy();
    expect(getByText('15/20')).toBeTruthy();
  });

  it('renders with perfect score', () => {
    const { getByText } = render(<ScoreCircle score={10} total={10} />);

    expect(getByText('Your score is')).toBeTruthy();
    expect(getByText('10/10')).toBeTruthy();
  });

  it('renders with zero score', () => {
    const { getByText } = render(<ScoreCircle score={0} total={5} />);

    expect(getByText('Your score is')).toBeTruthy();
    expect(getByText('0/5')).toBeTruthy();
  });
}); 
