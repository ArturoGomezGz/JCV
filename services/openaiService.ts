import OpenAI from 'openai';
import { updateSurveyReport } from './surveysService';

// Configuración del cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Necesario para uso en React Native/Expo
});

export interface ChartAnalysisParams {
  chartType: 'bar' | 'line' | 'pie' | 'progress' | 'contribution' | 'stackedBar' | 'bezierLine' | 'areaChart' | 'horizontalBar';
  title: string;
  category: string;
  question: string;
  surveyId?: string; // ID opcional de la encuesta para guardar el reporte en Firebase
  chartData?: {
    labels?: string[];
    values?: number[];
    datasets?: Array<{
      name?: string;
      values: number[];
    }>;
    series?: string[];
    startDate?: string;
    endDate?: string;
  };
}

// Función auxiliar para formatear los datos del gráfico de manera legible para el prompt
const formatChartDataForPrompt = (
  chartData: ChartAnalysisParams['chartData'] | undefined,
  chartType: string
): string => {
  if (!chartData) {
    return 'No se proporcionaron datos específicos de la gráfica.';
  }

  let description = '';

  switch (chartType) {
    case 'pie':
    case 'bar':
    case 'horizontalBar':
      if (chartData.labels && chartData.values) {
        description = 'Distribución de datos:\n';
        chartData.labels.forEach((label, index) => {
          const value = chartData.values?.[index] ?? 0;
          description += `  - ${label}: ${value}%\n`;
        });
      }
      break;

    case 'line':
    case 'bezierLine':
    case 'areaChart':
      if (chartData.labels && chartData.values) {
        description = 'Tendencia temporal:\n';
        chartData.labels.forEach((label, index) => {
          const value = chartData.values?.[index] ?? 0;
          description += `  - ${label}: ${value}\n`;
        });
      } else if (chartData.datasets && chartData.datasets.length > 0) {
        description = 'Series de datos:\n';
        chartData.datasets.forEach((dataset) => {
          description += `  - ${dataset.name || 'Serie'}: [${dataset.values?.join(', ') || 'sin datos'}]\n`;
        });
      }
      break;

    case 'progress':
      if (chartData.labels && chartData.values) {
        description = 'Progreso por categoría:\n';
        chartData.labels.forEach((label, index) => {
          const value = chartData.values?.[index] ?? 0;
          description += `  - ${label}: ${value}%\n`;
        });
      }
      break;

    case 'stackedBar':
      if (chartData.labels && chartData.series) {
        description = 'Datos apilados por categoría:\n';
        chartData.labels.forEach((label, index) => {
          description += `  - ${label}\n`;
        });
        description += `  - Series: ${chartData.series.join(', ')}\n`;
      }
      break;

    case 'contribution':
      if (chartData.startDate && chartData.endDate) {
        description = `Contribuciones del período ${chartData.startDate} al ${chartData.endDate}.\n`;
        if (chartData.values && chartData.values.length > 0) {
          const sum = chartData.values.reduce((a, b) => a + b, 0);
          const avg = sum / chartData.values.length;
          description += `  - Total de contribuciones: ${sum}\n`;
          description += `  - Promedio diario: ${avg.toFixed(1)}\n`;
          description += `  - Máximo: ${Math.max(...chartData.values)}\n`;
          description += `  - Mínimo: ${Math.min(...chartData.values)}\n`;
        }
      }
      break;

    default:
      if (chartData.labels && chartData.values) {
        description = 'Datos:\n';
        chartData.labels.forEach((label, index) => {
          const value = chartData.values?.[index] ?? 0;
          description += `  - ${label}: ${value}\n`;
        });
      } else {
        description = JSON.stringify(chartData, null, 2);
      }
  }

  return description || 'Sin datos disponibles para mostrar.';
};

export const generateChartAnalysis = async ({
  chartType,
  title,
  category,
  question,
  surveyId,
  chartData
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

    // Formatear los datos del gráfico para incluir en el prompt
    const chartDataDescription = formatChartDataForPrompt(chartData, chartType);

    const prompt = `
Genera un análisis detallado en español para una gráfica de satisfacción ciudadana con las siguientes características:

Título: ${title}
Categoría: ${category}
Pregunta de la encuesta: ${question}
Tipo de gráfica: ${chartType}

DATOS DE LA GRÁFICA:
${chartDataDescription}

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

    const generatedAnalysis = response.choices[0]?.message?.content || 'No se pudo generar el análisis.';
    
    // Validar que el análisis no esté vacío
    if (!generatedAnalysis.trim().length) {
      throw new Error('OpenAI retornó un análisis vacío');
    }
    
    // Si se proporciona surveyId, guardar el reporte en Firebase
    if (surveyId) {
      console.log(`🔄 Guardando reporte en Firebase para surveyId: ${surveyId}`);
      const saveSuccess = await updateSurveyReport(surveyId, generatedAnalysis);
      
      if (saveSuccess) {
        console.log(`✅ Reporte guardado exitosamente en Firebase para ${surveyId}`);
      } else {
        console.warn(`⚠️ No se pudo guardar el reporte en Firebase para ${surveyId}, pero el análisis se mostrará correctamente`);
      }
    } else {
      console.log('ℹ️ No se proporcionó surveyId, el reporte no será almacenado en caché');
    }
    
    return generatedAnalysis;
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