// Paleta de colores para la aplicación JCV (Jalisco Cómo Vamos)
// Paleta básica con 10 colores principales para mantener consistencia visual

export const colors = {
  // Colores primarios
  primary: '#007AFF',        // Color principal - usado para botones principales y elementos destacados
  primaryLight: '#4DA3FF',   // Variación más clara del color primario
  primaryDark: '#0056CC',    // Variación más oscura del color primario
  
  // Colores secundarios
  secondary: '#34C759',      // Usado para botones de acción positiva (crear cuenta, éxito)
  accent: '#FF6B6B',         // Usado para errores y elementos de alerta
  
  // Colores de fondo y superficie
  background: '#F5F5F5',     // Color de fondo principal
  surface: '#FFFFFF',        // Color de superficie para tarjetas y formularios
  
  // Colores de texto
  textPrimary: '#333333',    // Texto principal
  textSecondary: '#666666',  // Texto secundario y elementos menos importantes
  textDisabled: '#CCCCCC',   // Texto deshabilitado y elementos inactivos
} as const;

// Tipo TypeScript derivado para autocompletado y validación
export type ColorKey = keyof typeof colors;

// Función helper para obtener colores de forma segura
export const getColor = (colorKey: ColorKey): string => {
  return colors[colorKey];
};

// Paleta de colores específica para diferentes estados y contextos
export const semanticColors = {
  // Estados de validación
  success: colors.secondary,    // Para éxito
  error: colors.accent,         // Para errores
  warning: '#FF9500',          // Para advertencias
  info: colors.primary,        // Para información
  
  // Estados de interacción
  disabled: colors.textDisabled,
  pressed: colors.primaryDark,
  
  // Bordes y separadores
  border: '#DDDDDD',
  separator: '#EEEEEE',
} as const;

export default colors;