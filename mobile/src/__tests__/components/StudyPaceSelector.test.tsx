import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StudyPaceSelector } from '../../components/StudyPaceSelector/StudyPaceSelector';

describe('StudyPaceSelector', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(
      <StudyPaceSelector currentPaceId={1} onPaceChange={jest.fn()} />
    );
    expect(getByTestId('study-pace-selector')).toBeTruthy();
  });

  it('calls onPaceChange when a pace is selected', () => {
    const onPaceChange = jest.fn();
    const { getByTestId, getByText } = render(
      <StudyPaceSelector currentPaceId={1} onPaceChange={onPaceChange} />
    );
    fireEvent.press(getByText('Moderate'));
    expect(onPaceChange).toHaveBeenCalled();
  });
}); 
