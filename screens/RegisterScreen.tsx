import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../App';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/Colors';
import { registerUser } from '../utils/api';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // pw validation
  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasSpecialChar = /[^\w\s]/.test(pass);
    
    return minLength && hasUpperCase && hasLowerCase && hasSpecialChar;
  };

  // email validation
  const validateEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 8 characters and include uppercase, lowercase, and special characters'
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser({
        firstName,
        lastName,
        username,
        email,
        password
      });

      Alert.alert(
        'Registration Successful',
        'Please check your email to verify your account before logging in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'Please try again with different credentials'
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
          Join us, <Text style={styles.knight}>Knight!</Text>
        </Text>
        
        <View style={styles.card}>
          <View style={styles.nameRow}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="First Name"
              placeholderTextColor={Colors.textLightGray}
              value={firstName}
              onChangeText={setFirstName}
            />
            
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Last Name"
              placeholderTextColor={Colors.textLightGray}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          
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

          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>Password must include:</Text>
            <View style={styles.requirementsItem}>
              <Text style={[
                styles.requirementText, 
                password.length >= 8 ? styles.requirementMet : styles.requirementNotMet
              ]}>
                • At least 8 characters
              </Text>
            </View>
            <View style={styles.requirementsItem}>
              <Text style={[
                styles.requirementText, 
                /[A-Z]/.test(password) ? styles.requirementMet : styles.requirementNotMet
              ]}>
                • At least 1 uppercase letter
              </Text>
            </View>
            <View style={styles.requirementsItem}>
              <Text style={[
                styles.requirementText, 
                /[a-z]/.test(password) ? styles.requirementMet : styles.requirementNotMet
              ]}>
                • At least 1 lowercase letter
              </Text>
            </View>
            <View style={styles.requirementsItem}>
              <Text style={[
                styles.requirementText, 
                /[^\w\s]/.test(password) ? styles.requirementMet : styles.requirementNotMet
              ]}>
                • At least 1 special character
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.registerButton} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.buttonText} />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.switchContainer} 
            onPress={() => navigation.navigate('Login')}
            disabled={isLoading}
          >
            <Text style={styles.switchText}>
              Already have an account? <Text style={styles.signin}>Login</Text>
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
    paddingBottom: Spacing.xlarge,
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
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  input: {
    height: 50,
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: 15,
    color: Colors.textWhite,
    marginBottom: Spacing.medium,
  },
  passwordRequirements: {
    marginBottom: Spacing.medium,
  },
  requirementsTitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: FontSizes.small,
    color: Colors.textWhite,
    marginBottom: 5,
  },
  requirementsItem: {
    marginLeft: 10,
    marginBottom: 2,
  },
  requirementText: {
    fontSize: FontSizes.small,
    fontFamily: 'Poppins_400Regular',
  },
  requirementMet: {
    color: Colors.completed,
  },
  requirementNotMet: {
    color: Colors.primaryGold,
  },
  registerButton: {
    backgroundColor: Colors.buttonBackground,
    borderRadius: BorderRadius.medium,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: Spacing.small,
  },
  registerButtonText: {
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
  signin: {
    color: Colors.primaryGold,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;