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
import { 
  sanitizeName, 
  sanitizeEmail, 
  sanitizePhone, 
  isValidEmail,
  isValidPhone,
  isValidName,
  isValidPassword,
  hasNoDangerousChars
} from '../utils/inputSanitization';

// Definición de la interfaz TypeScript para las props del componente
interface CreateAccountFormProps {
  onCreateAccount?: (name: string, email: string, phone: string, password: string, confirmPassword: string) => void;
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  // Función de validación del formulario
  const validateForm = (): boolean => {
    const newErrors = { name: '', email: '', phone: '', password: '', confirmPassword: '' };
    let isValid = true;

    // Sanitizar inputs (excepto contraseñas)
    const sanitizedName = sanitizeName(name);
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedPhone = sanitizePhone(phone);

    // Validar nombre (obligatorio)
    if (!sanitizedName.trim()) {
      newErrors.name = 'El nombre es requerido';
      isValid = false;
    } else if (!isValidName(sanitizedName)) {
      newErrors.name = 'El nombre contiene caracteres no permitidos';
      isValid = false;
    }

    // Validar email
    if (!sanitizedEmail.trim()) {
      newErrors.email = 'El email es requerido';
      isValid = false;
    } else if (!isValidEmail(sanitizedEmail)) {
      newErrors.email = 'Ingresa un email válido';
      isValid = false;
    }

    // Validar teléfono (opcional, pero si se proporciona debe ser válido)
    if (sanitizedPhone.trim() && !isValidPhone(sanitizedPhone)) {
      newErrors.phone = 'Ingresa un teléfono válido (10-15 dígitos)';
      isValid = false;
    }

    // Validar contraseña (sin sanitizar, solo validar)
    if (!password.trim()) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (!hasNoDangerousChars(password)) {
      newErrors.password = 'La contraseña contiene caracteres no permitidos (comillas, llaves, etc.)';
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
      // Sanitizar inputs de texto antes de enviar (no contraseñas)
      const sanitizedName = sanitizeName(name);
      const sanitizedEmail = sanitizeEmail(email);
      const sanitizedPhone = sanitizePhone(phone);
      
      if (onCreateAccount) {
        onCreateAccount(sanitizedName, sanitizedEmail, sanitizedPhone, password, confirmPassword);
      } else {
        Alert.alert('Cuenta Creada', `Cuenta creada para: ${sanitizedName} (${sanitizedEmail})`);
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
        
        {/* Campo Nombre */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Nombre <Text style={styles.requiredMark}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              errors.name ? styles.inputError : null
            ]}
            placeholder="Nombre completo"
            value={name}
            onChangeText={(text) => setName(sanitizeName(text))}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!isLoading}
          />
          {errors.name ? (
            <Text style={styles.errorText}>{errors.name}</Text>
          ) : null}
        </View>

        {/* Campo Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Email <Text style={styles.requiredMark}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              errors.email ? styles.inputError : null
            ]}
            placeholder="correo@ejemplo.com"
            value={email}
            onChangeText={(text) => setEmail(sanitizeEmail(text))}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}
        </View>

        {/* Campo Teléfono */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Teléfono (opcional)</Text>
          <TextInput
            style={[
              styles.input,
              errors.phone ? styles.inputError : null
            ]}
            placeholder="1234567890"
            value={phone}
            onChangeText={(text) => setPhone(sanitizePhone(text))}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          {errors.phone ? (
            <Text style={styles.errorText}>{errors.phone}</Text>
          ) : null}
        </View>

        {/* Campo Contraseña */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Contraseña <Text style={styles.requiredMark}>*</Text>
          </Text>
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
          <Text style={styles.inputLabel}>
            Confirmar Contraseña <Text style={styles.requiredMark}>*</Text>
          </Text>
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  requiredMark: {
    color: semanticColors.error,
    fontWeight: 'bold',
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