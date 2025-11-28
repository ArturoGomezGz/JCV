import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { BottomNavigation, GuestModal } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/Colors';

export default function ForumScreen() {
  const { isAuthenticated, isGuest } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);

  const handleTabPress = (tabName: string) => {
    if (tabName === 'home') {
      if (isGuest) {
        router.replace('/(tabs)/guest');
      } else {
        router.replace('/(tabs)');
      }
    } else if (tabName === 'profile') {
      if (isGuest) {
        // Show popup instead of redirecting directly
        setShowGuestModal(true);
      } else {
        router.push('/(tabs)/account');
      }
    } else if (tabName === 'stats') {
      router.push('/(tabs)/search');
    }
    // 'chat' tab is the current screen (forum)
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/create-account');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Foro de Discusión</Text>
        <Text style={styles.description}>
          Próximamente podrás participar en discusiones sobre temas de interés ciudadano.
        </Text>
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderEmoji}>💬</Text>
          <Text style={styles.placeholderText}>
            Esta sección está en desarrollo. Pronto podrás compartir tus opiniones y participar en conversaciones con otros ciudadanos.
          </Text>
        </View>
      </ScrollView>
      <BottomNavigation 
        activeTab="chat"
        isGuest={isGuest}
        onCreateAccountPress={handleCreateAccount}
        onTabPress={handleTabPress}
      />
      <GuestModal
        visible={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        onCreateAccount={handleCreateAccount}
        message="Necesitas crear una cuenta para acceder a la configuración de tu perfil."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  placeholderContainer: {
    backgroundColor: colors.surface,
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  placeholderEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
