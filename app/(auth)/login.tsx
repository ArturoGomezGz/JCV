import React, { useState } from 'react';
import { router } from 'expo-router';
import { LoginForm, FooterLogo, HeaderLogo } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { showErrorAlert } from '../../utils/alertUtils';

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
        showErrorAlert(result.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Login error:', error);
      showErrorAlert(error);
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
    <>
      <HeaderLogo />
      <LoginForm 
        onLogin={handleLogin}
        onCreateAccount={handleCreateAccount}
        onGuestAccess={handleGuestAccess}
        isLoading={isLoading}
      />
      <FooterLogo />
    </>
  );
}