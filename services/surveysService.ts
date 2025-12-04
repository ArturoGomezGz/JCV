/**
 * Servicio para manejar datos de encuestas de satisfacción ciudadana
 * Obtiene datos desde Firestore en la colección 'feed'
 */

import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Definición de tipos para las encuestas
export interface SurveyData {
  id: string;
  title: string;
  category: string;
  question: string;
  chartType: 'bar' | 'line' | 'pie' | 'progress' | 'contribution' | 'stackedBar' | 'bezierLine' | 'areaChart' | 'horizontalBar';
  description: string;
  chartData: any; // Estructura flexible para diferentes tipos de gráficos
}

export interface SurveysResponse {
  surveys: SurveyData[];
}

/**
 * Obtiene todas las encuestas desde la colección 'feed' en Firestore
 * Los documentos usan su ID como identificador (ej: "001", "002", etc.)
 */
export const fetchSurveys = async (): Promise<SurveyData[]> => {
  try {
    // Obtener todos los documentos de la colección 'feed'
    const feedCollection = collection(db, 'feed');
    const querySnapshot = await getDocs(feedCollection);
    
    // Mapear documentos a formato SurveyData
    const surveys: SurveyData[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      // El ID del documento se usa como el ID de la encuesta
      surveys.push({
        id: docSnapshot.id,
        title: data.title,
        category: data.category,
        question: data.question,
        chartType: data.chartType,
        description: data.description,
        chartData: data.chartData
      });
    });
    
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
    
    const data = docSnapshot.data();
    return {
      id: docSnapshot.id,
      title: data.title,
      category: data.category,
      question: data.question,
      chartType: data.chartType,
      description: data.description,
      chartData: data.chartData
    };
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