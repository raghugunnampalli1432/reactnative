// OTPVerificationScreen.test.tsx

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import { Alert } from 'react-native';

// Mocking navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

describe('<OTPVerificationScreen />', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<OTPVerificationScreen route={{ params: { emailOrPhone: 'test@example.com' } }} />);

    expect(getByText('Did you get our text?')).toBeDefined();
    expect(getByPlaceholderText('0')).toBeDefined(); // Checking for the first input
    expect(getByPlaceholderText('5')).toBeDefined(); // Checking for the last input
    expect(getByText('Verify')).toBeDefined();
    expect(getByText('Timer:')).toBeDefined();
  });

  it('updates OTP input correctly', async () => {
    const { getByPlaceholderText } = render(<OTPVerificationScreen route={{ params: { emailOrPhone: 'test@example.com' } }} />);

    const firstInput = getByPlaceholderText('0');
    fireEvent.changeText(firstInput, '1');

    expect(firstInput.props.value).toBe('1');
  });

  it('highlights input container when OTP is filled', async () => {
    const { getByPlaceholderText, getByText, findByTestId } = render(<OTPVerificationScreen route={{ params: { emailOrPhone: 'test@example.com' } }} />);

    const inputs = await findByTestId('otp-input-container');
    expect(inputs.props.style).not.toContain({ backgroundColor: '#e0e0e0' });

    fireEvent.changeText(getByPlaceholderText('0'), '1');
    fireEvent.changeText(getByPlaceholderText('1'), '2');
    fireEvent.changeText(getByPlaceholderText('2'), '3');
    fireEvent.changeText(getByPlaceholderText('3'), '4');
    fireEvent.changeText(getByPlaceholderText('4'), '5');
    fireEvent.changeText(getByPlaceholderText('5'), '6');

    expect(inputs.props.style).toContain({ backgroundColor: '#e0e0e0' });
  });

  it('navigates on valid OTP entry', async () => {
    const navigate = jest.fn();
    const { getByPlaceholderText, getByText } = render(<OTPVerificationScreen route={{ params: { emailOrPhone: 'test@example.com' }, navigation: { navigate } }} />);

    fireEvent.changeText(getByPlaceholderText('0'), '1');
    fireEvent.changeText(getByPlaceholderText('1'), '2');
    fireEvent.changeText(getByPlaceholderText('2'), '3');
    fireEvent.changeText(getByPlaceholderText('3'), '4');
    fireEvent.changeText(getByPlaceholderText('4'), '5');
    fireEvent.changeText(getByPlaceholderText('5'), '6');

    fireEvent.press(getByText('Verify'));

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('FirstLastNameScreen', { emailOrPhone: 'test@example.com' });
    });
  });

  it('shows error on invalid OTP entry', async () => {
    const { getByText } = render(<OTPVerificationScreen route={{ params: { emailOrPhone: 'test@example.com' } }} />);

    fireEvent.changeText(getByText('0'), '1');

    fireEvent.press(getByText('Verify'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter a valid 6-digit OTP.');
    });
  });
});
