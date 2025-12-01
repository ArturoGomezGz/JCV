/**
 * Servicio para interactuar con la API de mini-spss
 * Base URL: https://mini-spss-production.up.railway.app/
 */

const API_BASE_URL = 'https://mini-spss-production.up.railway.app';

// Tipos para la API
export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Pregunta {
  id: number;
  categoria_id: number;
  texto: string;
  tipo?: string;
}

export interface Filtros {
  calidad_vida?: number;
  municipio?: number;
  sexo?: number;
  edad?: {
    min: number;
    max: number;
  };
  escolaridad?: number;
  nse?: number;
}

export interface Respuesta {
  pregunta_id: number;
  datos: any;
  filtros_aplicados?: Filtros;
}

/**
 * Obtiene la lista de categorías disponibles
 */
export const fetchCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categorias`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw error;
  }
};

/**
 * Obtiene las preguntas de una categoría específica
 */
export const fetchPreguntasByCategoria = async (categoriaId: number): Promise<Pregunta[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/preguntas/categoria/${categoriaId}`);
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al obtener preguntas de categoría ${categoriaId}:`, error);
    throw error;
  }
};

/**
 * Obtiene las respuestas de una pregunta con filtros aplicados
 */
export const fetchRespuestasConFiltros = async (
  questionId: number,
  filtros?: Filtros
): Promise<Respuesta> => {
  try {
    const url = `${API_BASE_URL}/respuestas/${questionId}/filtros`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros || {}),
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al obtener respuestas para pregunta ${questionId}:`, error);
    throw error;
  }
};
