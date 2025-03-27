import React, { FC } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';

const HomeScreen: FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome to <Text style={styles.appName}>yourUCF</Text></Text>
        <Text style={styles.subtitle}>Chart your path to graduation.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>You're logged in!</Text>
        <Text style={styles.cardSubtitle}>
          Explore features and manage your academic journey.
        </Text>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made for Knights, by Knights</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 80,
  },
  welcome: {
    fontSize: 30,
    color: Colors.textWhite,
    fontFamily: 'Poppins_700Bold',
  },
  appName: {
    color: Colors.primaryGold,
  },
  subtitle: {
    color: Colors.textLightGray,
    fontSize: 16,
    marginTop: 5,
    fontFamily: 'Poppins_400Regular',
  },
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    alignItems: 'center',
  },
  cardTitle: {
    color: Colors.textWhite,
    fontSize: 22,
    marginBottom: 10,
    fontFamily: 'Poppins_700Bold',
  },
  cardSubtitle: {
    color: Colors.textLightGray,
    fontSize: 15,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primaryGold,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    color: Colors.textLightGray,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
});

export default HomeScreen;
