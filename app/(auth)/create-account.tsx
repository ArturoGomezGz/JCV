import React, { useState } from 'react';
import { router } from 'expo-router';
import { CreateAccountForm } from '../../components';

export default function CreateAccountScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateAccount = async (email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    try {
      // Aquí implementarías la lógica de crear cuenta
      // Por ahora solo navegamos de vuelta al login
      router.push('/(auth)/login');
    } catch (error) {
      console.error('Create account error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <CreateAccountForm
      onCreateAccount={handleCreateAccount}
      onBackToLogin={handleBackToLogin}
      isLoading={isLoading}
    />
  );
}