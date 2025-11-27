import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  loginWithEmail, 
  registerWithEmail, 
  logout as firebaseLogout, 
  getUserProfile,
  updateUserProfile as updateUserProfileService,
  updateUserPassword,
  LoginCredentials, 
  RegisterCredentials, 
  AuthResult,
  UserProfile 
} from '../services';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userProfile: UserProfile | null;
  userEmail: string;
  userName: string;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, phone: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (name: string, phone: string, password?: string) => Promise<AuthResult>;
  isGuest: boolean;
  setGuestMode: (isGuest: boolean) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to load user profile from Firestore
  const loadUserProfile = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId);
      if (profile) {
        setUserProfile(profile);
        setUserName(profile.displayName);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setUserEmail(user.email || '');
        setIsAuthenticated(true);
        
        // Load user profile from Firestore
        await loadUserProfile(user.uid);
      } else {
        setUser(null);
        setUserProfile(null);
        setUserEmail('');
        setUserName('');
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    try {
      const result = await loginWithEmail({ email, password });
      if (result.success && result.user) {
        setUser(result.user);
        setUserEmail(result.user.email || '');
        setIsAuthenticated(true);
        setIsGuest(false);
      }
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: 'Error inesperado durante el login'
      };
    }
  };

  const register = async (
    name: string, 
    email: string, 
    phone: string, 
    password: string
  ): Promise<AuthResult> => {
    setLoading(true);
    try {
      const result = await registerWithEmail({
        email,
        password,
        displayName: name,
        phoneNumber: phone
      });
      
      if (result.success && result.user) {
        setUser(result.user);
        setUserEmail(result.user.email || '');
        setIsAuthenticated(true);
        setIsGuest(false);
        
        // Load the newly created profile
        await loadUserProfile(result.user.uid);
      }
      
      setLoading(false);
      return result;
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: 'Error inesperado durante el registro'
      };
    }
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await firebaseLogout();
      setUser(null);
      setUserProfile(null);
      setUserEmail('');
      setUserName('');
      setIsAuthenticated(false);
      setIsGuest(false);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (
    name: string, 
    phone: string, 
    password?: string
  ): Promise<AuthResult> => {
    setLoading(true);
    try {
      if (!user) {
        setLoading(false);
        return {
          success: false,
          error: 'No hay usuario autenticado'
        };
      }

      // Update profile data in Firestore
      const profileResult = await updateUserProfileService(user.uid, {
        displayName: name,
        phoneNumber: phone
      });

      if (!profileResult.success) {
        setLoading(false);
        return {
          success: false,
          error: profileResult.error || 'Error al actualizar el perfil'
        };
      }

      // Update password if provided
      if (password && password.trim()) {
        const passwordResult = await updateUserPassword(password);
        if (!passwordResult.success) {
          setLoading(false);
          return {
            success: false,
            error: passwordResult.error || 'Error al actualizar la contraseña'
          };
        }
      }

      // Reload user profile to reflect changes
      await loadUserProfile(user.uid);
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return {
        success: false,
        error: 'Error inesperado al actualizar el perfil'
      };
    }
  };

  const setGuestMode = (guestMode: boolean) => {
    setIsGuest(guestMode);
    if (guestMode) {
      setIsAuthenticated(true); // Guest mode is considered "authenticated" for navigation
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userProfile,
        userEmail,
        userName,
        login,
        register,
        logout,
        updateProfile,
        isGuest,
        setGuestMode,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};