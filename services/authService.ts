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
    
    // Return the error code or message for the alert utility to handle
    return {
      success: false,
      error: authError.code || authError.message
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
    
    // Return the error code or message for the alert utility to handle
    return {
      success: false,
      error: authError.code || authError.message
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
    
    // Return the error code or message for the alert utility to handle
    return {
      success: false,
      error: authError.code || authError.message
    };
  }
};