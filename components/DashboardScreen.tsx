// Pantalla principal después del login exitoso
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../constants/Colors';

// Definición de la interfaz TypeScript para las props del componente
interface DashboardScreenProps {
  userEmail?: string;
  onLogout?: () => void;
}

// Componente principal: DashboardScreen
const DashboardScreen: React.FC<DashboardScreenProps> = ({ 
  userEmail,
  onLogout
}) => {

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Bienvenida */}
        <Text style={styles.welcomeTitle}>¡Bienvenido!</Text>
        
        {/* Email del usuario */}
        {userEmail && (
          <Text style={styles.userEmail}>Conectado como: {userEmail}</Text>
        )}
        
        {/* Mensaje principal */}
        <Text style={styles.description}>
          Has iniciado sesión exitosamente. Esta es tu pantalla principal.
        </Text>
        
        {/* Placeholder para contenido futuro */}
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Aquí puedes agregar el contenido principal de tu aplicación
          </Text>
        </View>
        
        {/* Botón de cerrar sesión */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  content: {
    backgroundColor: colors.surface,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  placeholder: {
    backgroundColor: colors.background,
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
  },
  placeholderText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default DashboardScreen;