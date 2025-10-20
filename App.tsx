import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { LoginForm, CreateAccountForm, DashboardScreen, GuestScreen, FooterLogo, HeaderLogo } from './components';
import { colors } from './constants/Colors';

export default function App() {
  // Estado para manejar qué vista mostrar - ahora con múltiples opciones
  const [currentView, setCurrentView] = useState<'login' | 'createAccount' | 'dashboard' | 'guest'>('login');
  const [userEmail, setUserEmail] = useState<string>('');

  const handleLogin = async (email: string, password: string) => {
    // Aquí puedes implementar tu lógica de autenticación
    try {
      // Simulamos una autenticación exitosa
      setUserEmail(email);
      setCurrentView('dashboard');
      Alert.alert('Login Exitoso', `Bienvenido ${email}`);
    } catch (error) {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  const handleCreateAccountNavigation = () => {
    // Navegar a la vista de crear cuenta
    setCurrentView('createAccount');
  };

  const handleCreateAccount = async (email: string, password: string, confirmPassword: string) => {
    // Aquí puedes implementar la lógica para crear una cuenta
    Alert.alert('Cuenta Creada', `Cuenta creada exitosamente para: ${email}`);
    // Volver al login después de crear la cuenta
    setCurrentView('login');
  };

  const handleBackToLogin = () => {
    // Volver a la vista de login
    setCurrentView('login');
  };

  const handleGuestAccess = async () => {
    // Navegar a la vista de invitado
    setCurrentView('guest');
  };

  const handleLogout = () => {
    // Limpiar datos del usuario y volver al login
    setUserEmail('');
    setCurrentView('login');
  };

  // Función para renderizar el contenido según la vista actual
  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return (
          <LoginForm 
            onLogin={handleLogin}
            onCreateAccount={handleCreateAccountNavigation}
            onGuestAccess={handleGuestAccess}
            isLoading={false}
          />
        );
      
      case 'createAccount':
        return (
          <CreateAccountForm
            onCreateAccount={handleCreateAccount}
            onBackToLogin={handleBackToLogin}
            isLoading={false}
          />
        );
      
      case 'dashboard':
        return (
          <DashboardScreen
            userEmail={userEmail}
            onLogout={handleLogout}
          />
        );
      
      case 'guest':
        return (
          <GuestScreen
            onBackToLogin={handleBackToLogin}
            onCreateAccount={handleCreateAccountNavigation}
          />
        );
      
      default:
        return (
          <LoginForm 
            onLogin={handleLogin}
            onCreateAccount={handleCreateAccountNavigation}
            onGuestAccess={handleGuestAccess}
            isLoading={false}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Solo mostrar logos en login y createAccount */}
      {(currentView === 'login' || currentView === 'createAccount') && (
        <>
          <HeaderLogo />
          <FooterLogo />
        </>
      )}
      
      {/* Renderizar la vista actual */}
      {renderCurrentView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
