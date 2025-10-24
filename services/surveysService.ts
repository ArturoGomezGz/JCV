/**
 * Servicio para manejar datos de encuestas de satisfacción ciudadana
 * 
 * TODO: En el futuro, reemplazar la importación de JSON local con llamadas HTTP a la API real
 * TODO: Implementar manejo de errores de red y timeouts
 * TODO: Agregar sistema de caché para optimizar rendimiento
 * TODO: Implementar autenticación para acceso a la API
 */

import surveysData from '../data/surveysData.json';

// Definición de tipos para las encuestas
export interface SurveyData {
  id: string;
  title: string;
  category: string;
  question: string;
  chartType: 'bar' | 'line' | 'pie' | 'progress' | 'contribution' | 'stackedBar' | 'bezierLine' | 'areaChart' | 'horizontalBar';
  description: string;
  metadata: {
    totalResponses: number;
    averageScore: number;
    lastUpdated: string;
  };
}

export interface SurveysResponse {
  surveys: SurveyData[];
  metadata: {
    version: string;
    lastSync: string;
    totalSurveys: number;
    apiEndpoint: string;
    notes: string[];
  };
}

/**
 * Simula una llamada a API para obtener todas las encuestas
 * TODO: Reemplazar con fetch() a la API real cuando esté disponible
 */
export const fetchSurveys = async (): Promise<SurveyData[]> => {
  try {
    // Simular delay de red (remover cuando se implemente API real)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // TODO: Reemplazar con:
    // const response = await fetch('https://api.satisfaccion-ciudadana.gob.mx/v1/surveys');
    // const data: SurveysResponse = await response.json();
    // return data.surveys;
    
    const data = surveysData as SurveysResponse;
    return data.surveys;
  } catch (error) {
    console.error('Error cargando datos de encuestas:', error);
    
    // TODO: Implementar manejo de errores más robusto
    // TODO: Implementar fallback a datos en caché
    throw new Error('No se pudieron cargar los datos de las encuestas');
  }
};

/**
 * Obtiene una encuesta específica por ID
 * TODO: Implementar endpoint específico en la API para obtener encuesta individual
 */
export const fetchSurveyById = async (id: string): Promise<SurveyData | null> => {
  try {
    const surveys = await fetchSurveys();
    return surveys.find(survey => survey.id === id) || null;
  } catch (error) {
    console.error(`Error cargando encuesta ${id}:`, error);
    return null;
  }
};

/**
 * Filtra encuestas por categoría
 * TODO: Implementar filtros en el lado del servidor para mejor rendimiento
 */
export const fetchSurveysByCategory = async (category: string): Promise<SurveyData[]> => {
  try {
    const surveys = await fetchSurveys();
    return surveys.filter(survey => 
      survey.category.toLowerCase().includes(category.toLowerCase())
    );
  } catch (error) {
    console.error(`Error cargando encuestas de categoría ${category}:`, error);
    return [];
  }
};

/**
 * Obtiene las categorías únicas de encuestas
 * TODO: Implementar endpoint dedicado para obtener lista de categorías
 */
export const fetchCategories = async (): Promise<string[]> => {
  try {
    const surveys = await fetchSurveys();
    const categories = [...new Set(surveys.map(survey => survey.category))];
    return categories.sort();
  } catch (error) {
    console.error('Error cargando categorías:', error);
    return [];
  }
};

/**
 * Obtiene estadísticas generales de las encuestas
 * TODO: Implementar en el backend para cálculos más eficientes
 */
export const fetchSurveyStats = async () => {
  try {
    const surveys = await fetchSurveys();
    
    const totalResponses = surveys.reduce((sum, survey) => 
      sum + survey.metadata.totalResponses, 0
    );
    
    const averageScore = surveys.reduce((sum, survey) => 
      sum + survey.metadata.averageScore, 0
    ) / surveys.length;
    
    return {
      totalSurveys: surveys.length,
      totalResponses,
      averageScore: Math.round(averageScore * 10) / 10,
      lastUpdate: Math.max(...surveys.map(s => 
        new Date(s.metadata.lastUpdated).getTime()
      ))
    };
  } catch (error) {
    console.error('Error calculando estadísticas:', error);
    return null;
  }
};