// DateOfBirthScreen.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DateOfBirthScreen from '../screens/DateOfBirthScreen';
import { Alert } from 'react-native';

// Mocking navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('<DateOfBirthScreen />', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<DateOfBirthScreen route={{ params: { firstName: 'John', lastName: 'Doe' } }} />);

    expect(getByText("What's your date of birth?")).toBeDefined();
    expect(getByText('Date of Birth (YYYY-MM-DD):')).toBeDefined();
    expect(getByPlaceholderText('Enter your date of birth')).toBeDefined();
    expect(getByText('Next')).toBeDefined();
  });

  it('updates date of birth input correctly', () => {
    const { getByPlaceholderText } = render(<DateOfBirthScreen route={{ params: { firstName: 'John', lastName: 'Doe' } }} />);

    const dobInput = getByPlaceholderText('Enter your date of birth');
    fireEvent.changeText(dobInput, '2000-01-01');

    expect(dobInput.props.value).toBe('2000-01-01');
  });

  it('shows error for invalid date format', async () => {
    const { getByText, getByPlaceholderText } = render(<DateOfBirthScreen route={{ params: { firstName: 'John', lastName: 'Doe' } }} />);

    fireEvent.changeText(getByPlaceholderText('Enter your date of birth'), '01/01/2000');
    fireEvent.press(getByText('Next'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a date in YYYY-MM-DD format.');
    });
  });

  it('shows error for under 18 years old', async () => {
    const { getByText, getByPlaceholderText } = render(<DateOfBirthScreen route={{ params: { firstName: 'John', lastName: 'Doe' } }} />);

    fireEvent.changeText(getByPlaceholderText('Enter your date of birth'), '2010-01-01');
    fireEvent.press(getByText('Next'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'You must be at least 18 years old.');
    });
  });

  it('shows error for over 120 years old', async () => {
    const { getByText, getByPlaceholderText } = render(<DateOfBirthScreen route={{ params: { firstName: 'John', lastName: 'Doe' } }} />);

    fireEvent.changeText(getByPlaceholderText('Enter your date of birth'), '1900-01-01');
    fireEvent.press(getByText('Next'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'You must be 120 years old or younger.');
    });
  });

  it('navigates on valid date of birth', async () => {
    const navigate = jest.fn();
    const { getByPlaceholderText, getByText } = render(<DateOfBirthScreen navigation={{ navigate }} route={{ params: { firstName: 'John', lastName: 'Doe' } }} />);

    fireEvent.changeText(getByPlaceholderText('Enter your date of birth'), '1990-01-01');
    fireEvent.press(getByText('Next'));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('NextScreen', { firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01' });
    });
  });
});
