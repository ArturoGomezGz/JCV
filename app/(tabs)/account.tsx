import React from 'react';
import { View, StyleSheet } from 'react-native';
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
    logout 
  } = useAuth();

  // Redirect to create account if not authenticated or is guest
  React.useEffect(() => {
    if (!isAuthenticated || isGuest) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isGuest]);

  const handleSave = (name: string, phone: string, password: string) => {
    // TODO: Implement save functionality
    console.log('Save account settings:', { name, phone, password });
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
