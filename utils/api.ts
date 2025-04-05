import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://yourucf.com/api';

// Types for data structures
export interface Semester {
  _id: string;
  semester: string;
  year: number;
  courses: Course[];
}

export interface Course {
  courseId: {
    _id: string;
    courseCode: string;
    courseName: string;
    creditHours: number;
    description?: string;
  };
  status: 'Planned' | 'Ongoing' | 'Completed';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

// Basic authenticated fetch
export const authenticatedFetch = async (endpoint: string, options: any = {}) => {
  const token = await AsyncStorage.getItem('auth_token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  // Handle authentication errors
  if (response.status === 401 || response.status === 403) {
    // Clear invalid token
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
    throw new Error('Authentication failed. Please log in again.');
  }
  
  return response;
};

// User authentication functions
export const loginUser = async (username: string, password: string) => {
  try {
    console.log('Attempting login for user:', username);
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    console.log('Login response status:', response.status);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Don't store token here anymore - the AuthContext will handle that
    console.log('Login successful, token received');
    
    // Return the data for use in AuthContext
    return data;
  } catch (error) {
    console.error('Login error in API:', error);
    throw error;
  }
};

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Data fetching functions
export const fetchUserSemesters = async () => {
  try {
    // Get user data from AsyncStorage
    const userDataStr = await AsyncStorage.getItem('user_data');
    if (!userDataStr) {
      console.log('No user data found in AsyncStorage');
      throw new Error('User data not found');
    }
    
    const userData = JSON.parse(userDataStr);
    
    if (!userData.id) {
      console.log('No ID found in user data');
      throw new Error('User ID not found in stored data');
    }
    
    console.log('Fetching semesters for user ID:', userData.id);
    
    // Check if auth token exists
    const token = await AsyncStorage.getItem('auth_token');
    if (!token) {
      console.log('No auth token found in AsyncStorage');
      throw new Error('Authentication token not found');
    }
    
    // Make the API request
    const response = await fetch(`${API_BASE_URL}/plans/user/${userData.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Semester fetch response status:', response.status);
    
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `Server returned ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // Ignore JSON parsing errors
      }
      
      console.log('API Error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Semester data received, keys:', Object.keys(data));
    
    if (!data.semesters) {
      console.log('No semesters property in response data');
      return [];
    }
    
    return data.semesters;
  } catch (error) {
    console.error('Error fetching semesters:', error);
    throw new Error('Failed to fetch semesters');
  }
};
