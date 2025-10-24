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
  category: string;
  question: string;
}

export const generateChartAnalysis = async ({
  chartType,
  title,
  data,
  category,
  question
}: ChartAnalysisParams): Promise<string> => {
  // Verificar si el modo AI está habilitado
  const aiModeEnabled = process.env.EXPO_PUBLIC_AI_MODE_ENABLED === 'true';
  
  // Si el modo AI está deshabilitado, devolver texto predeterminado
  if (!aiModeEnabled) {
    return getDefaultText(title, chartType, category, question);
  }

  try {
    // Verificar que la API key esté configurada
    if (!process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
      throw new Error('API key de OpenAI no configurada');
    }

    // Obtener el modelo desde variables de entorno o usar el más barato por defecto
    const model = process.env.EXPO_PUBLIC_OPENAI_MODEL || 'gpt-3.5-turbo';

    const prompt = `
Genera un análisis detallado en español para una gráfica de satisfacción ciudadana con las siguientes características:

Título: ${title}
Categoría: ${category}
Pregunta de la encuesta: ${question}
Tipo de gráfica: ${chartType}
Datos: ${JSON.stringify(data, null, 2)}

CONTEXTO IMPORTANTE: 
Esta gráfica forma parte de un sistema de medición de satisfacción ciudadana. La categoría "${category}" agrupa preguntas relacionadas, y esta visualización específica responde a la pregunta: "${question}".

IMPORTANTE: La respuesta debe estar en formato Markdown válido.

El análisis debe incluir:
1. Interpretación de los resultados de satisfacción ciudadana
2. Análisis específico de la pregunta "${question}" dentro de la categoría "${category}"
3. Insights y patrones identificados en los datos de la encuesta
4. Recomendaciones para mejorar la satisfacción ciudadana basadas en estos resultados
5. Conclusiones relevantes para la administración pública

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
          content: 'Eres un analista de datos especializado en encuestas de satisfacción ciudadana y administración pública. Generas análisis claros y útiles de gráficas que miden la percepción ciudadana sobre servicios públicos.'
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
const getDefaultText = (title: string, chartType: string, category: string, question: string): string => {
  return `
## Análisis de Satisfacción Ciudadana: ${title}

### Información de la Encuesta

**Categoría:** ${category}  
**Pregunta:** ${question}

Esta visualización presenta los resultados de satisfacción ciudadana para la pregunta específica dentro de la categoría evaluada. Los datos proporcionan información valiosa sobre la percepción ciudadana de los servicios públicos.

### Características de la Visualización

La visualización de tipo **${chartType}** permite identificar el nivel de satisfacción ciudadana y áreas de oportunidad. Esta información es fundamental para:

- **Evaluar** la percepción ciudadana sobre servicios públicos
- **Identificar** áreas prioritarias de mejora en la administración
- **Monitorear** la evolución de la satisfacción a lo largo del tiempo
- **Tomar decisiones** informadas para mejorar la gestión pública

### Contextualización

Los resultados de esta pregunta dentro de la categoría **"${category}"** reflejan aspectos específicos de la experiencia ciudadana que requieren atención y seguimiento continuo.

### Actualización de Datos

Los datos de satisfacción ciudadana se actualizan *dinámicamente* y reflejan las respuestas más recientes de las encuestas aplicadas.

> **Nota:** Este análisis utiliza contenido predeterminado. Para obtener análisis personalizados con IA que profundicen en los patrones específicos de satisfacción ciudadana, habilita el modo AI en la configuración.
  `;
};