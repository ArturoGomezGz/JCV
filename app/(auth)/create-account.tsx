import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { CreateAccountForm } from '../../components';
import { useAuth } from '../../contexts/AuthContext';

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
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }

      const result = await register(name, email, phone, password);
      
      if (result.success) {
        Alert.alert(
          'Cuenta creada', 
          'Tu cuenta ha sido creada exitosamente', 
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        Alert.alert('Error', result.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Create account error:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado');
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