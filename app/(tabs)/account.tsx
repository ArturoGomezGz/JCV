import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AccountSettingsForm, BottomNavigation } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/Colors';
import { showSuccessAlert, showErrorAlert } from '../../utils/alertUtils';

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
      const result = await updateProfile(name, phone, password);
      
      if (result.success) {
        showSuccessAlert(
          'Tu perfil ha sido actualizado correctamente',
          { buttons: [{ text: 'OK' }] }
        );
      } else {
        showErrorAlert(
          result.error || 'No se pudo actualizar el perfil',
          { buttons: [{ text: 'OK' }] }
        );
      }
    } catch (error) {
      showErrorAlert(
        error,
        { buttons: [{ text: 'OK' }] }
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
