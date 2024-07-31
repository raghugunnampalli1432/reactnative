// FirstLastNameScreen.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import FirstLastNameScreen from '../screens/FirstLastNameScreen';
import { Alert } from 'react-native';

// Mocking navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('<FirstLastNameScreen />', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<FirstLastNameScreen navigation={undefined} />);

    expect(getByText('First Name:')).toBeDefined();
    expect(getByPlaceholderText('Enter your first name')).toBeDefined();
    expect(getByText('Last Name:')).toBeDefined();
    expect(getByPlaceholderText('Enter your last name')).toBeDefined();
    expect(getByText('Next')).toBeDefined();
  });

  it('updates first name input correctly', () => {
    const { getByPlaceholderText } = render(<FirstLastNameScreen navigation={undefined} />);

    const firstNameInput = getByPlaceholderText('Enter your first name');
    fireEvent.changeText(firstNameInput, 'John');

    expect(firstNameInput.props.value).toBe('John');
  });

  it('updates last name input correctly', () => {
    const { getByPlaceholderText } = render(<FirstLastNameScreen navigation={undefined} />);

    const lastNameInput = getByPlaceholderText('Enter your last name');
    fireEvent.changeText(lastNameInput, 'Doe');

    expect(lastNameInput.props.value).toBe('Doe');
  });

  it('shows error for short first name', async () => {
    const { getByText, getByPlaceholderText } = render(<FirstLastNameScreen navigation={undefined} />);

    const firstNameInput = getByPlaceholderText('Enter your first name');
    fireEvent.changeText(firstNameInput, 'John');

    fireEvent.press(getByText('Next'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'First name must be at least 6 characters long.');
    });
  });

  it('shows error for short last name', async () => {
    const { getByText, getByPlaceholderText } = render(<FirstLastNameScreen navigation={undefined} />);

    const lastNameInput = getByPlaceholderText('Enter your last name');
    fireEvent.changeText(lastNameInput, 'Doe');

    fireEvent.press(getByText('Next'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Last name must be at least 6 characters long.');
    });
  });

  it('shows error for empty first name', async () => {
    const { getByText } = render(<FirstLastNameScreen navigation={undefined} />);

    fireEvent.press(getByText('Next'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'First name and last name cannot be empty.');
    });
  });

  it('navigates on valid first and last names', async () => {
    const navigate = jest.fn();
    const { getByPlaceholderText, getByText } = render(<FirstLastNameScreen navigation={{ navigate }} />);

    fireEvent.changeText(getByPlaceholderText('Enter your first name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Enter your last name'), 'Doe');

    fireEvent.press(getByText('Next'));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('DateOfBirthScreen', { firstName: 'John', lastName: 'Doe' });
    });
  });
});
