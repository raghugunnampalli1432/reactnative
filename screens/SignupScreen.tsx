import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const SignupScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
  });
  const [isDetailsEntered, setIsDetailsEntered] = useState<boolean>(false); // State to track if details are entered

  const navigation = useNavigation();

  const validateEmail = (value: string) => {
    setEmail(value.trim());
    setIsDetailsEntered(false); // Reset state to gray button color
  };

  const validateMobileNumber = (value: string) => {
    setMobileNumber(value.trim());
    setIsDetailsEntered(false); // Reset state to gray button color
  };

  const validatePassword = (value: string) => {
    setPassword(value);

    const validations = {
      minLength: value.length >= 8,
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
    };

    setPasswordValidations(validations);
    setIsDetailsEntered(false); // Reset state to gray button color
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleNextPress = () => {
    if (email && mobileNumber && password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)) {
      navigation.navigate('OTPVerificationScreen', { email });
      setIsDetailsEntered(true); // Set state to purple button color
    } else {
      Alert.alert('Error', 'Please fill in all fields correctly.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/login.png')} style={styles.logo} />
      </View>

      {/* Paragraph */}
      <Text style={styles.paragraph}>
        Go for it. Applying for a
      </Text>

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={validateEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Mobile Number:</Text>
      <TextInput
        style={styles.input}
        value={mobileNumber}
        onChangeText={validateMobileNumber}
        placeholder="Enter your mobile number"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Password:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={password}
          onChangeText={validatePassword}
          placeholder="Enter your password"
          secureTextEntry={!isPasswordVisible}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.visibilityIcon}>
          <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={styles.validationContainer}>
        <Text style={[styles.validationText, passwordValidations.minLength ? styles.valid : styles.invalid]}>
          {passwordValidations.minLength ? '\u2713' : '\u2718'} Minimum 8 characters
        </Text>
        <Text style={[styles.validationText, passwordValidations.hasUpperCase ? styles.valid : styles.invalid]}>
          {passwordValidations.hasUpperCase ? '\u2713' : '\u2718'} At least one uppercase letter
        </Text>
        <Text style={[styles.validationText, passwordValidations.hasLowerCase ? styles.valid : styles.invalid]}>
          {passwordValidations.hasLowerCase ? '\u2713' : '\u2718'} At least one lowercase letter
        </Text>
        <Text style={[styles.validationText, passwordValidations.hasNumber ? styles.valid : styles.invalid]}>
          {passwordValidations.hasNumber ? '\u2713' : '\u2718'} At least one number
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.joinButton, isDetailsEntered ? styles.joinButtonPurple : null]}
        onPress={handleNextPress}
        disabled={isDetailsEntered} // Disable button after details are entered
      >
        <Text style={styles.joinButtonText}>Join Today</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16, // Added paddingHorizontal for edge spacing
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'right',
    marginBottom: 16,
    color: '#333',
    marginRight: 110,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
  },
  visibilityIcon: {
    padding: 10,
  },
  validationContainer: {
    marginBottom: 16,
  },
  validationText: {
    fontSize: 14,
    marginBottom: 5,
  },
  valid: {
    color: 'green',
  },
  invalid: {
    color: 'red',
  },
  joinButton: {
    backgroundColor: '#ccc', // Initial gray color
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 5,
    width: '100%', // Ensure button spans full width of container
  },
  joinButtonPurple: {
    backgroundColor: 'purple', // Updated purple color
  },
  joinButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SignupScreen;
