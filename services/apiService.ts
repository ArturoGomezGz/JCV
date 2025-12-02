/**
 * Servicio para interactuar con la API de mini-spss
 * Base URL: https://mini-spss-production.up.railway.app/
 */

const API_BASE_URL = 'https://mini-spss-production.up.railway.app';

// Types for API responses
export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Pregunta {
  identificador: string;
  pregunta: string;
  categoria: {
    id: number;
    nombre: string;
  } | null;
  opciones: Array<{
    value: number;
    label: string;
  }>;
}

export interface RangoEdad {
  min?: number | null;
  max?: number | null;
}

export interface Filtros {
  calidad_vida?: number | null;
  municipio?: number | null;
  sexo?: number | null;
  edad?: RangoEdad | null;
  escolaridad?: number | null;
  nse?: number | null;
}

export interface Respuesta {
  value: number;
  label: string;
  cantidad?: number;
  porcentaje?: number;
}

export interface RespuestasResult {
  identificador: string;
  pregunta: string;
  tipo_respuesta: 'cantidad' | 'porcentaje';
  respuestas: Respuesta[];
  total_respuestas: number;
  filtros_aplicados?: Filtros;
}

/**
 * Obtiene todas las categorías disponibles
 */
export const fetchCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categorias`);
    if (!response.ok) {
      throw new Error(`Error fetching categorias: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en fetchCategorias:', error);
    throw error;
  }
};

/**
 * Obtiene todas las preguntas de una categoría específica
 * @param categoriaId - ID de la categoría (1-13)
 */
export const fetchPreguntasByCategoria = async (categoriaId: number): Promise<Pregunta[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/preguntas/categoria/${categoriaId}`);
    if (!response.ok) {
      throw new Error(`Error fetching preguntas: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en fetchPreguntasByCategoria:', error);
    throw error;
  }
};

/**
 * Obtiene las respuestas de una pregunta específica con filtros aplicados
 * @param questionId - ID de la pregunta (ej: Q_1, T_Q_12_1)
 * @param filtros - Objeto con los filtros a aplicar
 * @param tipo - Tipo de respuesta: 'cantidad' o 'porcentaje'
 */
export const fetchRespuestasConFiltros = async (
  questionId: string,
  filtros: Filtros = {},
  tipo: 'cantidad' | 'porcentaje' = 'cantidad'
): Promise<RespuestasResult> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/respuestas/${questionId}/filtros?tipo=${tipo}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtros),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching respuestas: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en fetchRespuestasConFiltros:', error);
    throw error;
  }
};
