import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { LoginForm } from '../../components';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, setGuestMode } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert(result.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push('/(auth)/create-account');
  };

  const handleGuestAccess = () => {
    setGuestMode(true);
    router.replace('/(tabs)/guest');
  };

  return (
    <LoginForm 
      onLogin={handleLogin}
      onCreateAccount={handleCreateAccount}
      onGuestAccess={handleGuestAccess}
      isLoading={isLoading}
    />
  );
}