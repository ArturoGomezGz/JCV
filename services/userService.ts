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
    
    const userDocRef = doc(db, 'users', user.uid);
    
    const userData: UserProfile = {
      uid: user.uid,
      displayName: additionalData.displayName,
      email: additionalData.email,
      phoneNumber: additionalData.phoneNumber,
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
    
    await updateDoc(userDocRef, {
      ...updateData,
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