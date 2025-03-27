// screens/LoginScreen.tsx
import React, { useState, FC } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../App';
import { Colors } from '../constants/colors';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log('Login response:', data);
  
      if (response.ok) {
        // Login successful: navigate to Home screen
        navigation.replace('Home');
      } else {
        Alert.alert('Login Failed', data.error || 'Please try again');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome back, <Text style={styles.knight}>Knight!</Text></Text>
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchContainer} onPress={() => navigation.navigate('Register')}>
          <Text style={styles.switchText}>Don't have an account yet? <Text style={styles.signup}>Sign up</Text></Text>
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
    loginButton: {
      backgroundColor: Colors.primaryGold,
      borderRadius: 10,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 10,
    },
    loginButtonText: {
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

export default LoginScreen;
