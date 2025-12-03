import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  signOut,
  User,
  AuthError
} from 'firebase/auth';
import { auth } from './firebaseConfig';
import { createUserProfile, CreateUserProfileData } from './userService';
import { sanitizeEmail, sanitizeName, sanitizePhone } from '../utils/inputSanitization';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
  phoneNumber: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Register new user with email and password
 */
export const registerWithEmail = async (credentials: RegisterCredentials): Promise<AuthResult> => {
  try {
    // Sanitizar inputs de texto antes de procesarlos (no contraseña)
    const sanitizedEmail = sanitizeEmail(credentials.email);
    const sanitizedDisplayName = sanitizeName(credentials.displayName);
    const sanitizedPhoneNumber = sanitizePhone(credentials.phoneNumber);
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      sanitizedEmail,
      credentials.password
    );
    
    // Update user profile in Auth
    await updateProfile(userCredential.user, {
      displayName: sanitizedDisplayName
    });
    
    // Create user profile in Firestore
    const profileResult = await createUserProfile(userCredential.user, {
      displayName: sanitizedDisplayName,
      email: sanitizedEmail,
      phoneNumber: sanitizedPhoneNumber
    });
    
    if (!profileResult.success) {
      // If Firestore fails, we should ideally delete the Auth user
      // But for now, we'll just log the error
      console.error('Failed to create user profile:', profileResult.error);
    }
    
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    const authError = error as AuthError;
    let errorMessage = 'Error al crear la cuenta';
    
    // Handle specific Firebase auth errors
    switch (authError.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'El email ya está en uso';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'Operación no permitida';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña es muy débil';
        break;
      default:
        errorMessage = authError.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Login with email and password
 */
export const loginWithEmail = async (credentials: LoginCredentials): Promise<AuthResult> => {
  try {
    // Sanitizar solo el email (no la contraseña para permitir login con contraseñas existentes)
    const sanitizedEmail = sanitizeEmail(credentials.email);
    
    const userCredential = await signInWithEmailAndPassword(
      auth,
      sanitizedEmail,
      credentials.password
    );
    
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    const authError = error as AuthError;
    let errorMessage = 'Error al iniciar sesión';
    
    // Handle specific Firebase auth errors
    switch (authError.code) {
      case 'auth/user-not-found':
        errorMessage = 'Usuario no encontrado';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Usuario deshabilitado';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos. Intenta más tarde';
        break;
      default:
        errorMessage = authError.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<AuthResult> => {
  try {
    await signOut(auth);
    return {
      success: true
    };
  } catch (error) {
    const authError = error as AuthError;
    return {
      success: false,
      error: authError.message
    };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Update user password
 */
export const updateUserPassword = async (newPassword: string): Promise<AuthResult> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: 'No hay usuario autenticado'
      };
    }
    
    // No sanitizar contraseña - dejar que Firebase valide
    await updatePassword(user, newPassword);
    return {
      success: true
    };
  } catch (error) {
    const authError = error as AuthError;
    let errorMessage = 'Error al actualizar la contraseña';
    
    switch (authError.code) {
      case 'auth/weak-password':
        errorMessage = 'La contraseña es muy débil';
        break;
      case 'auth/requires-recent-login':
        errorMessage = 'Por seguridad, debes volver a iniciar sesión para cambiar tu contraseña';
        break;
      default:
        errorMessage = authError.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};