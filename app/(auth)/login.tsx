import React, { useState } from 'react';
import { router } from 'expo-router';
import { LoginForm } from '../../components';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, setGuestMode } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login error:', error);
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