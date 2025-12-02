export { generateChartAnalysis } from './openaiService';
export type { ChartAnalysisParams } from './openaiService';

export { 
  fetchSurveys, 
  fetchSurveyById, 
  fetchSurveysByCategory, 
  fetchCategories, 
  fetchSurveyStats 
} from './surveysService';

// Export Firebase configuration
export { app as firebaseApp, auth, db } from './firebaseConfig';

// Export Auth service
export { 
  loginWithEmail, 
  registerWithEmail,
  logout, 
  getCurrentUser,
  updateUserPassword 
} from './authService';
export type { LoginCredentials, RegisterCredentials, AuthResult } from './authService';

// Export User service
export { 
  createUserProfile, 
  getUserProfile, 
  updateUserProfile 
} from './userService';
export type { UserProfile, CreateUserProfileData } from './userService';
export type { SurveyData, SurveysResponse } from './surveysService';

// Export Mini SPSS API service
export {
  fetchCategorias,
  fetchPreguntasPorCategoria,
  fetchRespuestasConFiltros,
  fetchTodasLasPreguntas,
  FILTER_LABELS
} from './miniSpssApiService';
export type {
  Categoria,
  OpcionRespuesta,
  Pregunta,
  RangoEdad,
  Filtros,
  RespuestaItem,
  RespuestasResponse
} from './miniSpssApiService';