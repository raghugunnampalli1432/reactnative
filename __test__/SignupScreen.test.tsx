// SignupScreen.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignupScreen from '../screens/SignupScreen';
import { Alert } from 'react-native';

// Mocking navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('<SignupScreen />', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<SignupScreen />);
    
    expect(getByText('Join Today')).toBeDefined();
    expect(getByPlaceholderText('Enter your email')).toBeDefined();
    expect(getByPlaceholderText('Enter your mobile number')).toBeDefined();
    expect(getByPlaceholderText('Enter your password')).toBeDefined();
  });

  it('validates email input', async () => {
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    fireEvent.changeText(emailInput, 'invalid-email');

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields correctly.');
    });
  });

  it('validates mobile number input', async () => {
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);

    const mobileInput = getByPlaceholderText('Enter your mobile number');
    fireEvent.changeText(mobileInput, '123');

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields correctly.');
    });
  });

  it('validates password input', async () => {
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);

    const passwordInput = getByPlaceholderText('Enter your password');
    fireEvent.changeText(passwordInput, 'weak');

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please fill in all fields correctly.');
    });
  });

  it('toggles password visibility', () => {
    const { getByPlaceholderText, getByTestId } = render(<SignupScreen />);

    const passwordInput = getByPlaceholderText('Enter your password');
    const visibilityIcon = getByTestId('visibility-icon');

    fireEvent.press(visibilityIcon); // Toggle visibility once
    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(visibilityIcon); // Toggle visibility again
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('navigates on valid details entered', async () => {
    const { getByPlaceholderText, getByText } = render(<SignupScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    const mobileInput = getByPlaceholderText('Enter your mobile number');
    const passwordInput = getByPlaceholderText('Enter your password');
    const joinButton = getByText('Join Today');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(mobileInput, '1234567890');
    fireEvent.changeText(passwordInput, 'StrongPassword1');
    fireEvent.press(joinButton);

    await waitFor(() => {
      expect(Alert.alert).not.toHaveBeenCalled(); // No error alert shown
      expect(Alert.alert).toHaveBeenCalledTimes(0); // No error alert shown
      expect(Alert.alert).not.toHaveBeenCalledWith('Error', 'Please fill in all fields correctly.'); // No error alert shown
      expect(navigator).toHaveBeenCalledWith('OTPVerificationScreen', { email: 'test@example.com' });
    });
  });
});
