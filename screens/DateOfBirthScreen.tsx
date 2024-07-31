import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';

type RootStackParamList = {
  SignupScreen: undefined;
  OTPVerificationScreen: { emailOrPhone: string };
  FirstLastNameScreen: { emailOrPhone: string };
  DateOfBirthScreen: { firstName: string; lastName: string };
};

type DateOfBirthScreenRouteProp = RouteProp<RootStackParamList, 'DateOfBirthScreen'>;
type DateOfBirthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DateOfBirthScreen'>;

type Props = {
  route: DateOfBirthScreenRouteProp;
  navigation: DateOfBirthScreenNavigationProp;
};

const DateOfBirthScreen: React.FC<Props> = ({ route, navigation }) => {
  const { firstName, lastName } = route.params;
  const [dateOfBirth, setDateOfBirth] = useState<string>('');
  const [isDateValid, setIsDateValid] = useState<boolean>(false);

  const handleDateOfBirthChange = (text: string) => {
    setDateOfBirth(text);
    setIsDateValid(/^(\d{4})-(\d{2})-(\d{2})$/.test(text)); // Check if the entered date is in YYYY-MM-DD format
  };

  const handleNextPress = () => {
    if (!isDateValid) {
      Alert.alert('Error', 'Please enter a date in YYYY-MM-DD format.');
      return;
    }

    const birthDate = moment(dateOfBirth, 'YYYY-MM-DD');
    const age = moment().diff(birthDate, 'years');

    if (!birthDate.isValid()) {
      Alert.alert('Error', 'Please enter a valid date.');
      return;
    }
    if (age < 18) {
      Alert.alert('Error', 'You must be at least 18 years old.');
      return;
    }
    if (age > 120) {
      Alert.alert('Error', 'You must be 120 years old or younger.');
      return;
    }

    // Navigate to the next screen or handle the next action
    navigation.navigate('NextScreen', { firstName, lastName, dateOfBirth });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>What's your date of birth?</Text>
      <Text style={styles.label}>Date of Birth (YYYY-MM-DD):</Text>
      <TextInput
        style={styles.input}
        value={dateOfBirth}
        onChangeText={handleDateOfBirthChange}
        placeholder="Enter your date of birth"
      />
      <Button
        title="Next"
        onPress={handleNextPress}
        disabled={!isDateValid}
        color={isDateValid ? 'purple' : undefined} // Set button color to purple when date is valid
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
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default DateOfBirthScreen;
