import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  SignupScreen: undefined;
  OTPVerificationScreen: { emailOrPhone: string };
  FirstLastNameScreen: { emailOrPhone: string };
  DateOfBirthScreen: { firstName: string; lastName: string };
};

type FirstLastNameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FirstLastNameScreen'>;

type Props = {
  navigation: FirstLastNameScreenNavigationProp;
};

const FirstLastNameScreen: React.FC<Props> = ({ navigation }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');

  const handleNextPress = () => {
    if (firstName.length < 6) {
      Alert.alert('Error', 'First name must be at least 6 characters long.');
      return;
    }
    if (lastName.length < 6) {
      Alert.alert('Error', 'Last name must be at least 6 characters long.');
      return;
    }
    if (firstName.trim() === '' || lastName.trim() === '') {
      Alert.alert('Error', 'First name and last name cannot be empty.');
      return;
    }

    // Navigate to the DateOfBirthScreen with firstName and lastName params
    navigation.navigate('DateOfBirthScreen', { firstName, lastName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name:</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter your first name"
      />
      {firstName.length < 6 && firstName.trim() !== '' && (
        <Text style={styles.errorText}>First name must be at least 6 characters long.</Text>
      )}
      <Text style={styles.label}>Last Name:</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter your last name"
      />
      {lastName.length < 6 && lastName.trim() !== '' && (
        <Text style={styles.errorText}>Last name must be at least 6 characters long.</Text>
      )}
      <Button
        title="Next"
        onPress={handleNextPress}
        disabled={firstName.trim() === '' || lastName.trim() === ''}
        color={firstName.trim() !== '' && lastName.trim() !== '' ? 'purple' : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 8,
  },
});

export default FirstLastNameScreen;
