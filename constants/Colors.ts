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

  logoGreen: '#d5e14d', // Verde del logo
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

// Paleta de colores para gráficos - Generación automática
export const chartColorPalette = [
  '#1C366B', // Azul primario institucional
  '#36A2EB', // Azul claro
  '#FF6384', // Rosa/Rojo
  '#FFCE56', // Amarillo
  '#4BC0C0', // Turquesa
  '#9966FF', // Púrpura
  '#FF9F40', // Naranja
  '#FF6B6B', // Rojo coral
  '#4ECDC4', // Verde agua
  '#45B7D1', // Azul cielo
  '#96CEB4', // Verde menta
  '#FECA57', // Amarillo dorado
  '#FF9FF3', // Rosa claro
  '#54A0FF', // Azul brillante
  '#5F27CD', // Púrpura oscuro
  '#00D2D3', // Cian
  '#FF9F43', // Naranja claro
  '#10AC84', // Verde esmeralda
  '#EE5A24', // Naranja rojizo
  '#0984E3'  // Azul intenso
];

// Función para generar colores automáticamente según la cantidad de datos
export const generateChartColors = (count: number): string[] => {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(chartColorPalette[i % chartColorPalette.length]);
  }
  return colors;
};

// Función para generar colores con opacidad para datasets
export const generateDatasetColors = (count: number) => {
  const baseColors = generateChartColors(count);
  return baseColors.map(color => ({
    color: (opacity = 1) => {
      // Convertir hex a rgba
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    },
    strokeWidth: 3
  }));
};
