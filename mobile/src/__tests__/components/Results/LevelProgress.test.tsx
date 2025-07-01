import React from 'react';
import { render } from '@testing-library/react-native';
import { LevelProgress } from '../../../components/Results/LevelProgress';

describe('LevelProgress', () => {
  it('renders correctly with level information', () => {
    const { getByText } = render(
      <LevelProgress
        level="Beginner"
        completedTopics={3}
        totalTopics={5}
        percentage={60}
      />
    );

    expect(getByText('Level')).toBeTruthy();
    expect(getByText('60%')).toBeTruthy();
    expect(getByText('Beginner')).toBeTruthy();
  });

  it('renders with different level and percentage', () => {
    const { getByText } = render(
      <LevelProgress
        level="Advanced"
        completedTopics={8}
        totalTopics={10}
        percentage={80}
      />
    );

    expect(getByText('Level')).toBeTruthy();
    expect(getByText('80%')).toBeTruthy();
    expect(getByText('Advanced')).toBeTruthy();
  });

  it('renders with 0% completion', () => {
    const { getByText } = render(
      <LevelProgress
        level="Intermediate"
        completedTopics={0}
        totalTopics={5}
        percentage={0}
      />
    );

    expect(getByText('Level')).toBeTruthy();
    expect(getByText('0%')).toBeTruthy();
    expect(getByText('Intermediate')).toBeTruthy();
  });
}); 
