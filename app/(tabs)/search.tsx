import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '../../constants/Colors';
import BottomNavigation from '../../components/BottomNavigation';

export default function SearchScreen() {
  const [activeTab, setActiveTab] = useState('stats');

  const handleTabPress = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName === 'home') {
      router.back();
    } else if (tabName === 'profile') {
      router.push('/(tabs)/account');
    } else if (tabName === 'chat') {
      router.push('/(tabs)/forum');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Búsqueda</Text>
          <Text style={styles.description}>
            Esta sección permitirá buscar contenido dentro de la aplicación.
          </Text>
          <Text style={styles.description}>
            Funcionalidad próximamente disponible.
          </Text>
        </View>
      </ScrollView>
      
      <BottomNavigation 
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
  infoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
});
