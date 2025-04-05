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
const API_BASE_URL = 'https://yourucf.com/api';

type ForgotPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/request-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to request password reset');
      }

      Alert.alert(
        'Success',
        'If the email address is associated with an account, you will receive instructions to reset your password.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'Something went wrong. Please try again later.'
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
        <Text style={styles.title}>Reset Password</Text>
        
        <View style={styles.card}>
          <Text style={styles.description}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.textLightGray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.buttonText} />
            ) : (
              <Text style={styles.resetButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
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
  title: {
    color: Colors.textWhite,
    fontSize: FontSizes.title,
    fontFamily: 'Poppins_700Bold',
    marginBottom: Spacing.large,
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
  description: {
    color: Colors.textWhite,
    fontSize: FontSizes.regular,
    marginBottom: Spacing.large,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  input: {
    height: 50,
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.medium,
    paddingHorizontal: 15,
    color: Colors.textWhite,
    marginBottom: Spacing.medium,
  },
  resetButton: {
    backgroundColor: Colors.buttonBackground,
    borderRadius: BorderRadius.medium,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: Spacing.medium,
  },
  resetButtonText: {
    color: Colors.buttonText,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    fontSize: FontSizes.regular,
  },
  backButton: {
    marginTop: Spacing.medium,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.primaryGold,
    fontFamily: 'Poppins_400Regular',
    fontSize: FontSizes.small,
  },
});

export default ForgotPasswordScreen;