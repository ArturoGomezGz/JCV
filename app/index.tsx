import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import colors from '../constants/Colors';

export default function Index() {
  const { isAuthenticated, isGuest, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        if (isGuest) {
          router.replace('/(tabs)/guest');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        router.replace('/landing');
      }
    }
  }, [isAuthenticated, isGuest, loading]);

  // Show loading screen while Firebase initializes
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return null; // No renderiza nada, solo redirecciona
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});