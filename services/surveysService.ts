/**
 * Servicio para manejar datos de encuestas de satisfacción ciudadana
 * Obtiene datos desde Firestore en la colección 'feed'
 */

import { collection, getDocs, doc, getDoc, query, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Definición de tipos para las encuestas
export interface SurveyData {
  title: string;
  category: string;
  question: string;
  chartType: 'bar' | 'line' | 'pie' | 'progress' | 'contribution' | 'stackedBar' | 'bezierLine' | 'areaChart' | 'horizontalBar';
  description: string;
  chartData: any; // Estructura flexible para diferentes tipos de gráficos
  report?: string; // Campo opcional para almacenar el reporte generado por IA en formato Markdown
}

export interface SurveysResponse {
  surveys: SurveyData[];
}



/**
 * Valida y mapea un documento de Firestore a SurveyData
 * @param docId ID del documento de Firestore
 * @param data Datos del documento (incluye chartData como map)
 * @returns SurveyData o null si la validación falla
 */
const mapFirestoreDocToSurvey = (docId: string, data: any): SurveyData | null => {
  // Validar que existan todos los campos requeridos
  if (!data.title || !data.category || !data.question || 
      !data.chartType || !data.description || !data.chartData) {
    console.warn(`Documento ${docId} tiene campos faltantes, será omitido`);
    return null;
  }
  
  return {
    title: data.title,
    category: data.category,
    question: data.question,
    chartType: data.chartType,
    description: data.description,
    chartData: data.chartData,
    report: data.report // Campo opcional para reportes cacheados
  };
};

/**
 * Obtiene todas las encuestas desde la colección 'feed' en Firestore
 * Los documentos usan su ID como identificador (ej: "001", "002", etc.)
 * El chartData ahora es un map directo en el documento, no una subcolección
 */
export const fetchSurveys = async (): Promise<SurveyData[]> => {
  try {
    // Obtener todos los documentos de la colección 'feed'
    const feedCollection = collection(db, 'feed');
    const querySnapshot = await getDocs(feedCollection);
    
    // Mapear documentos a formato SurveyData
    const surveys: SurveyData[] = [];
    
    for (const docSnapshot of querySnapshot.docs) {
      const survey = mapFirestoreDocToSurvey(docSnapshot.id, docSnapshot.data());
      if (survey) {
        surveys.push(survey);
      }
    }
    
    return surveys;
  } catch (error) {
    console.error('Error cargando datos de encuestas desde Firestore:', error);
    throw new Error('No se pudieron cargar los datos de las encuestas');
  }
};

/**
 * Obtiene una encuesta específica por ID desde Firestore
 */
export const fetchSurveyById = async (id: string): Promise<SurveyData | null> => {
  try {
    const docRef = doc(db, 'feed', id);
    const docSnapshot = await getDoc(docRef);
    
    if (!docSnapshot.exists()) {
      return null;
    }
    
    return mapFirestoreDocToSurvey(docSnapshot.id, docSnapshot.data());
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
    
    return {
      totalSurveys: surveys.length,
      categories: [...new Set(surveys.map(s => s.category))].length,
      chartTypes: [...new Set(surveys.map(s => s.chartType))].length
    };
  } catch (error) {
    console.error('Error calculando estadísticas:', error);
    return null;
  }
};

/**
 * Actualiza el campo 'report' de una encuesta en Firestore
 * Esta operación es silenciosa - no lanza errores si falla
 * @param surveyId ID de la encuesta a actualizar
 * @param report Contenido del reporte en formato Markdown
 * @returns true si la actualización fue exitosa, false en caso contrario
 */
export const updateSurveyReport = async (surveyId: string, report: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'feed', surveyId);
    
    await updateDoc(docRef, {
      report: report
    });
    
    return true;
  } catch (error) {
    // No lanzar errores - solo loguear silenciosamente
    console.warn(`No se pudo guardar el reporte en Firebase para ${surveyId}. El análisis se mostrará normalmente.`, error);
    return false;
  }
};