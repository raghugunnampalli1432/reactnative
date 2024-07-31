// NextScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  FirstLastNameScreen: undefined;
  DateOfBirthScreen: { firstName: string; lastName: string };
  NextScreen: { firstName: string; lastName: string; dateOfBirth: string };
};

type NextScreenRouteProp = RouteProp<RootStackParamList, 'NextScreen'>;
type Props = {
  route: NextScreenRouteProp;
};

const NextScreen: React.FC<Props> = ({ route }) => {
  const { firstName, lastName, dateOfBirth } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>First Name: {firstName}</Text>
      <Text style={styles.text}>Last Name: {lastName}</Text>
      <Text style={styles.text}>Date of Birth: {dateOfBirth}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default NextScreen;
