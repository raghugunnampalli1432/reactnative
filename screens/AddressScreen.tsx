import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker } from 'react-native';
import { RouteProp, StackNavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  SignupScreen: undefined;
  OTPVerificationScreen: { emailOrPhone: string };
  FirstLastNameScreen: { emailOrPhone: string };
  DateOfBirthScreen: { firstName: string; lastName: string };
  AddressScreen: { firstName: string; lastName: string; dateOfBirth: string };
};

type AddressScreenRouteProp = RouteProp<RootStackParamList, 'AddressScreen'>;
type AddressScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddressScreen'>;

type Props = {
  route: AddressScreenRouteProp;
  navigation: AddressScreenNavigationProp;
};

const AddressScreen: React.FC<Props> = ({ route, navigation }) => {
  const { firstName, lastName, dateOfBirth } = route.params;
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [aptSuiteUnit, setAptSuiteUnit] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>(''); // State dropdown value
  const [zipCode, setZipCode] = useState<string>('');
  
  const [errors, setErrors] = useState<{ streetAddress?: string; city?: string; state?: string; zipCode?: string }>({});

  // Determine if all required fields are filled to set button color
  const isFormFilled = 
    streetAddress.trim().length > 0 &&
    city.trim().length > 0 &&
    state.trim().length > 0 &&
    zipCode.trim().length > 0;

  const handleSubmit = () => {
    // Reset errors
    setErrors({});

    let hasError = false;
    const newErrors: typeof errors = {};

    // Validation
    if (streetAddress.trim().length === 0) {
      newErrors.streetAddress = 'Street address is required.';
      hasError = true;
    }
    if (city.trim().length === 0) {
      newErrors.city = 'City is required.';
      hasError = true;
    }
    if (state.trim().length === 0) {
      newErrors.state = 'State is required.';
      hasError = true;
    }
    if (zipCode.trim().length === 0 || !/^\d{5}$/.test(zipCode)) {
      newErrors.zipCode = 'Zip code is required and must be 5 digits.';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    // Handle address submission logic here
    console.log(`Address: ${streetAddress}, Apt/Suite/Unit: ${aptSuiteUnit}, City: ${city}, State: ${state}, Zip Code: ${zipCode}`);
    // Navigate to another screen or show a success message
    // navigation.navigate('NextScreen', { firstName, lastName, dateOfBirth, streetAddress, aptSuiteUnit, city, state, zipCode });
  };
  
  return (
    <View style={styles.container}>
         <Text style={styles.label}><b>Where should we send your card?</b></Text>
      <Text style={styles.label}>Street Address</Text>
      <TextInput
        style={[styles.input, errors.streetAddress && styles.errorInput]}
        value={streetAddress}
        onChangeText={setStreetAddress}
        placeholder="Street Address"
      />
      {errors.streetAddress && <Text style={styles.errorText}>{errors.streetAddress}</Text>}
      <Text style={styles.label}>Apt/Suite/Unit</Text>
      <TextInput
        style={styles.input}
        value={aptSuiteUnit}
        onChangeText={setAptSuiteUnit}
        placeholder="Apt/Suite/Unit"
      />
        <Text style={styles.label}>City</Text>
      <TextInput
        style={[styles.input, errors.city && styles.errorInput]}
        value={city}
        onChangeText={setCity}
        placeholder="City"
      />
      {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

      <Text style={styles.label}>State</Text>
      <Picker
        selectedValue={state}
        style={[styles.picker, errors.state && styles.errorPicker]}
        onValueChange={(itemValue) => setState(itemValue)}
      >
        <Picker.Item label="Select State" value="" />
        <Picker.Item label="California" value="CA" />
        <Picker.Item label="New York" value="NY" />
        <Picker.Item label="Texas" value="TX" />
        {/* Add more states as needed */}
      </Picker>
      {errors.state && <Text style={styles.errorText}>{errors.state}</Text>}
      <Text style={styles.label}>Zip Code</Text>
      <TextInput
        style={[styles.input, errors.zipCode && styles.errorInput]}
        value={zipCode}
        onChangeText={setZipCode}
        placeholder="Zip Code"
        keyboardType="numeric"
      />
      {errors.zipCode && <Text style={styles.errorText}>{errors.zipCode}</Text>}

      <Button
        title="Submit"
        onPress={handleSubmit}
        color={isFormFilled ? 'purple' : 'gray'} // Change button color based on whether form is filled
        disabled={!isFormFilled} // Disable the button if any required field is empty
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
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorPicker: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
});

export default AddressScreen;
