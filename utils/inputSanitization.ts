/**
 * Input Sanitization and Validation Utilities
 * 
 * Este módulo proporciona funciones para sanitizar y validar inputs del usuario,
 * previniendo inyecciones SQL y otros ataques de seguridad.
 */

/**
 * Caracteres peligrosos que pueden ser usados para SQL injection u otros ataques
 */
const DANGEROUS_CHARS = /['"`;{}|<>\\]/g;

/**
 * Patrón para validar emails
 */
const EMAIL_PATTERN = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Patrón para números de teléfono (solo dígitos, espacios y guiones)
 */
const PHONE_PATTERN = /^[\d\s-]+$/;

/**
 * Sanitiza un string removiendo caracteres peligrosos que puedan causar SQL injection
 * @param input - String a sanitizar
 * @returns String sanitizado
 */
export const sanitizeGenericInput = (input: string): string => {
  if (!input) return '';
  return input.replace(DANGEROUS_CHARS, '').trim();
};

/**
 * Sanitiza un nombre permitiendo solo letras, números, espacios y algunos caracteres especiales seguros
 * @param name - Nombre a sanitizar
 * @returns Nombre sanitizado
 */
export const sanitizeName = (name: string): string => {
  if (!name) return '';
  // Permite letras (incluyendo acentos), números, espacios, guiones y apóstrofes
  // Remueve caracteres peligrosos y limita a caracteres seguros
  return name
    .replace(DANGEROUS_CHARS, '')
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s'-]/g, '')
    .trim()
    .slice(0, 100); // Limita longitud máxima
};

/**
 * Sanitiza un email removiendo caracteres peligrosos
 * @param email - Email a sanitizar
 * @returns Email sanitizado
 */
export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  // Remueve espacios y caracteres peligrosos, mantiene solo caracteres válidos para emails
  return email
    .toLowerCase()
    .trim()
    .replace(/['"`;{}|<>\\]/g, '')
    .replace(/\s/g, '')
    .slice(0, 254); // Límite RFC para emails
};

/**
 * Sanitiza un número de teléfono permitiendo solo dígitos
 * @param phone - Número de teléfono a sanitizar
 * @returns Teléfono sanitizado (solo dígitos)
 */
export const sanitizePhone = (phone: string): string => {
  if (!phone) return '';
  // Remueve todo excepto dígitos
  return phone.replace(/\D/g, '').slice(0, 15); // Limita a 15 dígitos (estándar internacional)
};

/**
 * Sanitiza una contraseña removiendo caracteres extremadamente peligrosos
 * pero permitiendo caracteres especiales comunes en contraseñas seguras
 * @param password - Contraseña a sanitizar
 * @returns Contraseña sanitizada
 */
export const sanitizePassword = (password: string): string => {
  if (!password) return '';
  // Solo remueve caracteres que definitivamente no deberían estar en una contraseña
  // y que podrían causar problemas de seguridad
  return password
    .replace(/[<>{}|\\]/g, '')
    .slice(0, 128); // Limita longitud máxima razonable
};

/**
 * Valida si un email tiene formato correcto
 * @param email - Email a validar
 * @returns true si el email es válido
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const sanitized = sanitizeEmail(email);
  return EMAIL_PATTERN.test(sanitized);
};

/**
 * Valida si un número de teléfono tiene formato correcto (10 dígitos)
 * @param phone - Teléfono a validar
 * @returns true si el teléfono es válido
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone) return false;
  const sanitized = sanitizePhone(phone);
  // Valida que tenga entre 10 y 15 dígitos
  return sanitized.length >= 10 && sanitized.length <= 15;
};

/**
 * Valida si un nombre es válido (no vacío y sin caracteres peligrosos)
 * @param name - Nombre a validar
 * @returns true si el nombre es válido
 */
export const isValidName = (name: string): boolean => {
  if (!name) return false;
  const sanitized = sanitizeName(name);
  return sanitized.length > 0 && sanitized.length <= 100;
};

/**
 * Valida si una contraseña cumple con requisitos mínimos de seguridad
 * @param password - Contraseña a validar
 * @param minLength - Longitud mínima (default: 6)
 * @returns true si la contraseña es válida
 */
export const isValidPassword = (password: string, minLength: number = 6): boolean => {
  if (!password) return false;
  const sanitized = sanitizePassword(password);
  return sanitized.length >= minLength && sanitized.length <= 128;
};

/**
 * Valida y sanitiza un objeto con datos de usuario
 * @param data - Objeto con datos a sanitizar
 * @returns Objeto con datos sanitizados
 */
export interface UserInputData {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export const sanitizeUserInput = (data: UserInputData): UserInputData => {
  const sanitized: UserInputData = {};
  
  if (data.name !== undefined) {
    sanitized.name = sanitizeName(data.name);
  }
  
  if (data.email !== undefined) {
    sanitized.email = sanitizeEmail(data.email);
  }
  
  if (data.phone !== undefined) {
    sanitized.phone = sanitizePhone(data.phone);
  }
  
  if (data.password !== undefined) {
    sanitized.password = sanitizePassword(data.password);
  }
  
  return sanitized;
};
