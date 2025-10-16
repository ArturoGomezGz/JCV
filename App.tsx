import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { LoginForm, FooterLogo, HeaderLogo } from './components';
import { colors } from './constants/Colors';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simular una llamada asíncrona de autenticación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí puedes implementar tu lógica de autenticación
      Alert.alert(
        'Login Exitoso',
        `Bienvenido!\nEmail: ${email}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Hubo un problema al iniciar sesión. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    setIsLoading(true);
    
    try {
      // Simular una llamada asíncrona
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aquí puedes navegar a la pantalla de registro
      Alert.alert(
        'Crear Cuenta',
        'Redirigiendo a la pantalla de registro...',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Hubo un problema. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setIsLoading(true);
    
    try {
      // Simular una llamada asíncrona
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aquí puedes implementar el acceso como invitado
      Alert.alert(
        'Acceso de Invitado',
        'Entrando a la aplicación como invitado...',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Hubo un problema. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderLogo />
      <LoginForm 
        onLogin={handleLogin}
        onCreateAccount={handleCreateAccount}
        onGuestAccess={handleGuestAccess}
        isLoading={isLoading}
      />
      <FooterLogo />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
