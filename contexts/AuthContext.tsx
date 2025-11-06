import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isGuest: boolean;
  setGuestMode: (isGuest: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isGuest, setIsGuest] = useState(false);

  const login = async (email: string, password: string) => {
    // Aquí puedes implementar tu lógica de autenticación
    setUserEmail(email);
    setIsAuthenticated(true);
    setIsGuest(false);
  };

  const logout = () => {
    setUserEmail('');
    setIsAuthenticated(false);
    setIsGuest(false);
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
        userEmail,
        login,
        logout,
        isGuest,
        setGuestMode,
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