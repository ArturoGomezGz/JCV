import React, { useState } from 'react';
import { router } from 'expo-router';
import { CreateAccountForm } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { showErrorAlert, showSuccessAlert } from '../../utils/alertUtils';

export default function CreateAccountScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleCreateAccount = async (
    name: string, 
    email: string, 
    phone: string, 
    password: string, 
    confirmPassword: string
  ) => {
    setIsLoading(true);
    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        showErrorAlert('Las contraseñas no coinciden');
        return;
      }

      const result = await register(name, email, phone, password);
      
      if (result.success) {
        showSuccessAlert(
          'Tu cuenta ha sido creada exitosamente', 
          {
            title: 'Cuenta creada',
            buttons: [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
          }
        );
      } else {
        showErrorAlert(result.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Create account error:', error);
      showErrorAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/(auth)/login');
  };

  return (
    <CreateAccountForm
      onCreateAccount={handleCreateAccount}
      onBackToLogin={handleBackToLogin}
      isLoading={isLoading}
    />
  );
}