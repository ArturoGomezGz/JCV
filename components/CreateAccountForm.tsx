// Importaciones necesarias de React y React Native
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, semanticColors } from '../constants/Colors';

// Definición de la interfaz TypeScript para las props del componente
interface CreateAccountFormProps {
  onCreateAccount?: (email: string, password: string, confirmPassword: string) => void;
  onBackToLogin?: () => void;
  isLoading?: boolean;
}

// Componente principal: CreateAccountForm
const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ 
  onCreateAccount, 
  onBackToLogin,
  isLoading = false 
}) => {
  // Estados del componente
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });

  // Función de validación del formulario
  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '', confirmPassword: '' };
    let isValid = true;

    // Validar email
    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Ingresa un email válido';
      isValid = false;
    }

    // Validar contraseña
    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    // Validar confirmación de contraseña
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Manejador para crear cuenta
  const handleCreateAccount = () => {
    if (validateForm()) {
      if (onCreateAccount) {
        onCreateAccount(email, password, confirmPassword);
      } else {
        Alert.alert('Cuenta Creada', `Cuenta creada para: ${email}`);
      }
    }
  };

  // Manejador para volver al login
  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        {/* Título del formulario */}
        <Text style={styles.title}>Crear Nueva Cuenta</Text>
        
        {/* Campo Email */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              errors.email ? styles.inputError : null
            ]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        {/* Campo Contraseña */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              errors.password ? styles.inputError : null
            ]}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}
        </View>

        {/* Campo Confirmar Contraseña */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              errors.confirmPassword ? styles.inputError : null
            ]}
            placeholder="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        {/* Botón principal de Crear Cuenta */}
        <TouchableOpacity
          style={[
            styles.createAccountButton,
            isLoading ? styles.createAccountButtonDisabled : null
          ]}
          onPress={handleCreateAccount}
          disabled={isLoading}
        >
          <Text style={styles.createAccountButtonText}>
            {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Text>
        </TouchableOpacity>

        {/* Botón para volver al login */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToLogin}
          disabled={isLoading}
        >
          <Text style={styles.backButtonText}>Volver al Inicio de Sesión</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  // === ESTILOS DE LAYOUT Y CONTENEDORES ===
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    marginTop: 45,
  },
  formContainer: {
    position: 'relative',
    top: 10,
    backgroundColor: colors.surface,
    padding: 20,
    width: '90%',
    height: 'auto',
    margin: 'auto',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // === ESTILOS DE TEXTO ===
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.textPrimary,
  },
  inputContainer: {
    marginBottom: 15,
  },

  // === ESTILOS DE INPUTS ===
  input: {
    borderWidth: 1,
    borderColor: semanticColors.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: semanticColors.error,
  },
  errorText: {
    color: semanticColors.error,
    fontSize: 12,
    marginTop: 5,
  },

  // === ESTILOS DE BOTONES ===
  createAccountButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  createAccountButtonDisabled: {
    backgroundColor: colors.textDisabled,
  },
  createAccountButtonText: {
    color: colors.surface,
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CreateAccountForm;