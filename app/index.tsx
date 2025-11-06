import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, isGuest } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (isGuest) {
        router.replace('/(tabs)/guest');
      } else {
        router.replace('/(tabs)');
      }
    } else {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isGuest]);

  return null; // No renderiza nada, solo redirecciona
}