// Componente de configuración de cuenta
// Permite al usuario modificar su nombre, teléfono y contraseña
// El correo electrónico se muestra como campo no editable
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, semanticColors } from '../constants/Colors';
import { 
  sanitizeName, 
  sanitizePhone, 
  sanitizePassword,
  isValidPhone,
  isValidName,
  isValidPassword,
  hasNoDangerousChars
} from '../utils/inputSanitization';

interface AccountSettingsFormProps {
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  onSave?: (name: string, phone: string, password: string) => void;
  onLogout?: () => void;
  isLoading?: boolean;
}

const AccountSettingsForm: React.FC<AccountSettingsFormProps> = ({
  userName = '',
  userEmail = '',
  userPhone = '',
  onSave,
  onLogout,
  isLoading = false,
}) => {
  const [name, setName] = useState(userName);
  const [phone, setPhone] = useState(userPhone);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', phone: '', password: '', confirmPassword: '' });

  const validateForm = (): boolean => {
    const newErrors = { name: '', phone: '', password: '', confirmPassword: '' };
    let isValid = true;

    // Sanitizar inputs (excepto contraseñas)
    const sanitizedName = sanitizeName(name);
    const sanitizedPhone = sanitizePhone(phone);

    // Validar nombre (obligatorio)
    if (!sanitizedName.trim()) {
      newErrors.name = 'El nombre es requerido';
      isValid = false;
    } else if (!isValidName(sanitizedName)) {
      newErrors.name = 'El nombre contiene caracteres no permitidos';
      isValid = false;
    }

    // Validar teléfono (opcional, pero si se proporciona debe ser válido)
    if (sanitizedPhone.trim() && !isValidPhone(sanitizedPhone)) {
      newErrors.phone = 'Ingresa un teléfono válido (10-15 dígitos)';
      isValid = false;
    }

    // Validar contraseña (opcional, pero si se proporciona debe cumplir requisitos)
    if (password.trim()) {
      if (!hasNoDangerousChars(password)) {
        newErrors.password = 'La contraseña contiene caracteres no permitidos (comillas, llaves, etc.)';
        isValid = false;
      } else if (password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        isValid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      // Sanitizar inputs de texto antes de enviar (no contraseña)
      const sanitizedName = sanitizeName(name);
      const sanitizedPhone = sanitizePhone(phone);
      
      if (onSave) {
        onSave(sanitizedName, sanitizedPhone, password);
      }
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Icono de usuario */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color={colors.surface} />
            </View>
          </View>

          {/* Título del formulario */}
          <Text style={styles.title}>Configuración de Cuenta</Text>
          <Text style={styles.subtitle}>Administra tu información personal</Text>

          {/* Campo Correo Electrónico (NO editable) */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              <Ionicons name="mail-outline" size={14} color={colors.textSecondary} /> Correo Electrónico
            </Text>
            <View style={styles.disabledInputContainer}>
              <TextInput
                style={styles.disabledInput}
                value={userEmail}
                editable={false}
                selectTextOnFocus={false}
              />
              <Ionicons name="lock-closed" size={18} color={colors.textDisabled} style={styles.lockIcon} />
            </View>
            <Text style={styles.helperText}>El correo electrónico no puede ser modificado</Text>
          </View>

          {/* Campo Nombre */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              <Ionicons name="person-outline" size={14} color={colors.textSecondary} /> Nombre
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

          {/* Campo Teléfono */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              <Ionicons name="call-outline" size={14} color={colors.textSecondary} /> Teléfono
            </Text>
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

          {/* Sección de Cambio de Contraseña */}
          <View style={styles.sectionDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Campo Nueva Contraseña */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>
              <Ionicons name="key-outline" size={14} color={colors.textSecondary} /> Nueva Contraseña
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.password ? styles.inputError : null
              ]}
              placeholder="Nueva contraseña (opcional)"
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
              <Ionicons name="key-outline" size={14} color={colors.textSecondary} /> Confirmar Contraseña
            </Text>
            <TextInput
              style={[
                styles.input,
                errors.confirmPassword ? styles.inputError : null
              ]}
              placeholder="Confirmar nueva contraseña"
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

          {/* Botón de Guardar */}
          <TouchableOpacity
            style={[
              styles.saveButton,
              isLoading ? styles.saveButtonDisabled : null
            ]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Ionicons name="save-outline" size={20} color={colors.surface} style={styles.buttonIcon} />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Text>
          </TouchableOpacity>

          {/* Botón de Cerrar Sesión */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Ionicons name="log-out-outline" size={20} color={semanticColors.error} style={styles.buttonIcon} />
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 120,
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: semanticColors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: semanticColors.error,
  },
  disabledInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: semanticColors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 40,
    fontSize: 15,
    backgroundColor: colors.background,
    color: colors.textSecondary,
  },
  lockIcon: {
    position: 'absolute',
    right: 12,
  },
  helperText: {
    fontSize: 12,
    color: colors.textDisabled,
    marginTop: 4,
    fontStyle: 'italic',
  },
  errorText: {
    color: semanticColors.error,
    fontSize: 12,
    marginTop: 6,
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: semanticColors.border,
  },
  sectionTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginHorizontal: 12,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.textDisabled,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: semanticColors.error,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: semanticColors.error,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AccountSettingsForm;
