// Importaciones necesarias de React y React Native
// React: Hook useState para manejar el estado del componente
// React Native: Componentes UI y utilidades de plataforma
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { colors, semanticColors } from '../constants/Colors';

// Definición de la interfaz TypeScript que especifica qué props puede recibir el componente
// Todas las props son opcionales (?) para mayor flexibilidad
interface LoginFormProps {
  onLogin?: (email: string, password: string) => void;
  onCreateAccount?: () => void;
  onGuestAccess?: () => void;
  isLoading?: boolean;
}

// Componente principal: LoginForm es un componente funcional de React con TypeScript
// Recibe props desestructuradas y asigna valores por defecto
const LoginForm: React.FC<LoginFormProps> = ({ 
  onLogin, 
  onCreateAccount, 
  onGuestAccess, 
  isLoading = false 
}) => {
  // Estados del componente usando el hook useState
  // email y password: almacenan los valores de los campos de entrada
  // errors: objeto que almacena mensajes de error para cada campo
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  // useEffect para limpiar errores cuando cambia el estado de carga
  useEffect(() => {
    if (!isLoading) {
      // Limpiar errores cuando se completa la carga
      setErrors({ email: '', password: '' });
    }
  }, [isLoading]);

  // useEffect para manejar eventos del teclado
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // Limpiar errores cuando se oculta el teclado
      setErrors({ email: '', password: '' });
    });

    return () => {
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Función de validación: verifica que los campos cumplan con los requisitos
  // Retorna true si el formulario es válido, false si hay errores
  // Actualiza el estado 'errors' con mensajes específicos para cada campo
  const validateForm = (): boolean => {
    const newErrors = { email: '', password: '' };
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

    setErrors(newErrors);
    return isValid;
  };

  // Manejador del evento de login: se ejecuta cuando el usuario presiona "Iniciar Sesión"
  // Primero valida el formulario, luego ejecuta la función onLogin si fue proporcionada
  // Si no hay función onLogin, muestra una alerta por defecto
  const handleLogin = () => {
    if (validateForm()) {
      if (onLogin) {
        onLogin(email, password);
      } else {
        // Acción por defecto si no se proporciona onLogin
        Alert.alert('Login', `Email: ${email}`);
      }
    }
  };

  // Manejador para crear nueva cuenta: ejecuta la función onCreateAccount si fue proporcionada
  // Si no, muestra una alerta indicando que la funcionalidad no está implementada
  const handleCreateAccount = () => {
    if (onCreateAccount) {
      onCreateAccount();
    } else {
      // Acción por defecto si no se proporciona onCreateAccount
      Alert.alert('Crear Cuenta', 'Funcionalidad de crear cuenta no implementada');
    }
  };

  // Manejador para acceso como invitado: ejecuta la función onGuestAccess si fue proporcionada
  // Si no, muestra una alerta indicando el acceso como invitado
  const handleGuestAccess = () => {
    if (onGuestAccess) {
      onGuestAccess();
    } else {
      // Acción por defecto si no se proporciona onGuestAccess
      Alert.alert('Acceso de Invitado', 'Entrando como invitado...');
    }
  };

  // Renderizado del componente: retorna la estructura JSX del formulario
  // KeyboardAvoidingView: ajusta automáticamente el contenido cuando aparece el teclado
  // Diferente comportamiento entre iOS ('padding') y Android ('height')
  return (
    <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

        {/* Contenedor principal del formulario con estilos de tarjeta */}
        <View style={styles.formContainer}>
            {/* Título del formulario */}
            <Text style={styles.title}>Iniciar Sesión</Text>
            
            {/* Campo Email */}
            <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={[
                styles.input,
                errors.email ? styles.inputError : null
                ]}
                placeholder="Ingresa tu email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
            />
            {/* Mensaje de error para email (solo se muestra si hay error) */}
            {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
            ) : null}
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputContainer}>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                style={[
                styles.input,
                errors.password ? styles.inputError : null
                ]}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
            />
            {/* Mensaje de error para contraseña (solo se muestra si hay error) */}
            {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
            </View>

            {/* Botón principal de Login */}
            {/* Se deshabilita y cambia de color cuando isLoading es true */}
            <TouchableOpacity
            style={[
                styles.loginButton,
                isLoading ? styles.loginButtonDisabled : null
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            >
            <Text style={styles.loginButtonText}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Text>
            </TouchableOpacity>

            {/* Separador visual: línea horizontal con texto "o" en el centro */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>o</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Botón secundario: Crear Nueva Cuenta */}
            <TouchableOpacity
            style={styles.createAccountButton}
            onPress={handleCreateAccount}
            disabled={isLoading}
            >
            <Text style={styles.createAccountButtonText}>Crear Nueva Cuenta</Text>
            </TouchableOpacity>

            {/* Botón terciario: Entrar como Invitado */}
            <TouchableOpacity
            style={styles.guestButton}
            onPress={handleGuestAccess}
            disabled={isLoading}
            >
            <Text style={styles.guestButtonText}>Entrar como Invitado</Text>
            </TouchableOpacity>
        </View>
    </KeyboardAvoidingView>
  );
};

// Definición de estilos usando StyleSheet de React Native
// StyleSheet.create optimiza los estilos y permite reutilización
// Organizado por secciones: Layout, Inputs, Botones, y Elementos visuales
const styles = StyleSheet.create({
  // === ESTILOS DE LAYOUT Y CONTENEDORES ===
  // Contenedor principal: ocupa toda la pantalla y centra el contenido
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    marginTop: 45,
  },
  // Contenedor del formulario: tarjeta con sombra y bordes redondeados
  formContainer: {
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
    elevation: 5, // Sombra para Android
  },

  // === ESTILOS DE TEXTO ===
  // Título principal del formulario
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: colors.textPrimary,
  },
  // Contenedor para cada campo de entrada
  inputContainer: {
    marginBottom: 15,
  },
  // Etiquetas de los campos de entrada
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: colors.textPrimary,
  },

  // === ESTILOS DE INPUTS ===
  // Campo de entrada base
  input: {
    borderWidth: 1,
    borderColor: semanticColors.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: colors.surface,
  },
  // Modificador para inputs con error
  inputError: {
    borderColor: semanticColors.error,
  },
  // Texto de mensajes de error
  errorText: {
    color: semanticColors.error,
    fontSize: 12,
    marginTop: 5,
  },

  // === ESTILOS DE BOTONES ===
  // Botón principal de login
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 6,
  },
  // Estado deshabilitado del botón principal
  loginButtonDisabled: {
    backgroundColor: colors.textDisabled,
  },
  // Texto del botón principal
  loginButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Botón de crear cuenta
  createAccountButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  // Texto del botón de crear cuenta
  createAccountButtonText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Botón de invitado (transparente con borde)
  guestButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.textSecondary,
  },
  // Texto del botón de invitado
  guestButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // === ESTILOS DEL SEPARADOR VISUAL ===
  // Contenedor del separador (línea + texto "o")
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  // Líneas horizontales del separador
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: semanticColors.border,
  },
  // Texto "o" en el centro del separador
  separatorText: {
    marginHorizontal: 15,
    color: colors.textSecondary,
    fontSize: 14,
  },
});

// Exportación del componente para que pueda ser importado en otros archivos
// 'export default' permite importar el componente con cualquier nombre
export default LoginForm;