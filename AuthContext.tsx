// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, userData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load token when component mounts
    async function loadStoredData() {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const userData = await AsyncStorage.getItem('user_data');
        
        if (token && userData) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading auth data', error);
      } finally {
        setLoading(false);
      }
    }

    loadStoredData();
  }, []);

  const login = async (token: string, userData: any) => {
    try {
      console.log('Storing auth data:', { token, userData });
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error during login', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Clearing auth data');
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}