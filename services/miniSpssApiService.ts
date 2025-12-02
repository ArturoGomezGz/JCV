/**
 * Service for interacting with the mini-spss API
 * API Base URL: https://mini-spss-production.up.railway.app/
 */

const API_BASE_URL = 'https://mini-spss-production.up.railway.app';

// Type definitions based on API documentation

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface OpcionRespuesta {
  value: number;
  label: string;
}

export interface Pregunta {
  identificador: string;
  pregunta: string;
  categoria: {
    id: number;
    nombre: string;
  } | null;
  opciones: OpcionRespuesta[];
}

export interface RangoEdad {
  min: number | null;
  max: number | null;
}

export interface Filtros {
  calidad_vida?: number | null;
  municipio?: number | null;
  sexo?: number | null;
  edad?: RangoEdad | null;
  escolaridad?: number | null;
  nse?: number | null;
}

export interface RespuestaItem {
  value: number;
  label: string;
  count?: number;
  percentage?: number;
}

export interface RespuestasResponse {
  identificador: string;
  pregunta: string;
  tipo_respuesta: 'cantidad' | 'porcentaje';
  respuestas: RespuestaItem[];
  total_respuestas: number;
  filtros_aplicados?: Filtros;
}

/**
 * Get all available categories
 */
export const fetchCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categorias`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categorias:', error);
    throw new Error('No se pudieron cargar las categorías');
  }
};

/**
 * Get all questions for a specific category
 * @param categoriaId - Category ID (1-13)
 */
export const fetchPreguntasPorCategoria = async (categoriaId: number): Promise<Pregunta[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/preguntas/categoria/${categoriaId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching preguntas for categoria ${categoriaId}:`, error);
    throw new Error('No se pudieron cargar las preguntas de la categoría');
  }
};

/**
 * Get responses for a specific question with filters
 * @param questionId - Question identifier (e.g., Q_1, T_Q_12_1)
 * @param filtros - Filter criteria to apply
 * @param tipo - Response type: 'cantidad' or 'porcentaje'
 */
export const fetchRespuestasConFiltros = async (
  questionId: string,
  filtros: Filtros = {},
  tipo: 'cantidad' | 'porcentaje' = 'cantidad'
): Promise<RespuestasResponse> => {
  try {
    const url = `${API_BASE_URL}/respuestas/${questionId}/filtros?tipo=${tipo}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filtros),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching respuestas for question ${questionId}:`, error);
    throw new Error('No se pudieron cargar las respuestas de la pregunta');
  }
};

/**
 * Get all questions (without category filter)
 */
export const fetchTodasLasPreguntas = async (): Promise<Pregunta[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/preguntas`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching todas las preguntas:', error);
    throw new Error('No se pudieron cargar las preguntas');
  }
};

// Filter option labels for UI
export const FILTER_LABELS = {
  calidad_vida: {
    1: '1-2 (Baja)',
    2: '3 (Media)',
    3: '4-5 (Alta)',
  },
  municipio: {
    1: 'El Salto',
    2: 'Guadalajara',
    3: 'San Pedro Tlaquepaque',
    4: 'Tlajomulco de Zúñiga',
    5: 'Tonalá',
    6: 'Zapopan',
  },
  sexo: {
    1: 'Hombre',
    2: 'Mujer',
  },
  escolaridad: {
    1: 'Sec<',
    2: 'Prep',
    3: 'Univ+',
  },
  nse: {
    1: 'D+/D/E',
    2: 'C/C-',
    3: 'A/B/C+',
    4: 'Sin datos suficientes',
  },
};
