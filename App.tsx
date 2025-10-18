import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import React, { useState } from 'react';
import { LoginForm, FooterLogo, HeaderLogo } from './components';
import { colors } from './constants/Colors';

export default function App() {

  const handleLogin = async (email: string, password: string) => {
    // Aquí puedes implementar tu lógica de autenticación
  };

  const handleCreateAccount = async () => {
    // Aquí puedes implementar la lógica para crear una cuenta
  };

  const handleGuestAccess = async () => {
    // Aquí puedes implementar la lógica para acceso como invitado
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <HeaderLogo />
      <FooterLogo /> {/* Moved FooterLogo here to be above LoginForm */}
      <LoginForm 
        onLogin={handleLogin}
        onCreateAccount={handleCreateAccount}
        onGuestAccess={handleGuestAccess}
        isLoading={useState(false)[0]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
