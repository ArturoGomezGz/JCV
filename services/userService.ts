import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  DocumentData 
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { User } from 'firebase/auth';
import { sanitizeName, sanitizeEmail, sanitizePhone } from '../utils/inputSanitization';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  createdAt: any;
  updatedAt: any;
}

export interface CreateUserProfileData {
  displayName: string;
  email: string;
  phoneNumber: string;
}

/**
 * Create a new user profile in Firestore
 */
export const createUserProfile = async (
  user: User, 
  additionalData: CreateUserProfileData
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Creating user profile for:', user.uid);
    console.log('Additional data:', additionalData);
    
    // Sanitizar todos los datos antes de guardar en Firestore
    const sanitizedDisplayName = sanitizeName(additionalData.displayName);
    const sanitizedEmail = sanitizeEmail(additionalData.email);
    const sanitizedPhoneNumber = sanitizePhone(additionalData.phoneNumber);
    
    const userDocRef = doc(db, 'users', user.uid);
    
    const userData: UserProfile = {
      uid: user.uid,
      displayName: sanitizedDisplayName,
      email: sanitizedEmail,
      phoneNumber: sanitizedPhoneNumber,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    console.log('Attempting to save user data:', userData);
    
    await setDoc(userDocRef, userData);
    
    console.log('User profile created successfully');
    return { success: true };
  } catch (error) {
    console.error('Detailed error creating user profile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return { 
      success: false, 
      error: `Error al crear el perfil del usuario: ${errorMessage}` 
    };
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (
  uid: string, 
  updateData: Partial<CreateUserProfileData>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    
    // Sanitizar los datos de actualización
    const sanitizedData: any = {};
    
    if (updateData.displayName !== undefined) {
      sanitizedData.displayName = sanitizeName(updateData.displayName);
    }
    
    if (updateData.email !== undefined) {
      sanitizedData.email = sanitizeEmail(updateData.email);
    }
    
    if (updateData.phoneNumber !== undefined) {
      sanitizedData.phoneNumber = sanitizePhone(updateData.phoneNumber);
    }
    
    await updateDoc(userDocRef, {
      ...sanitizedData,
      updatedAt: serverTimestamp(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { 
      success: false, 
      error: 'Error al actualizar el perfil' 
    };
  }
};