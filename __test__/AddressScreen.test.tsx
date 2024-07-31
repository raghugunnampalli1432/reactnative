import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import AddressScreen from '../AddressScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Adjust the import path as necessary

// Mock navigation prop
const Stack = createStackNavigator<RootStackParamList>();

const MockedNavigator = ({ initialParams }: { initialParams: any }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="AddressScreen"
        component={(props: any) => <AddressScreen {...props} />}
        initialParams={initialParams}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('AddressScreen', () => {
  const defaultParams = {
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2000-01-01',
  };

  test('renders correctly', () => {
    const { toJSON } = render(<MockedNavigator initialParams={defaultParams} />);
    expect(toJSON()).toMatchSnapshot();
  });

  test('displays validation errors for empty fields', () => {
    render(<MockedNavigator initialParams={defaultParams} />);

    fireEvent.press(screen.getByText('Submit'));

    expect(screen.getByText('Street address is required.')).toBeTruthy();
    expect(screen.getByText('City is required.')).toBeTruthy();
    expect(screen.getByText('State is required.')).toBeTruthy();
    expect(screen.getByText('Zip code is required and must be 5 digits.')).toBeTruthy();
  });

  test('displays validation error for incorrect zip code format', () => {
    render(<MockedNavigator initialParams={defaultParams} />);

    fireEvent.changeText(screen.getByPlaceholderText('Zip Code'), '123');
    fireEvent.press(screen.getByText('Submit'));

    expect(screen.getByText('Zip code is required and must be 5 digits.')).toBeTruthy();
  });

  test('does not display errors when form is correctly filled', () => {
    render(<MockedNavigator initialParams={defaultParams} />);

    fireEvent.changeText(screen.getByPlaceholderText('Street Address'), '123 Main St');
    fireEvent.changeText(screen.getByPlaceholderText('Apt/Suite/Unit'), 'Apt 4B');
    fireEvent.changeText(screen.getByPlaceholderText('City'), 'Anytown');
    fireEvent.changeText(screen.getByPlaceholderText('Zip Code'), '12345');
    fireEvent.valueChange(screen.getByTestId('state-picker'), 'CA');

    fireEvent.press(screen.getByText('Submit'));

    expect(screen.queryByText('Street address is required.')).toBeNull();
    expect(screen.queryByText('City is required.')).toBeNull();
    expect(screen.queryByText('State is required.')).toBeNull();
    expect(screen.queryByText('Zip code is required and must be 5 digits.')).toBeNull();
  });
});
