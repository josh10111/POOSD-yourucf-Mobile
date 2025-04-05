import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../App';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/Colors';
import { loginUser } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../AuthContext';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);

    try {
      const userData = await loginUser(username, password);
      console.log('Login successful, response data:', userData);
      
      // Extract the userId from the token or response data
      let userId;
      if (userData.token) {
        // Parse JWT token to get user ID if it's stored there
        try {
          const tokenParts = userData.token.split('.');
          if (tokenParts.length === 3) {
            const tokenPayload = tokenParts[1];
            // Base64 decode and parse JSON
            const decodedPayload = JSON.parse(
              decodeURIComponent(
                atob(tokenPayload.replace(/-/g, '+').replace(/_/g, '/'))
                  .split('')
                  .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                  .join('')
              )
            );
            userId = decodedPayload.id;
            console.log('User ID extracted from token:', userId);
          }
        } catch (e) {
          console.error('Error parsing token:', e);
        }
      }
      
      // Fallback to direct ID in the response
      if (!userId) {
        userId = userData.id || userData.userId || userData._id;
        console.log('User ID from response:', userId);
      }
      
      if (!userId) {
        throw new Error('Could not extract user ID from login response');
      }
      
      // Use the login function from AuthContext
      console.log('Calling AuthContext login with token and user ID:', userId);
      await login(userData.token, { id: userId });
      
      // No need for navigation operations - App.tsx will handle it
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.message || 'Please check your credentials and try again'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.welcome}>
          Welcome back, <Text style={styles.knight}>Knight!</Text>
        </Text>
        
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={Colors.textLightGray}
            value={username}
            onChangeText={setUsername}
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

          <TouchableOpacity 
            style={styles.loginButton} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.buttonText} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchContainer} 
            onPress={() => navigation.navigate('Register')}
            disabled={isLoading}
          >
            <Text style={styles.switchText}>
              Don't have an account yet? <Text style={styles.signup}>Sign up</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.forgotPasswordContainer} 
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.large,
  },
  welcome: {
    color: Colors.textWhite,
    fontSize: FontSizes.title,
    fontFamily: 'Poppins_700Bold',
    marginBottom: Spacing.large,
  },
  knight: {
    color: Colors.primaryGold,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.large,
    padding: Spacing.large,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    height: 50,
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: 15,
    color: Colors.textWhite,
    marginBottom: Spacing.medium,
  },
  loginButton: {
    backgroundColor: Colors.buttonBackground,
    borderRadius: BorderRadius.medium,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: Spacing.medium,
  },
  loginButtonText: {
    color: Colors.buttonText,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    fontSize: FontSizes.regular,
  },
  switchContainer: {
    marginTop: Spacing.medium,
    alignItems: 'center',
  },
  switchText: {
    color: Colors.textWhite,
    fontFamily: 'Poppins_400Regular',
    fontSize: FontSizes.small,
  },
  signup: {
    color: Colors.primaryGold,
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    marginTop: Spacing.small,
    marginBottom: Spacing.medium,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: Colors.primaryGold,
    fontFamily: 'Poppins_400Regular',
    fontSize: FontSizes.small,
  },
});

export default LoginScreen;