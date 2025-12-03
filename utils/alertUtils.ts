import { Alert, AlertButton } from 'react-native';

/**
 * Tipos de alertas disponibles
 */
export type AlertType = 'success' | 'error' | 'warning' | 'info';

/**
 * Opciones para personalizar las alertas
 */
export interface FriendlyAlertOptions {
  title?: string;
  buttons?: AlertButton[];
  cancelable?: boolean;
}

/**
 * Mensajes de error amigables para diferentes tipos de errores
 */
const friendlyErrorMessages: Record<string, string> = {
  // Errores de autenticación de Firebase
  'auth/user-not-found': 'No encontramos una cuenta con ese correo electrónico.',
  'auth/wrong-password': 'La contraseña es incorrecta. Por favor, inténtalo de nuevo.',
  'auth/invalid-email': 'El correo electrónico no es válido.',
  'auth/user-disabled': 'Esta cuenta ha sido deshabilitada. Contacta al administrador.',
  'auth/too-many-requests': 'Demasiados intentos fallidos. Por favor, espera un momento e intenta de nuevo.',
  'auth/email-already-in-use': 'Este correo electrónico ya está registrado.',
  'auth/operation-not-allowed': 'Esta operación no está permitida en este momento.',
  'auth/weak-password': 'La contraseña es muy débil. Usa al menos 6 caracteres.',
  'auth/requires-recent-login': 'Por seguridad, necesitas volver a iniciar sesión para realizar esta acción.',
  'auth/invalid-credential': 'Las credenciales proporcionadas no son válidas.',
  'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet.',
  
  // Errores de Firestore
  'permission-denied': 'No tienes permiso para realizar esta acción.',
  'not-found': 'No se encontró la información solicitada.',
  'already-exists': 'Este elemento ya existe.',
  'resource-exhausted': 'Se ha excedido el límite de recursos. Intenta más tarde.',
  'failed-precondition': 'No se puede completar esta acción en este momento.',
  'aborted': 'La operación fue cancelada. Intenta de nuevo.',
  'out-of-range': 'El valor proporcionado está fuera del rango permitido.',
  'unimplemented': 'Esta funcionalidad no está disponible todavía.',
  'unavailable': 'El servicio no está disponible temporalmente. Intenta más tarde.',
  'data-loss': 'Se perdieron algunos datos. Por favor, contacta al soporte.',
  
  // Errores genéricos
  'network-error': 'Error de conexión. Verifica tu conexión a internet e intenta de nuevo.',
  'timeout': 'La operación tardó demasiado tiempo. Por favor, intenta de nuevo.',
  'unknown': 'Ocurrió un error inesperado. Por favor, intenta de nuevo.',
};

/**
 * Extrae el código de error de un mensaje de error
 */
const extractErrorCode = (error: string): string | null => {
  // Buscar códigos de error comunes en el mensaje
  for (const code of Object.keys(friendlyErrorMessages)) {
    if (error.includes(code)) {
      return code;
    }
  }
  return null;
};

/**
 * Convierte un mensaje de error técnico en uno amigable
 */
export const getFriendlyErrorMessage = (error: string | Error | unknown): string => {
  let errorMessage = '';
  
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    return 'Ocurrió un error. Por favor, intenta de nuevo.';
  }
  
  // Intentar extraer un código de error conocido
  const errorCode = extractErrorCode(errorMessage);
  if (errorCode && friendlyErrorMessages[errorCode]) {
    return friendlyErrorMessages[errorCode];
  }
  
  // Si el mensaje ya es amigable (no contiene códigos técnicos), devolverlo
  if (!errorMessage.includes('auth/') && 
      !errorMessage.includes('Error:') && 
      !errorMessage.includes('firebase') &&
      !errorMessage.includes('FirebaseError') &&
      errorMessage.length < 100) {
    return errorMessage;
  }
  
  // Mensaje genérico como último recurso
  return 'Ocurrió un error. Por favor, intenta de nuevo.';
};

/**
 * Obtiene el título apropiado según el tipo de alerta
 */
const getDefaultTitle = (type: AlertType): string => {
  switch (type) {
    case 'success':
      return '✅ Éxito';
    case 'error':
      return '❌ Error';
    case 'warning':
      return '⚠️ Atención';
    case 'info':
      return 'ℹ️ Información';
    default:
      return 'Aviso';
  }
};

/**
 * Muestra una alerta con un mensaje amigable para el usuario
 * 
 * @param type - Tipo de alerta (success, error, warning, info)
 * @param message - Mensaje a mostrar (puede ser técnico, se convertirá a amigable)
 * @param options - Opciones adicionales para personalizar la alerta
 */
export const showFriendlyAlert = (
  type: AlertType,
  message: string | Error | unknown,
  options?: FriendlyAlertOptions
): void => {
  const friendlyMessage = getFriendlyErrorMessage(message);
  const title = options?.title || getDefaultTitle(type);
  const buttons = options?.buttons || [{ text: 'OK', style: 'default' }];
  const cancelable = options?.cancelable ?? true;
  
  Alert.alert(title, friendlyMessage, buttons, { cancelable });
};

/**
 * Atajos para tipos específicos de alertas
 */
export const showSuccessAlert = (
  message: string,
  options?: FriendlyAlertOptions
): void => {
  showFriendlyAlert('success', message, options);
};

export const showErrorAlert = (
  error: string | Error | unknown,
  options?: FriendlyAlertOptions
): void => {
  showFriendlyAlert('error', error, options);
};

export const showWarningAlert = (
  message: string,
  options?: FriendlyAlertOptions
): void => {
  showFriendlyAlert('warning', message, options);
};

export const showInfoAlert = (
  message: string,
  options?: FriendlyAlertOptions
): void => {
  showFriendlyAlert('info', message, options);
};
