// Paleta de colores para la aplicación JCV (Jalisco Cómo Vamos)
// Basada en el diseño institucional del sitio jaliscocomovamos.org
// Adaptada para mantener coherencia visual y legibilidad en aplicaciones móviles/web

export const colors = {
  // Colores primarios
  primary: '#1C366B',        // Azul institucional (botones principales, encabezados)
  primaryLight: '#3A5CA8',   // Azul más claro (hover, estados activos)
  primaryDark: '#12264D',    // Azul oscuro (textos o fondos de contraste)
  
  // Colores secundarios
  secondary: '#D8A23A',      // Dorado mostaza (acento visual, indicadores)
  accent: '#E94E1B',         // Naranja (alertas o elementos destacados)
  
  // Colores de fondo y superficie
  background: '#F7F8FA',     // Fondo general (gris muy claro)
  surface: '#FFFFFF',        // Superficie de tarjetas, modales, etc.
  
  // Colores de texto
  textPrimary: '#1C1C1C',    // Texto principal (alta legibilidad)
  textSecondary: '#666666',  // Texto secundario y etiquetas
  textDisabled: '#BDBDBD',   // Texto deshabilitado
  
  // Elementos complementarios
  border: '#E0E0E0',         // Bordes sutiles
  link: '#0066CC',           // Enlaces o botones informativos
} as const;

// Tipo TypeScript derivado para autocompletado y validación
export type ColorKey = keyof typeof colors;

// Función helper para obtener colores de forma segura
export const getColor = (colorKey: ColorKey): string => colors[colorKey];

// Paleta semántica (por contexto o estado)
export const semanticColors = {
  success: '#3CB371',        // Verde medio para éxito
  error: '#E94E1B',          // Naranja-rojo para errores
  warning: '#F4B400',        // Amarillo suave para advertencias
  info: '#1C366B',           // Azul institucional para mensajes informativos
  
  disabled: colors.textDisabled,
  pressed: colors.primaryDark,
  
  border: colors.border,
  separator: '#EEEEEE',
} as const;

export default colors;
