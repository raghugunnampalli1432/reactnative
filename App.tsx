// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignupScreen from './screens/SignupScreen';
import OTPVerificationScreen from './screens/OTPVerificationScreen';
import FirstLastNameScreen from './screens/FirstLastNameScreen';
import DateOfBirthScreen from './screens/DateOfBirthScreen';
import AddressScreen from './screens/AddressScreen';
// Import other screens as needed

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignupScreen">
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="OTPVerificationScreen" component={OTPVerificationScreen} />
        <Stack.Screen name="FirstLastNameScreen" component={FirstLastNameScreen} />
        <Stack.Screen name="DateOfBirthScreen" component={DateOfBirthScreen} />
        <Stack.Screen name='AddressScreen' component={AddressScreen}/>
    
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
