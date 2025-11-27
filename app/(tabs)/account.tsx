import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { AccountSettingsForm, BottomNavigation } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/Colors';

export default function AccountScreen() {
  const { 
    isAuthenticated, 
    isGuest, 
    userName, 
    userEmail, 
    userProfile, 
    logout,
    updateProfile,
    loading 
  } = useAuth();

  const [isSaving, setIsSaving] = useState(false);

  // Redirect to create account if not authenticated or is guest
  React.useEffect(() => {
    if (!isAuthenticated || isGuest) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isGuest]);

  const handleSave = async (name: string, phone: string, password: string) => {
    setIsSaving(true);
    try {
      const result = await updateProfile(name, phone, password || undefined);
      
      if (result.success) {
        Alert.alert(
          'Éxito',
          'Tu perfil ha sido actualizado correctamente',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          result.error || 'No se pudo actualizar el perfil',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Ocurrió un error inesperado al actualizar el perfil',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handleTabPress = (tabName: string) => {
    if (tabName === 'home') {
      router.replace('/(tabs)');
    } else if (tabName === 'chat') {
      router.push('/(tabs)/forum');
    } else if (tabName === 'stats') {
      router.push('/(tabs)/search');
    }
    // Other tabs can be added here as needed
  };

  // Don't render if not authenticated or is guest
  if (!isAuthenticated || isGuest) {
    return null;
  }

  return (
    <View style={styles.container}>
      <AccountSettingsForm
        userName={userName}
        userEmail={userEmail}
        userPhone={userProfile?.phoneNumber || ''}
        onSave={handleSave}
        onLogout={handleLogout}
        isLoading={isSaving || loading}
      />
      <BottomNavigation 
        activeTab="profile"
        isGuest={false}
        onTabPress={handleTabPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
