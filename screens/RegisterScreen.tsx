// screens/RegisterScreen.tsx
import React, { useState, FC } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../App';
import { Colors } from '../constants/colors';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.253:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Register response:', data);

      if (response.ok) {
        Alert.alert('Success', data.message, [
          { text: 'OK', onPress: () => navigation.replace('Login') },
        ]);
      } else {
        Alert.alert('Registration Failed', data.error);
      }
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Join us, <Text style={styles.knight}>Knight!</Text></Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.textLightGray}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.textLightGray}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={Colors.textLightGray}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchContainer} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.switchText}>Already have an account? <Text style={styles.signup}>Login</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    welcome: {
        color: Colors.textWhite,
        fontSize: 28,
        fontFamily: 'Poppins_700Bold',
        marginBottom: 20,
      },
    knight: {
      color: Colors.primaryGold,
    },
    card: {
      width: '100%',
      backgroundColor: Colors.cardBackground,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5,
    },
    input: {
      height: 50,
      backgroundColor: '#ffffff15',
      borderRadius: 10,
      paddingHorizontal: 15,
      color: Colors.textWhite,
      marginBottom: 15,
    },
    registerButton: {
      backgroundColor: Colors.primaryGold,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 10,
    },
    registerButtonText: {
        color: Colors.background,
        fontWeight: 'bold',
        fontFamily: 'Poppins_700Bold',
        fontSize: 16,
      },
    switchContainer: {
      marginTop: 15,
      alignItems: 'center',
    },
    switchText: {
        color: Colors.textWhite,
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
      },
    signup: {
      color: Colors.primaryGold,
      fontWeight: 'bold',
    },
  });

export default RegisterScreen;
