import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import { LoginForm, FooterLogo } from './components';

export default function App() {
  const handleLogin = (email: string, password: string) => {
    // Aquí puedes implementar tu lógica de autenticación
    Alert.alert(
      'Login Exitoso',
      `Bienvenido!\nEmail: ${email}`,
      [{ text: 'OK' }]
    );
  };

  const handleCreateAccount = () => {
    // Aquí puedes navegar a la pantalla de registro
    Alert.alert(
      'Crear Cuenta',
      'Redirigiendo a la pantalla de registro...',
      [{ text: 'OK' }]
    );
  };

  const handleGuestAccess = () => {
    // Aquí puedes implementar el acceso como invitado
    Alert.alert(
      'Acceso de Invitado',
      'Entrando a la aplicación como invitado...',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <LoginForm 
        onLogin={handleLogin}
        onCreateAccount={handleCreateAccount}
        onGuestAccess={handleGuestAccess}
      />
      {/* Logo de Jalisco Cómo Vamos en la parte inferior */}
      <FooterLogo />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
