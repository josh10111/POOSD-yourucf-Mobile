import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, SafeAreaView, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../App';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/Colors';
import { fetchUserSemesters, Semester, Course } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../AuthContext';

type HomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { logout } = useAuth();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSemesters = async () => {
    try {
      setIsLoading(true);
      
      // Check user data
      const userDataStr = await AsyncStorage.getItem('user_data');
      const token = await AsyncStorage.getItem('auth_token');
      
      console.log('User data in AsyncStorage:', userDataStr);
      console.log('Token exists:', !!token);
      
      if (!userDataStr || !token) {
        console.log('No user data or token found, logging out');
        await logout();
        return;
      }
      
      const userData = JSON.parse(userDataStr);
      console.log('Parsed user data:', userData);
      
      if (!userData.id) {
        console.log('No user ID found in stored data, logging out');
        await logout();
        return;
      }
      
      console.log('Fetching semesters for user ID:', userData.id);
      const semestersData = await fetchUserSemesters();
      console.log('Semesters fetched successfully:', semestersData.length);
      
      // Sort semesters by year and then by season (Spring, Summer, Fall)
      const seasonOrder: Record<string, number> = {
        'Spring': 0,
        'Summer': 1,
        'Fall': 2
      };
      
      const sortedSemesters = [...semestersData].sort((a, b) => {
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        return seasonOrder[a.semester] - seasonOrder[b.semester];
      });
      
      setSemesters(sortedSemesters);
    } catch (error: any) {
      console.error('Error loading semesters:', error);
      
      if (error.message) {
        console.log('Error message:', error.message);
      }
      
      // If error is authentication-related, log out
      if (error.message && (
          error.message.includes('token') || 
          error.message.includes('user') ||
          error.message.includes('auth'))) {
        console.log('Authentication error detected, logging out');
        await logout();
      } else {
        Alert.alert('Error', 'Failed to load your semester data. Please try again later.');
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSemesters();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSemesters();
  };
  
  const handleLogout = async () => {
    try {
      // Use the logout function from AuthContext
      await logout();
      // No need for navigation - App.tsx will handle it
    } catch (error) {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return Colors.completed;
      case 'Ongoing':
        return Colors.ongoing;
      case 'Planned':
      default:
        return Colors.planned;
    }
  };

  const renderCourseItem = (course: Course) => {
    const statusColor = getStatusColor(course.status);
    
    return (
      <View key={course.courseId._id} style={styles.courseItem}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseCode}>{course.courseId.courseCode}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{course.status}</Text>
          </View>
        </View>
        
        <Text style={styles.courseName}>{course.courseId.courseName}</Text>
        
        <View style={styles.creditContainer}>
          <Text style={styles.creditText}>
            {course.courseId.creditHours} {course.courseId.creditHours === 1 ? 'Credit' : 'Credits'}
          </Text>
        </View>
      </View>
    );
  };

  const renderSemesterCard = (semester: Semester) => {
    return (
      <View key={semester._id} style={styles.semesterCard}>
        <View style={styles.semesterHeader}>
          <Text style={styles.semesterTitle}>
            {semester.semester} {semester.year}
          </Text>
        </View>
        
        <View style={styles.coursesList}>
          {semester.courses && semester.courses.length > 0 ? (
            semester.courses.map(course => renderCourseItem(course))
          ) : (
            <Text style={styles.noCourses}>No courses in this semester</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcome}>
            <Text style={styles.yourUCF}>yourUCF</Text> Mobile
          </Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.subtitle}>Your Path to Graduation</Text>
        
        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primaryGold} />
            <Text style={styles.loadingText}>Loading your semesters...</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[Colors.primaryGold]}
                tintColor={Colors.primaryGold}
              />
            }
          >
            {semesters.length > 0 ? (
              semesters.map(semester => renderSemesterCard(semester))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No semesters found. Once you create a plan in the web app, your semesters will appear here.
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: Spacing.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.medium,
    marginBottom: Spacing.small,
  },
  welcome: {
    fontSize: FontSizes.title,
    color: Colors.textWhite,
    fontFamily: 'Poppins_700Bold',
  },
  yourUCF: {
    color: Colors.primaryGold,
  },
  subtitle: {
    fontSize: FontSizes.regular,
    color: Colors.textLightGray,
    marginBottom: Spacing.large,
    fontFamily: 'Poppins_400Regular',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xlarge,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textLightGray,
    marginTop: Spacing.medium,
    fontFamily: 'Poppins_400Regular',
  },
  semesterCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.large,
    marginBottom: Spacing.large,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  semesterHeader: {
    backgroundColor: Colors.secondaryPurple,
    padding: Spacing.medium,
  },
  semesterTitle: {
    color: Colors.textWhite,
    fontSize: FontSizes.subtitle,
    fontFamily: 'Poppins_700Bold',
  },
  coursesList: {
    padding: Spacing.medium,
  },
  courseItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: BorderRadius.medium,
    padding: Spacing.medium,
    marginBottom: Spacing.medium,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.small,
  },
  courseCode: {
    color: Colors.primaryGold,
    fontSize: FontSizes.regular,
    fontFamily: 'Poppins_700Bold',
  },
  courseName: {
    color: Colors.textWhite,
    fontSize: FontSizes.regular,
    marginBottom: Spacing.small,
    fontFamily: 'Poppins_400Regular',
  },
  creditContainer: {
    alignSelf: 'flex-start',
  },
  creditText: {
    color: Colors.textLightGray,
    fontSize: FontSizes.small,
    fontFamily: 'Poppins_400Regular',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.small,
  },
  statusText: {
    color: Colors.textWhite,
    fontSize: FontSizes.mini,
    fontFamily: 'Poppins_700Bold',
  },
  noCourses: {
    color: Colors.textLightGray,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: Spacing.medium,
  },
  emptyState: {
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.large,
    padding: Spacing.large,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.large,
  },
  emptyStateText: {
    color: Colors.textWhite,
    textAlign: 'center',
    fontSize: FontSizes.regular,
    fontFamily: 'Poppins_400Regular',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.small,
    borderRadius: BorderRadius.medium,
  },
  logoutText: {
    color: Colors.primaryGold,
    fontSize: FontSizes.small,
    fontFamily: 'Poppins_700Bold',
  },
});

export default HomeScreen;