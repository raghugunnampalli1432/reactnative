import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  SignupScreen: undefined;
  OTPVerificationScreen: { emailOrPhone: string };
  FirstLastNameScreen: { emailOrPhone: string };
  DateOfBirthScreen: { firstName: string; lastName: string };
};

type OTPVerificationScreenRouteProp = RouteProp<RootStackParamList, 'OTPVerificationScreen'>;
type OTPVerificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OTPVerificationScreen'>;

type Props = {
  route: OTPVerificationScreenRouteProp;
  navigation: OTPVerificationScreenNavigationProp;
};

const OTPVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { emailOrPhone } = route.params;
  const [otp, setOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(20); // Initial timer value in seconds
  const [highlighted, setHighlighted] = useState<boolean>(false); // State to manage highlighting

  useEffect(() => {
    // Countdown logic
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Cleanup interval on unmount or timer reaching 0
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Highlight the input container for 2 seconds when the OTP input is focused
    if (otp.length === 6) {
      setHighlighted(true);
      setTimeout(() => setHighlighted(false), 2000);
    }
  }, [otp]);

  const handleVerifyPress = () => {
    if (otp.length === 6) {
      // Proceed to the next screen
      navigation.navigate('FirstLastNameScreen', { emailOrPhone });
    } else {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={[styles.innerContainer, highlighted && styles.highlighted]}>
        <Text style={styles.label}>Did you get our text?</Text>
        
        <View style={styles.inputContainer}>
          {/* Create 6 TextInput components for each digit */}
          {[...Array(6)].map((_, index) => (
            <TextInput
              key={index}
              style={[styles.input, otp.length === 6 && styles.inputFilled]}
              value={otp[index] || ''}
              onChangeText={(text) => {
                const newOtp = [...otp];
                newOtp[index] = text;
                setOtp(newOtp.join('').slice(0, 6)); // Ensure only 6 digits are kept
              }}
              maxLength={1}
              keyboardType="numeric"
            />
          ))}
        </View>
        <Button
          title="Verify"
          onPress={handleVerifyPress}
          color={otp.length === 6 ? 'purple' : undefined}
        />
        <Text style={styles.timer}>Timer: {timer} seconds</Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  inputFilled: {
    backgroundColor: '#e0e0e0', // Color for filled inputs
  },
  timer: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  highlighted: {
    backgroundColor: '#ffffcc', // Example background color for highlighting
  },
});

export default OTPVerificationScreen;
