// Pantalla para usuarios invitados
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors } from '../constants/Colors';

// Definición de la interfaz TypeScript para las props del componente
interface GuestScreenProps {
  onBackToLogin?: () => void;
  onCreateAccount?: () => void;
}

// Componente principal: GuestScreen
const GuestScreen: React.FC<GuestScreenProps> = ({ 
  onBackToLogin,
  onCreateAccount
}) => {

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    }
  };

  const handleCreateAccount = () => {
    if (onCreateAccount) {
      onCreateAccount();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Título de bienvenida */}
        <Text style={styles.welcomeTitle}>Modo Invitado</Text>
        
        {/* Descripción */}
        <Text style={styles.description}>
          Estás navegando como invitado. Tienes acceso limitado a las funciones de la aplicación.
        </Text>
        
        {/* Sección de funciones disponibles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funciones Disponibles:</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Ver contenido público</Text>
            <Text style={styles.featureItem}>• Explorar funcionalidades básicas</Text>
            <Text style={styles.featureItem}>• Acceso de solo lectura</Text>
          </View>
        </View>

        {/* Sección de funciones restringidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Para acceso completo:</Text>
          <View style={styles.featureList}>
            <Text style={styles.restrictedItem}>• Crear y editar contenido</Text>
            <Text style={styles.restrictedItem}>• Guardar preferencias</Text>
            <Text style={styles.restrictedItem}>• Acceso a funciones premium</Text>
          </View>
        </View>

        {/* Placeholder para contenido de invitado */}
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Contenido disponible para invitados
          </Text>
          <Text style={styles.placeholderSubtext}>
            Esta sección mostraría el contenido limitado que pueden ver los usuarios invitados
          </Text>
        </View>

        {/* Botones de acción */}
        <View style={styles.buttonContainer}>
          {/* Botón para crear cuenta */}
          <TouchableOpacity
            style={styles.createAccountButton}
            onPress={handleCreateAccount}
          >
            <Text style={styles.createAccountButtonText}>Crear Cuenta</Text>
          </TouchableOpacity>
          
          {/* Botón para volver al login */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToLogin}
          >
            <Text style={styles.backButtonText}>Volver al Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  section: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  featureList: {
    paddingLeft: 10,
  },
  featureItem: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  restrictedItem: {
    fontSize: 14,
    color: colors.textDisabled,
    marginBottom: 8,
    lineHeight: 20,
  },
  placeholder: {
    backgroundColor: colors.background,
    padding: 25,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 15,
  },
  createAccountButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
  },
  createAccountButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default GuestScreen;