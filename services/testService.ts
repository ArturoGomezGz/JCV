import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

/**
 * Test Firestore connection
 */
export const testFirestore = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Testing Firestore connection...');
    
    // Try to write a test document
    const testDocRef = doc(db, 'test', 'connection');
    await setDoc(testDocRef, {
      message: 'Test connection',
      timestamp: new Date().toISOString()
    });
    
    console.log('Test document written successfully');
    
    // Try to read the test document
    const testDoc = await getDoc(testDocRef);
    
    if (testDoc.exists()) {
      console.log('Test document read successfully:', testDoc.data());
      return { success: true };
    } else {
      return { success: false, error: 'Could not read test document' };
    }
  } catch (error) {
    console.error('Firestore test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return { success: false, error: errorMessage };
  }
};