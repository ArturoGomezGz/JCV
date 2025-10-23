import OpenAI from 'openai';

// Configuración del cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Necesario para uso en React Native/Expo
});

export interface ChartAnalysisParams {
  chartType: 'bar' | 'pie' | 'line' | 'progress' | 'donut';
  title: string;
  data: any[];
}

export const generateChartAnalysis = async ({
  chartType,
  title,
  data
}: ChartAnalysisParams): Promise<string> => {
  // Verificar si el modo AI está habilitado
  const aiModeEnabled = process.env.EXPO_PUBLIC_AI_MODE_ENABLED === 'true';
  
  // Si el modo AI está deshabilitado, devolver texto predeterminado
  if (!aiModeEnabled) {
    return getDefaultText(title, chartType);
  }

  try {
    // Verificar que la API key esté configurada
    if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
      throw new Error('API key de OpenAI no configurada');
    }

    // Obtener el modelo desde variables de entorno o usar el más barato por defecto
    const model = process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-3.5-turbo';

    const prompt = `
Genera un análisis detallado en español para una gráfica con las siguientes características:

Título: ${title}
Tipo de gráfica: ${chartType}
Datos: ${JSON.stringify(data, null, 2)}

IMPORTANTE: La respuesta debe estar en formato Markdown válido.

El análisis debe incluir:
1. Una descripción de lo que muestra la gráfica
2. Insights y patrones identificados en los datos
3. Recomendaciones basadas en la información
4. Conclusiones relevantes para la toma de decisiones

Estructura sugerida en Markdown:
- Usar encabezados (##, ###) para organizar las secciones
- Usar listas con viñetas (-) o numeradas (1.) según corresponda
- Usar **negritas** para resaltar puntos importantes
- Usar *cursivas* para enfatizar términos técnicos

El texto debe ser profesional, informativo y estar en español. Debe tener entre 200-300 palabras.
    `;

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'Eres un analista de datos experto que genera análisis claros y útiles de gráficas y visualizaciones de datos en español.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'No se pudo generar el análisis.';
  } catch (error) {
    console.error('Error al generar análisis con OpenAI:', error);
    
    // En modo AI, si hay error, lanzar excepción para mostrar advertencia
    throw new Error(`Error al generar análisis con IA: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

// Función para obtener texto predeterminado (modo sin IA)
const getDefaultText = (title: string, chartType: string): string => {
  return `
## Análisis de la Gráfica: ${title}

Esta es una vista detallada de la gráfica seleccionada. Los datos presentados proporcionan información valiosa para el análisis y la toma de decisiones.

### Características de la Visualización

La visualización de tipo **${chartType}** permite identificar patrones, tendencias y oportunidades de mejora en los datos. Esta información es fundamental para:

- **Comprender** el comportamiento de los datos a lo largo del tiempo
- **Identificar** áreas de oportunidad y mejora  
- **Tomar decisiones** informadas basadas en evidencia
- **Monitorear** el progreso y rendimiento

### Actualización de Datos

Los datos se actualizan *dinámicamente* y reflejan la información más reciente disponible en el sistema.

> **Nota:** Este análisis utiliza contenido predeterminado. Para obtener análisis personalizados con IA, habilita el modo AI en la configuración.
  `;
};